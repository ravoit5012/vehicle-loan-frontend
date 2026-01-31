import { CollectionFrequency } from "./collection-frequency.enum";
import { FeesPaymentMethod } from "./fee-payment.enum";

export function getPeriodsPerYear(freq: CollectionFrequency): number {
    switch (freq) {
        case 'WEEKLY': return 52;
        case 'BIWEEKLY': return 26;
        case 'MONTHLY': return 12;
        case 'QUARTERLY': return 4;
        default: throw new Error('Invalid frequency');
    }
}

export function getTotalInstallments(
    durationMonths: number,
    freq: CollectionFrequency
): number {
    const N = getPeriodsPerYear(freq);
    return Math.round((durationMonths * N) / 12);
}

export function calculateFee(
    principal: number,
    fee: { amount: number; isPercentage: boolean }
): number {
    if (fee.isPercentage) {
        return (principal * fee.amount) / 100;
    }
    return fee.amount;
}


type Fee = {
  amount: number;
  isPercentage: boolean;
};


export function calculateTotalFees(
  principal: number,
  processingFee: Fee,
  insuranceFee: Fee,
  additionalFees: any[],
  otherFees:any[]
): number {
  let total = 0;

  total += calculateFee(principal, processingFee);
  total += calculateFee(principal, insuranceFee);

  for (const fee of otherFees) {
    total += calculateFee(principal, fee);
  }
  for (const fee of additionalFees) {
    total += calculateFee(principal, fee);
  }

  return total;
}

export function calculateFlatLoan(
  principal: number,
  annualRate: number,
  durationMonths: number,
  freq: CollectionFrequency
) {
  const totalInterest =
    principal * (annualRate / 100) * (durationMonths / 12);

  const totalPayable = principal + totalInterest;
  const installments = getTotalInstallments(durationMonths, freq);
  const emi = totalPayable / installments;

  return {
    emi,
    totalInterest,
    totalPayable,
    installments,
  };
}

export function calculateReducingLoan(
  principal: number,
  annualRate: number,
  durationMonths: number,
  freq: CollectionFrequency
) {
  const N = getPeriodsPerYear(freq);
  const r = annualRate / (100 * N);
  const n = getTotalInstallments(durationMonths, freq);

  const emi =
    (principal * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  const totalPayable = emi * n;
  const totalInterest = totalPayable - principal;

  return {
    emi,
    totalInterest,
    totalPayable,
    installments: n,
  };
}


interface EmiScheduleItem {
  emiNumber: number;
  dueDate: Date;
  emiAmount: number;
  paidAmount: number;
  penaltyAmount: number;
  status: string;
}
export function generateEmiSchedule(
  emi: number,
  firstEmiDate: Date,
  installments: number,
  freq: CollectionFrequency
): EmiScheduleItem[] {
  const schedule: EmiScheduleItem[] = [];  // Explicitly type the schedule array
  let currentDate = new Date(firstEmiDate);

  for (let i = 1; i <= installments; i++) {
    schedule.push({
      emiNumber: i,
      dueDate: new Date(currentDate),
      emiAmount: emi,
      paidAmount: 0,
      penaltyAmount: 0,
      status: 'PENDING',
    });

    switch (freq) {
      case CollectionFrequency.WEEKLY:
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case CollectionFrequency.BIWEEKLY:
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case CollectionFrequency.MONTHLY:
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case CollectionFrequency.QUARTERLY:
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
    }
  }

  return schedule;
}

export function calculateDisbursedAmount(
  principal: number,
  totalFees: number,
  method: FeesPaymentMethod
): number {
  if (method === 'DEDUCTED') {
    return principal - totalFees;
  }
  return principal;
}

type PenaltyRule = {
  gracePeriodDays: number;
  penaltyType: 'FIXED' | 'PERCENTAGE';
  frequency?: 'ONE_TIME' | 'DAILY';
  value: number;
};

export function calculatePenalty(
  emiAmount: number,
  dueDate: Date,
  paidDate: Date,
  rule:PenaltyRule
): number {
  const graceEnd = new Date(dueDate);
  graceEnd.setDate(graceEnd.getDate() + rule.gracePeriodDays);

  if (paidDate <= graceEnd) return 0;

  const delayDays =
    Math.ceil(
      (paidDate.getTime() - graceEnd.getTime()) / (1000 * 3600 * 24)
    );

  if (rule.penaltyType === 'FIXED') {
    return rule.frequency === 'ONE_TIME'
      ? rule.value
      : rule.value * delayDays;
  }

  // Percentage
  return emiAmount * (rule.value / 100) * delayDays;
}
