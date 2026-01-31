import { FILES_URL } from "@/app/config/config";
export default function DocumentsSection({ loan, customer }: { loan: any, customer: any }) {
  const docs = [
    { label: 'Contract', doc: loan.contractDocument?.url },
    { label: 'Signed Contract', doc: loan.signedContractDocument?.url },
    { label: 'Vehicle RC', doc: loan.vehicleRcDocument },
    { label: 'Vehicle Insurance', doc: loan.vehicleInsuranceDocument },
    { label: 'PAN Image', doc: customer.panImageUrl },
    { label: 'Proof of Address (Front)', doc: customer.poaFrontImageUrl },
    { label: 'Proof of Address (Back)', doc: customer.poaBackImageUrl },
    { label: 'Proof of Identity (Back)', doc: customer.poiFrontImageUrl },
    { label: 'Proof of Identity (Back)', doc: customer.poiBackImageUrl },
    { label: 'Applicant Photo', doc: customer.personalPhotoUrl },
    { label: 'Applicant Signature', doc: customer.applicantSignatureUrl },
  ];

  return (
    <div className="card">
      <h2 className="section-title mb-4">Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(({ label, doc }) => (
          <div key={label} className="flex justify-between items-center">
            <span>{label}</span>
            {doc ? (
              <a
                href={`${FILES_URL}${doc}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                View
              </a>
            ) : (
              <span className="text-gray-400">Not Uploaded</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
