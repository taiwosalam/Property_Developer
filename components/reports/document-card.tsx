interface DocumentCardProps {
  documentId: string;
  property_name?: string;
  date_created?: string;
  document_type?: string;
  property_id?: string;
  number_of_units?: string;
  [key: string]: any; // Index signature to allow additional properties
  cardViewDetails: {
    label: string;
    accessor: keyof DocumentCardProps;
  }[];
}

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-text-tertiary text-base">{label}:</p>
      <p className="text-text-secondary text-sm">{value}</p>
    </div>
  );
};

const DocumentCard: React.FC<DocumentCardProps> = (props) => {
  const { documentId, cardViewDetails } = props;
  return (
    <div
      className="bg-white rounded-lg px-[18px] pt-4 pb-6 font-medium"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <p>
        <span className="text-base text-text-tertiary">
          Document ID:{" "}
          <span className="text-text-secondary text-sm">{documentId}</span>
        </span>
      </p>
      <hr className="mt-3 mb-6 border-t border-dashed border-brand-7 opacity-50" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 mb-7">
        {cardViewDetails.map(({ label, accessor }, index) => {
          const value = props[accessor];
          return (
            <DetailItem
              key={index}
              label={label}
              value={typeof value === "string" ? value : "---"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DocumentCard;
