// import { useState, useEffect } from "react";
// import { getInventory } from "@/app/(nav)/management/data";

// const useFetchInventoryAndBranch = () => {
//   const [branches, setBranches] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [branchResponse, inventoryResponse] = await Promise.all([
//           fetch("/branches").then((res) => res.json()),
//           getInventory(),
//         ]);

//         setBranches(branchResponse?.data?.data || []);
//         setInventory(inventoryResponse?.data || []);
//       } catch (err) {
//         setError(err as any);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { branches, inventory, loading, error };
// };
