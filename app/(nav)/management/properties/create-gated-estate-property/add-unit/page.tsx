"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "@/public/icons/icons";
import PropertyDetails from "@/components/Management/Properties/property-details";
import PropertySettings from "@/components/Management/Properties/property-settings";
import { useAddUnitStore } from "@/store/add-unit-store";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import FooterModal from "../../create-rental-property/add-unit/footer-modal";
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import UnitForm from "@/components/Management/Properties/unit-form";

const AddUnitGated = () => {
  const [saved, setSaved] = useState(false);

  const addedUnits = useAddUnitStore((s) => s.addedUnits);

  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  const [duplicate, setDuplicate] = useState({ val: false, count: 2 });

  //   useeffect to fetch property info from API with the Property ID.Change True/False Values to Yes/No. Set Unit Store Values.
  useEffect(() => {}, []);

 return (
   <div className="pb-[70px] lg:pb-[80px]">
     {/* Back Button & Page Title */}
     <div className="flex items-center gap-1 mb-5 lg:mb-8">
       <button
         type="button"
         aria-label="Go Back"
         onClick={goBack}
         className="p-2"
       >
         <ChevronLeft />
       </button>
       <p className="text-black font-bold text-lg lg:text-xl">Add Units</p>
     </div>
     <div className="space-y-6 lg:space-y-8">
       <PropertyDetails />
       <PropertySettings />
       {addedUnits.length > 0 && (
         <>
           <h4 className="text-primary-navy text-lg lg:text-xl font-bold">
             {saved ? "Units Summary" : "Added Units"}
           </h4>
           <hr className="!my-4 border-none bg-borders-dark h-[1px]" />
           {addedUnits.map((unit, index) => (
             <AddUnitFormCard
               key={index}
               index={index}
               data={unit}
               // handleRemove={() => removeUnit(index)}
             />
           ))}
         </>
       )}

       {!saved && (
         <>
           <UnitForm empty={true} data={{}} duplicate={duplicate} />
           <div className="fixed w-screen left-0 h-[70px] lg:h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-bold text-sm lg:text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
             <Modal>
               <ModalTrigger asChild>
                 <button
                   type="button"
                   className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
                 >
                   Add More Unit
                 </button>
               </ModalTrigger>
               <ModalContent>
                 <FooterModal
                   setSaved={setSaved}
                   duplicate={duplicate}
                   setDuplicate={setDuplicate}
                 />
               </ModalContent>
             </Modal>
             <button
               form="add-unit-form"
               type="submit"
               className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
             >
               Save
             </button>
           </div>
         </>
       )}
     </div>
   </div>
 );
};

export default AddUnitGated;
