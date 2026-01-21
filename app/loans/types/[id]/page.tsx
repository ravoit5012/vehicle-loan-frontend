// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import { API_ENDPOINTS } from '@/app/config/config';

// /* ============================== TYPES ============================= */

// interface Fee {
//   amount: number;
//   isPercentage: boolean;
//   description?: string;
// }

// interface LoanType {
//   id: string;
//   loanName: string;
//   status: 'ACTIVE' | 'INACTIVE';
//   description: string;
//   minAmount: number;
//   maxAmount: number;
//   interestRate: number;
//   interestType: 'FLAT' | 'REDUCING';
//   loanDuration: number;
//   collectionFreq: 'MONTHLY' | 'WEEKLY';
//   processingFees: Fee;
//   insuranceFees: Fee;
//   otherFees: Fee[];
//   createdAt: string;
//   updatedAt: string;
// }

// /* ============================== PAGE ============================== */

// export default function LoanTypePage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const mode = searchParams.get('mode') ?? 'view';
//   const isEdit = mode === 'edit';

//   const [loading, setLoading] = useState(true);
//   const [loan, setLoan] = useState<LoanType | null>(null);
//   const [form, setForm] = useState<Partial<LoanType>>({});
//   const [saving, setSaving] = useState(false);

//   /* ============================ FETCH ============================ */

//   useEffect(() => {
//     if (!id) return;

//     const fetchLoan = async () => {
//       const res = await axios.get(
//         `${API_ENDPOINTS.GET_LOAN_TYPE_BY_ID}/${id}`
//       );
//       setLoan(res.data);
//       setForm(res.data);
//       setLoading(false);
//     };

//     fetchLoan();
//   }, [id]);

//   /* ============================ HELPERS =========================== */

//   const updateField = (key: keyof LoanType, value: any) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   const diffPayload = useMemo(() => {
//     if (!loan) return {};
//     const payload: any = {};

//     Object.keys(form).forEach(key => {
//       const k = key as keyof LoanType;
//       if (JSON.stringify(form[k]) !== JSON.stringify(loan[k])) {
//         payload[k] = form[k];
//       }
//     });

//     return payload;
//   }, [form, loan]);

//   /* ============================ ACTIONS =========================== */

//   const handleSave = async () => {
//     if (!Object.keys(diffPayload).length) {
//       router.push(`/loans/types/${id}?mode=view`);
//       return;
//     }

//     setSaving(true);
//     await axios.patch(
//       `${API_ENDPOINTS.UPDATE_LOAN_TYPE}/${id}`,
//       diffPayload
//     );
//     router.refresh();
//     router.push(`/loans/types/${id}?mode=view`);
//   };

//   const handleDelete = async () => {
//     if (!confirm('Delete this loan type permanently?')) return;
//     await axios.delete(`${API_ENDPOINTS.DELETE_LOAN_TYPE}/${id}`);
//     router.push('/loans/types');
//   };

//   if (loading || !loan) return null;

//   /* ============================== UI ============================== */

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto space-y-8">

