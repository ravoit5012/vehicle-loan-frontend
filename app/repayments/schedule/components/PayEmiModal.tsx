import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import CollectorSelect, { CollectorOption } from '@/app/components/CollectorSelect';

type PayEmiModalProps = {
  loanId: string;
  emi: {
    emiNumber: number | string;
  };
  onClose: () => void;
};

export default function PayEmiModal({ loanId, emi, onClose }: PayEmiModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [txn, setTxn] = useState('');
  const [collector, setCollector] = useState<CollectorOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<File | null>(null);

  const isCash = paymentMethod === 'CASH';

  const submit = async () => {
    if (!amount) {
      alert('Please enter an amount.');
      return;
    }

    if (!collector) {
      alert('Please select a collector.');
      return;
    }

    if (!isCash && !txn.trim()) {
      alert('Please enter transaction ID.');
      return;
    }

    if (!isCash && !proof) {
      alert('Please upload payment proof.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('emiNumber', emi.emiNumber.toString());
      formData.append('paidAmount', amount.toString());
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', isCash ? '' : txn.trim());
      formData.append('collectedBy', collector.name);

      if (proof) {
        formData.append('proof', proof);
      }

      const res = await fetch(`${API_ENDPOINTS.PAY_REPAYMENT}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        const result = await res.json().catch(() => null);
        if (result?.customerReceiptUrl) {
          window.open(result.customerReceiptUrl, '_blank');
        }
        alert('Payment recorded successfully!');
        window.location.reload();
      } else {
        alert('Failed to record payment.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 sm:p-8 transition-all">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Pay EMI #{emi.emiNumber}
        </h3>

        <div className="flex flex-col gap-4">
          <input
            type="number"
            className="input px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <select
            className="input px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 cursor-pointer"
            value={paymentMethod}
            onChange={e => {
              setPaymentMethod(e.target.value);
              if (e.target.value === 'CASH') {
                setTxn('');
                setProof(null);
              }
            }}
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Collected by
            </label>
            <CollectorSelect value={collector} onChange={setCollector} />
          </div>

          {!isCash && (
            <>
              <input
                type="text"
                className="input px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 w-full"
                placeholder="UTR / Reference No"
                value={txn}
                onChange={e => setTxn(e.target.value)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Payment Proof
                </label>

                <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition bg-transparent dark:bg-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {proof ? proof.name : 'Click to upload image or PDF'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, PDF allowed
                    </p>
                  </div>

                  <input
                    type="file"
                    name="proof"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setProof(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={submit}
            disabled={loading}
            className="btn-primary w-full cursor-pointer sm:w-auto px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 outline outline-white/30 hover:shadow-lg hover:-translate-y-0.5 transition-all text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
          <button
            onClick={onClose}
            className="btn-secondary w-full sm:w-auto cursor-pointer px-5 py-2 border border-white/50 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white/40 backdrop-blur-md dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
