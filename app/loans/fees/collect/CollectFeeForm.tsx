'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import Loading from '@/app/components/Loading';
import CropModal from '@/app/components/CropModal';
import { Image as ImageIcon } from 'lucide-react';

export default function CollectFeeForm({ fee }: { fee: any }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Crop Modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // reset input
    }
  };

  const handleCropDone = (croppedFile: File) => {
    setReceiptFile(croppedFile);
    setReceiptPreview(URL.createObjectURL(croppedFile));
    setCropModalOpen(false);
    setImageToCrop(null);
  };

  const submit = async () => {
    if (!paymentMethod || !transactionId) {
      return alert('Please fill all fields');
    }
    if (!receiptFile) {
      return alert('Please upload a payment receipt');
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('id', fee.id);
      formData.append('loanId', fee.loanId);
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', transactionId);
      formData.append('receipt', receiptFile);

      const res = await fetch(API_ENDPOINTS.FEES_PAYMENT, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) throw new Error('Payment failed');

      alert('Fee payment recorded successfully');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error collecting fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading visible={loading} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-sm m-2 text-gray-800">
            Payment Method
          </label>
          <select
            className="input border-2 border-black cursor-pointer rounded-lg mt-2 p-2 w-full"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="text-sm m-2 text-gray-800">
            Transaction ID
          </label>
          <input
            className="input border-2 border-black rounded-lg mt-2 p-2 w-full"
            placeholder="UTR / Reference No"
            value={transactionId}
            onChange={e => setTransactionId(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm m-2 text-gray-800 flex items-center justify-between">
            <span>Payment Receipt</span>
            {receiptPreview && <span className="text-green-600 font-bold text-xs">Added</span>}
          </label>
          <div className="relative mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={`receipt-upload-${fee.id}`}
            />
            <label
              htmlFor={`receipt-upload-${fee.id}`}
              className="flex items-center justify-center gap-2 w-full cursor-pointer border-2 border-black rounded-lg p-2 hover:bg-gray-100 transition-colors bg-white text-gray-700 h-[44px]"
            >
              <ImageIcon size={18} />
              {receiptPreview ? 'Change Receipt' : 'Upload Receipt'}
            </label>
          </div>
        </div>

        <button
          onClick={submit}
          className="bg-green-600 hover:scale-105 ease-in-out cursor-pointer transition-all duration-300 text-white px-6 py-2 rounded-lg hover:bg-green-700 h-[44px]"
        >
          Collect Fees
        </button>
      </div>

      {cropModalOpen && imageToCrop && (
        <CropModal
          imageSrc={imageToCrop}
          title="Crop Receipt"
          onCropDone={handleCropDone}
          onCancel={() => {
            setCropModalOpen(false);
            setImageToCrop(null);
          }}
        />
      )}
    </>
  );
}
