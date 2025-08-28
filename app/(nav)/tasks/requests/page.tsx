// "use client";

// import { Suspense } from "react";
// import dynamic from "next/dynamic";
// import { useModule } from "@/contexts/moduleContext";
// import { useRole } from "@/hooks/roleContext";
// import PageCircleLoader from "@/components/Loader/PageCircleLoader";
// import { AnimatePresence, motion } from "framer-motion";

// const PropertyManagerRequestVariantA = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/requests/requestsPage"
//     ),
//   { ssr: false }
// );

// const PropertyManagerRequestVariantB = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/tasks/requests/requestsPage"
//     ),
//   { ssr: false }
// );

// const PropertyManagerRequestVariantC = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/tasks/requests/requestsPage"
//     ),
//   { ssr: false }
// );

// const PropertyDeveloperRequestVariantA = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/requests/requestsPage"
//     ),
//   { ssr: false }
// );

// const PropertyDeveloperRequestVariantB = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/tasks/requests/requestsPage"
//     ),
//   { ssr: false }
// );

// const PropertyDeveloperRequestVariantC = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/tasks/requests/requestsPage"
//     ),
//   { ssr: false }
// );

// const RequestsPage = () => {
//   const { activeModule, designVariant } = useModule();
//   const { role } = useRole();

//   if (role !== "director") {
//     return (
//       <div className="p-4 text-red-500">
//         Access Denied: Director role required.
//       </div>
//     );
//   }

//   const CalendarComponent =
//     {
//       property_manager: {
//         variant_a: PropertyManagerRequestVariantA,
//         variant_b: PropertyManagerRequestVariantB,
//         variant_c: PropertyManagerRequestVariantC,
//       },
//       hospitality_manager: {
//       },
//       property_developer: {
//         variant_a: PropertyDeveloperRequestVariantA,
//         variant_b: PropertyDeveloperRequestVariantB,
//         variant_c: PropertyDeveloperRequestVariantC,
//       },
//     }[activeModule.id]?.[designVariant] || PropertyManagerRequestVariantA;

//   return (
//     <Suspense fallback={<PageCircleLoader />}>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={`${activeModule.id}-${designVariant}`}
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -50 }}
//           transition={{ duration: 0.3 }}
//         >
//           <CalendarComponent />
//         </motion.div>
//       </AnimatePresence>
//     </Suspense>
//   );
// };

// export default RequestsPage;