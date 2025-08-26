import FilterBar from "@/components/FIlterBar/FilterBar";
import Button from "@/components/Form/Button/button";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { PlusIcon } from "@/public/icons/icons";
import InventoryTable from "./items-request/cards";
import Pagination from "@/components/Pagination/pagination";
import RequestCard from "@/components/tasks/CallBack/RequestCard";

const ItemsRequest = () => {
  const cardData = [
    { title: "Total Orders", total: 120, newData: 25, colorScheme: 1 },
    { title: "Pending Orders", total: 80, newData: 10, colorScheme: 2 },
    { title: "Completed Orders", total: 90, newData: 30, colorScheme: 3 },
    { title: "Cancelled Orders", total: 20, newData: 5, colorScheme: 4 },
  ];
  return (
    <section className="space-y-6">
      <div className="flex justify-end">
        <Button
          href={"/inventories/items-request/order"}
          className="bg-brand-9 flex items-center gap-2"
        >
          <PlusIcon /> Create Order
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {cardData.map((card, index) => (
          <ManagementStatistcsCard
            key={index}
            title={card.title}
            total={card.total}
            newData={card.newData}
            colorScheme={card.colorScheme as 1}
          />
        ))}
      </div>

      <div className="items py-8">
        <FilterBar
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Items Request"
          aboutPageModalData={{
            title: "Applications",
            description:
              "This page contains a list of Applications on the platform.",
            video: "",
          }}
          searchInputPlaceholder="Search application"
          handleFilterApply={() => {}}
          // filterOptionsMenu={DocumentssFilterOptionsWithDropdown}
        />
      </div>

      <div className="pb-4">
        <InventoryTable />
        <Pagination currentPage={3} onPageChange={() => {}} totalPages={10} />
      </div>
    </section>
  );
};

export default ItemsRequest;
