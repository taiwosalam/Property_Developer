import BranchCard from "@/components/Management/Staff-And-Branches/branch-card";
import CustomTable from "@/components/Table/table";
import { branches } from "./data";
import type { Field } from "@/components/Table/types";

const StaffAndBranches = () => {
  const fields: Field[] = [
    { id: "1", label: "S/N", accessor: "S/N" },
    { id: "2", label: "", accessor: "avatar", isImage: true },
    { id: "3", label: "Branch Name", accessor: "branch_title" },
    { id: "4", label: "Branch Address", accessor: "branch_full_address" },
    { id: "5", label: "Branch Manager", accessor: "manager_name" },
    {
      id: "6",
      label: "Total Staff",
      accessor: "staff_count",
      contentStyle: {
        color: "#fff",
        padding: "4px",
        borderRadius: "8px",
        backgroundColor: "#8C62FF",
        display: "grid",
        placeItems: "center",
        width: "32px",
      },
    },
    {
      id: "7",
      label: "Properties",
      accessor: "property_count",
      contentStyle: {
        color: "#fff",
        padding: "4px",
        borderRadius: "8px",
        backgroundColor: "#2DD4BF",
        display: "grid",
        placeItems: "center",
        width: "32px",
      },
    },
    {
      id: "8",
      label: "Units",
      accessor: "unit_count",
      contentStyle: {
        color: "#fff",
        padding: "4px",
        borderRadius: "8px",
        backgroundColor: "#38BDF8",
        display: "grid",
        placeItems: "center",
        width: "32px",
      },
    },
    { id: "9", label: "", accessor: "action" },
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((x, i) => {
            return <div key={i}>Card {i}</div>;
          })}
        </div>
        <button>Create Branch Button</button>
      </div>
      <section className="capitalize">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {branches.slice(0, 30).map((b) => (
            <BranchCard key={b.id} {...b} />
          ))}
        </div>
        {/* <CustomTable
          fields={fields}
          data={branches.slice(0, 30)}
          tableHeadClassName="bg-brand-5"
          tableHeadStyle={{
            borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
          }}
          tableHeadCellSx={{
            color: "#fff",
            fontWeight: 500,
            fontSize: "16px",
            border: "none",
          }}
          tableBodyCellSx={{
            fontWeight: 500,
            fontSize: "16px",
            color: "#050901",
            border: "none",
            textAlign: "center",
          }}
          evenRowColor="#fff"
          oddRowColor="#EFF6FF"
        /> */}
      </section>
    </div>
  );
};

export default StaffAndBranches;