//         {/* ========================== HEADER ========================== */}
//         <div className="bg-white rounded-lg border px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-start gap-4">
//             <div className="text-4xl">💳</div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {loan.loanName}
//               </h1>
//               <p className="text-gray-600 text-sm">
//                 Loan type configuration & details
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             {!isEdit && (
//               <button
//                 onClick={() =>
//                   router.push(`/loans/types/${id}?mode=edit`)
//                 }
//                 className="btn-primary"
//               >
//                 ✎ Edit
//               </button>
//             )}
//             <button
//               onClick={() => router.push('/loans/types')}
//               className="btn-secondary"
//             >
//               ← Back
//             </button>
//           </div>
//         </div>

//         {/* ========================== GRID ============================ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           {/* BASIC INFO */}
//           <Card title="Basic Information" icon="ℹ️" color="bg-blue-600">
//             <Row label="Loan Name">
//               {isEdit ? (
//                 <Input
//                   value={form.loanName ?? ''}
//                   onChange={v => updateField('loanName', v)}
//                 />
//               ) : (
//                 loan.loanName
//               )}
//             </Row>

//             <Row label="Status">
//               {isEdit ? (
//                 <Select
//                   value={form.status ?? 'ACTIVE'}
//                   onChange={v => updateField('status', v)}
//                   options={['ACTIVE', 'INACTIVE']}
//                 />
//               ) : (
//                 <Badge value={loan.status} />
//               )}
//             </Row>

//             <Row label="Description">
//               {isEdit ? (
//                 <Textarea
//                   value={form.description ?? ''}
//                   onChange={v => updateField('description', v)}
//                 />
//               ) : (
//                 loan.description
//               )}
//             </Row>
//           </Card>

//           {/* FINANCIAL */}
//           <Card title="Financial Details" icon="📊" color="bg-green-600">
//             <Row label="Interest Rate (%)">
//               {isEdit ? (
//                 <NumberInput
//                   value={form.interestRate ?? 0}
//                   onChange={v => updateField('interestRate', v)}
//                 />
//               ) : (
//                 `${loan.interestRate}%`
//               )}
//             </Row>

//             <Row label="Interest Type">
//               {isEdit ? (
//                 <Select
//                   value={form.interestType ?? 'FLAT'}
//                   onChange={v => updateField('interestType', v)}
//                   options={['FLAT', 'REDUCING']}
//                 />
//               ) : (
//                 <Badge value={loan.interestType} />
//               )}
//             </Row>

//             <Row label="Min Amount">
//               {isEdit ? (
//                 <NumberInput
//                   value={form.minAmount ?? 0}
//                   onChange={v => updateField('minAmount', v)}
//                 />
//               ) : (
//                 `₹${loan.minAmount}`
//               )}
//             </Row>

//             <Row label="Max Amount">
//               {isEdit ? (
//                 <NumberInput
//                   value={form.maxAmount ?? 0}
//                   onChange={v => updateField('maxAmount', v)}
//                 />
//               ) : (
//                 `₹${loan.maxAmount}`
//               )}
//             </Row>

//             <Row label="Loan Duration (months)">
//               {isEdit ? (
//                 <NumberInput
//                   value={form.loanDuration ?? 0}
//                   onChange={v => updateField('loanDuration', v)}
//                 />
//               ) : (
//                 loan.loanDuration
//               )}
//             </Row>

//             <Row label="Collection Frequency">
//               {isEdit ? (
//                 <Select
//                   value={form.collectionFreq ?? 'MONTHLY'}
//                   onChange={v => updateField('collectionFreq', v)}
//                   options={['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY']}
//                 />
//               ) : (
//                 <Badge value={loan.collectionFreq} />
//               )}
//             </Row>

//           </Card>
//         </div>

//         {/* FEES */}
//         <Card title="Fees" icon="📋" color="bg-amber-600">
//           <Row label="Processing Fee">
//             {isEdit ? (
//               <FeeEditor
//                 fee={form.processingFees!}
//                 onChange={f => updateField('processingFees', f)}
//               />
//             ) : (
//               formatFee(loan.processingFees)
//             )}
//           </Row>

//           <Row label="Insurance Fee">
//             {isEdit ? (
//               <FeeEditor
//                 fee={form.insuranceFees!}
//                 onChange={f => updateField('insuranceFees', f)}
//               />
//             ) : (
//               formatFee(loan.insuranceFees)
//             )}
//           </Row>

//           {(form.otherFees ?? []).map((fee, index) => (
//             <div key={index} className="flex items-center gap-3">
//               <FeeEditor
//                 fee={fee}
//                 onChange={updated => {
//                   const copy = [...(form.otherFees ?? [])];
//                   copy[index] = updated;
//                   updateField('otherFees', copy);
//                 }}
//               />

//               <button
//                 className="text-red-600"
//                 onClick={() => {
//                   const copy = [...(form.otherFees ?? [])];
//                   copy.splice(index, 1);
//                   updateField('otherFees', copy);
//                 }}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//           {isEdit && (
//             <button
//               className="btn-secondary"
//               onClick={() =>
//                 updateField('otherFees', [
//                   ...(form.otherFees ?? []),
//                   { amount: 0, isPercentage: false, description: '' },
//                 ])
//               }
//             >
//               + Add Fee
//             </button>
//           )}
//         </Card>

//         {/* ACTIONS */}
//         {isEdit && (
//           <div className="flex justify-end gap-4">
//             <button onClick={handleDelete} className="btn-danger">
//               Delete
//             </button>
//             <button
//               onClick={() =>
//                 router.push(`/loans/types/${id}?mode=view`)
//               }
//               className="btn-secondary"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="btn-primary"
//             >
//               Save Changes
//             </button>
//           </div>
//         )}
//       </div>

//       {/* =========================== STYLES =========================== */}
//       <style jsx global>{`
//         .btn-primary {
//           background: #f59e0b;
//           color: white;
//           padding: 0.5rem 1.25rem;
//           border-radius: 0.5rem;
//           font-weight: 500;
//         }
//         .btn-primary:hover { background: #d97706; }

//         .btn-secondary {
//           background: #374151;
//           color: white;
//           padding: 0.5rem 1.25rem;
//           border-radius: 0.5rem;
//         }

//         .btn-danger {
//           background: #dc2626;
//           color: white;
//           padding: 0.5rem 1.25rem;
//           border-radius: 0.5rem;
//         }
//       `}</style>
//     </div>
//   );
// }

// /* =========================== COMPONENTS =========================== */

// function FeeEditor({
//   fee,
//   onChange,
// }: {
//   fee: Fee;
//   onChange: (fee: Fee) => void;
// }) {
//   return (
//     <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//       {/* Amount Input */}
//       <div className="flex-1">
//         <div className="w-full border-2 px-4 rounded-lg">
//           <NumberInput
//             value={fee.amount}
//             onChange={(v) => onChange({ ...fee, amount: v })}
//           />
//         </div>
//       </div>

//       {/* Type Select */}
//       <div className="flex-1">
//         <div className="w-full border-2 px-4 rounded-lg">
//           <Select
//             value={fee.isPercentage ? 'PERCENT' : 'FIXED'}
//             options={['FIXED', 'PERCENT']}
//             onChange={(v) => onChange({ ...fee, isPercentage: v === 'PERCENT' })}
//           />
//         </div>
//       </div>

//       {/* Description Input */}
//       <div className="flex-1">
//         <div className="w-full border-2 px-4 rounded-lg">
//           <Input
//             value={fee.description ?? ''}
//             onChange={(v) => onChange({ ...fee, description: v })}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function Card({
//   title,
//   icon,
//   color,
//   children,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   color: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="border rounded-lg overflow-hidden bg-white">
//       <div className={`${color} px-6 py-4 flex items-center gap-2`}>
//         <span className="text-white text-lg">{icon}</span>
//         <h2 className="text-white font-semibold">{title}</h2>
//       </div>
//       <div className="p-6 space-y-4">{children}</div>
//     </div>
//   );
// }


// function Row({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex justify-between gap-4 border-b pb-3 last:border-0">
//       <span className="text-gray-600">{label}</span>
//       <div className="font-medium text-right">{children}</div>
//     </div>
//   );
// }


// function Input({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (value: string) => void;
// }) {
//   return (
//     <input
//       className="input"
//       value={value}
//       onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//         onChange(e.target.value)
//       }
//     />
//   );
// }


// function NumberInput({
//   value,
//   onChange,
// }: {
//   value: number;
//   onChange: (value: number) => void;
// }) {
//   return (
//     <input
//       type="number"
//       className="input"
//       value={value}
//       onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//         onChange(Number(e.target.value))
//       }
//     />
//   );
// }

// function Textarea({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (value: string) => void;
// }) {
//   return (
//     <textarea
//       className="input"
//       value={value}
//       onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//         onChange(e.target.value)
//       }
//     />
//   );
// }


// function Select({
//   value,
//   onChange,
//   options,
// }: {
//   value: string;
//   options: string[];
//   onChange: (value: string) => void;
// }) {
//   return (
//     <select
//       className="input"
//       value={value}
//       onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//         onChange(e.target.value)
//       }
//     >
//       {options.map(option => (
//         <option key={option} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>
//   );
// }


// function Badge({ value }: { value: string }) {
//   const isActive = value === 'ACTIVE';
//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-sm font-medium ${isActive
//         ? 'bg-green-100 text-green-700'
//         : 'bg-blue-100 text-blue-700'
//         }`}
//     >
//       {value}
//     </span>
//   );
// }


// function formatFee(fee: Fee) {
//   return `${fee.amount}${fee.isPercentage ? '%' : '₹'}`;
// }


'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { API_ENDPOINTS } from '@/app/config/config';

/* ============================== TYPES ============================= */

interface Fee {
  amount: number;
  isPercentage: boolean;
  description?: string;
}

interface LoanType {
  id: string;
  loanName: string;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  interestType: 'FLAT' | 'REDUCING';
  loanDuration: number;
  collectionFreq: 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY' | 'QUARTERLY';
  processingFees: Fee;
  insuranceFees: Fee;
  otherFees: Fee[];
  createdAt: string;
  updatedAt: string;
}

/* ============================== PAGE ============================== */

export default function LoanTypePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode') ?? 'view';
  const isEdit = mode === 'edit';

  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState<LoanType | null>(null);
  const [form, setForm] = useState<Partial<LoanType>>({});
  const [saving, setSaving] = useState(false);

  /* ============================ FETCH ============================ */

  useEffect(() => {
    if (!id) return;

    const fetchLoan = async () => {
      const res = await axios.get(`${API_ENDPOINTS.GET_LOAN_TYPE_BY_ID}/${id}`);
      setLoan(res.data);
      setForm(res.data);
      setLoading(false);
    };

    fetchLoan();
  }, [id]);

  /* ============================ HELPERS =========================== */

  const updateField = (key: keyof LoanType, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const diffPayload = useMemo(() => {
    if (!loan) return {};
    const payload: any = {};

    Object.keys(form).forEach((key) => {
      const k = key as keyof LoanType;
      if (JSON.stringify(form[k]) !== JSON.stringify(loan[k])) {
        payload[k] = form[k];
      }
    });

    return payload;
  }, [form, loan]);

  /* ============================ ACTIONS =========================== */

  const handleSave = async () => {
    if (!Object.keys(diffPayload).length) {
      router.push(`/loans/types/${id}?mode=view`);
      return;
    }

    setSaving(true);
    await axios.patch(`${API_ENDPOINTS.UPDATE_LOAN_TYPE}/${id}`, diffPayload);
    router.refresh();
    router.push(`/loans/types/${id}?mode=view`);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this loan type permanently?')) return;
    await axios.delete(`${API_ENDPOINTS.DELETE_LOAN_TYPE}/${id}`);
    router.push('/loans/types');
  };

  if (loading || !loan) return null;

  /* ============================== UI ============================== */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ========================== HEADER ========================== */}
        <div className="bg-white rounded-lg border px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💳</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{loan.loanName}</h1>
              <p className="text-gray-600 text-sm">Loan type configuration & details</p>
            </div>
          </div>

          <div className="flex gap-3">
            {!isEdit && (
              <button
                onClick={() => router.push(`/loans/types/${id}?mode=edit`)}
                className="btn-primary"
              >
                ✎ Edit
              </button>
            )}
            <button onClick={() => router.push('/loans/types')} className="btn-secondary">
              ← Back
            </button>
          </div>
        </div>

        {/* ========================== GRID ============================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* BASIC INFO */}
          <Card title="Basic Information" icon="ℹ️" color="bg-blue-600">
            <Row label="Loan Name">
              {isEdit ? (
                <Input value={form.loanName ?? ''} onChange={(v) => updateField('loanName', v)} />
              ) : (
                loan.loanName
              )}
            </Row>

            <Row label="Status">
              {isEdit ? (
                <Select
                  value={form.status ?? 'ACTIVE'}
                  onChange={(v) => updateField('status', v)}
                  options={['ACTIVE', 'INACTIVE']}
                />
              ) : (
                <Badge value={loan.status} />
              )}
            </Row>

            <Row label="Description">
              {isEdit ? (
                <Textarea
                  value={form.description ?? ''}
                  onChange={(v) => updateField('description', v)}
                />
              ) : (
                loan.description
              )}
            </Row>
          </Card>

          {/* FINANCIAL */}
          <Card title="Financial Details" icon="📊" color="bg-green-600">
            <Row label="Interest Rate (%)">
              {isEdit ? (
                <NumberInput
                  value={form.interestRate ?? 0}
                  onChange={(v) => updateField('interestRate', v)}
                />
              ) : (
                `${loan.interestRate}%`
              )}
            </Row>

            <Row label="Interest Type">
              {isEdit ? (
                <Select
                  value={form.interestType ?? 'FLAT'}
                  onChange={(v) => updateField('interestType', v)}
                  options={['FLAT', 'REDUCING']}
                />
              ) : (
                <Badge value={loan.interestType} />
              )}
            </Row>

            <Row label="Min Amount">
              {isEdit ? (
                <NumberInput
                  value={form.minAmount ?? 0}
                  onChange={(v) => updateField('minAmount', v)}
                />
              ) : (
                `₹${loan.minAmount}`
              )}
            </Row>

            <Row label="Max Amount">
              {isEdit ? (
                <NumberInput
                  value={form.maxAmount ?? 0}
                  onChange={(v) => updateField('maxAmount', v)}
                />
              ) : (
                `₹${loan.maxAmount}`
              )}
            </Row>

            <Row label="Loan Duration (months)">
              {isEdit ? (
                <NumberInput
                  value={form.loanDuration ?? 0}
                  onChange={(v) => updateField('loanDuration', v)}
                />
              ) : (
                loan.loanDuration
              )}
            </Row>

            <Row label="Collection Frequency">
              {isEdit ? (
                <Select
                  value={form.collectionFreq ?? 'MONTHLY'}
                  onChange={(v) => updateField('collectionFreq', v)}
                  options={['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY']}
                />
              ) : (
                <Badge value={loan.collectionFreq} />
              )}
            </Row>
          </Card>
        </div>

        {/* FEES */}
        <Card title="Fees" icon="📋" color="bg-amber-600">
          {/* Processing Fee */}
          <Row label="Processing Fee">
            {isEdit ? (
              <FeeEditor
                fee={form.processingFees ?? { amount: 0, isPercentage: false }}
                onChange={(f) => updateField('processingFees', f)}
              />
            ) : (
              formatFee(loan.processingFees)
            )}
          </Row>

          {/* Insurance Fee */}
          <Row label="Insurance Fee">
            {isEdit ? (
              <FeeEditor
                fee={form.insuranceFees ?? { amount: 0, isPercentage: false }}
                onChange={(f) => updateField('insuranceFees', f)}
              />
            ) : (
              formatFee(loan.insuranceFees)
            )}
          </Row>

          {/* Other Fees */}
          {(isEdit ? form.otherFees ?? [] : loan.otherFees ?? []).map((fee, index) => (
            <div key={index} className="flex items-center gap-3">
              {isEdit ? (
                <>
                  <FeeEditor
                    fee={fee}
                    onChange={(updated) => {
                      const copy = [...(form.otherFees ?? [])];
                      copy[index] = updated;
                      updateField('otherFees', copy);
                    }}
                  />
                  <button
                    className="text-red-600"
                    onClick={() => {
                      const copy = [...(form.otherFees ?? [])];
                      copy.splice(index, 1);
                      updateField('otherFees', copy);
                    }}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span>{formatFee(fee, true)}</span>
              )}
            </div>
          ))}

          {/* Add Fee Button */}
          {isEdit && (
            <button
              className="btn-secondary mt-2"
              onClick={() =>
                updateField('otherFees', [
                  ...(form.otherFees ?? []),
                  { amount: 0, isPercentage: false, description: '' },
                ])
              }
            >
              + Add Fee
            </button>
          )}
        </Card>

        {/* ACTIONS */}
        {isEdit && (
          <div className="flex justify-end gap-4">
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
            <button
              onClick={() => router.push(`/loans/types/${id}?mode=view`)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* =========================== STYLES =========================== */}
      <style jsx global>{`
        .btn-primary {
          background: #f59e0b;
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 500;
        }
        .btn-primary:hover {
          background: #d97706;
        }

        .btn-secondary {
          background: #374151;
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}

/* =========================== COMPONENTS =========================== */

function FeeEditor({ fee, onChange }: { fee: Fee; onChange: (fee: Fee) => void }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Amount Input */}
      <div className="flex-1">
        <div className="w-full border-2 px-4 rounded-lg">
          <NumberInput
            value={fee.amount}
            onChange={(v) => onChange({ ...fee, amount: v })}
          />
        </div>
      </div>

      {/* Type Select */}
      <div className="flex-1">
        <div className="w-full border-2 px-4 rounded-lg">
          <Select
            value={fee.isPercentage ? 'PERCENT' : 'FIXED'}
            options={['FIXED', 'PERCENT']}
            onChange={(v) => onChange({ ...fee, isPercentage: v === 'PERCENT' })}
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="flex-1">
        <div className="w-full border-2 px-4 rounded-lg">
          <Input
            value={fee.description ?? ''}
            onChange={(v) => onChange({ ...fee, description: v })}
          />
        </div>
      </div>
    </div>
  );
}

function formatFee(fee: Fee, includeDescription = false) {
  const amt = fee.isPercentage ? `${fee.amount}%` : `₹${fee.amount}`;
  return includeDescription && fee.description ? `${amt} - ${fee.description}` : amt;
}

/* =========================== REUSABLE UI =========================== */

function Card({ title, icon, color, children }: { title: string; icon: React.ReactNode; color: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className={`${color} px-6 py-4 flex items-center gap-2`}>
        <span className="text-white text-lg">{icon}</span>
        <h2 className="text-white font-semibold">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-3 last:border-0">
      <span className="text-gray-600">{label}</span>
      <div className="font-medium text-right">{children}</div>
    </div>
  );
}

function Input({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      className="input"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <input
      type="number"
      className="input"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
    />
  );
}

function Textarea({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      className="input"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
    />
  );
}

function Select({ value, onChange, options }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select
      className="input"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Badge({ value }: { value: string }) {
  const isActive = value === 'ACTIVE';
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      }`}
    >
      {value}
    </span>
  );
}
