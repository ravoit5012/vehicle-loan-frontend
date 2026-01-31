import { FaInfo } from "react-icons/fa";
export default function CustomerInfoCard({
  customer,
  agent,
}: {
  customer: any;
  agent: any;
}) {
  return (
    <div className="mx-auto w-[75%] bg-white rounded-lg shadow-lg overflow-hidden p-6">
      <h2 className="text-2xl font-semibold text-white bg-[#006CE0] flex items-center justify-center space-x-2 p-4 mb-6 rounded-lg">
        <FaInfo className="text-xl" />
        <span>Customer Information</span>
      </h2>

      <div className="space-y-4">
        <Info label="Name" value={customer.applicantName} />
        <Info label="Guardian Name" value={customer.guardianName} />
        <Info label="Mobile" value={customer.mobileNumber} />
        <Info label="Email" value={customer.email} />
        <Info label="Member ID" value={customer.memberId} />
        <Info label="Agent" value={agent.name} />
        <Info
          label="Address"
          value={`${customer.village}, ${customer.district}, ${customer.pinCode}`}
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-600">
      <span className="font-medium">{label}</span>
      <span className="text-gray-800">{value || 'N/A'}</span>
    </div>
  );
}
