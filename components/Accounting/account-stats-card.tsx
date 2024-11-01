// const AccountStatsCard = () => {
//   return (
//     <div
//       className="bg-white dark:bg-darkText-primary rounded-[14px] p-6 space-y-7"
//       style={{
//         boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
//       }}
//     >
//       <div className="w-full flex justify-between gap-4">
//         <div className="space-y-2">
//           <p className="font-medium text-[16px] text-text-tertiary dark:text-darkText-1">
//             Total Expenses
//           </p>
//           <p className="font-bold text-[24px] xl:text-[28px] text-[#202224] dark:text-white">
//             {new Intl.NumberFormat("en-NG", {
//               style: "currency",
//               currency: "NGN",
//             })
//               .format(12345432)
//               .split(".")}
//           </p>
//         </div>
//         <div
//           className={`w-[60px] h-[60px] rounded-[23px] flex items-center justify-center ${
//             title === "Total Expenses"
//               ? "bg-status-error-1"
//               : title === "Part Payment"
//               ? "bg-status-success-1"
//               : "bg-status-caution-1"
//           } `}
//         >
//           {title === "Total Expenses" && (
//             <Picture src={"/icons/send.svg"} alt="send" size={30} />
//           )}
//           {title === "Part Payment" && (
//             <CardBlueWalletIcon width={45} height={35} fill={primaryColor} />
//           )}
//           {(title === "Balance" || title === "Total Pending Vat") && (
//             <Picture
//               src={"/icons/orange-card.svg"}
//               alt="icon"
//               width={35}
//               height={28}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountStatsCard;
