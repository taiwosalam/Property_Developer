// // import api from "@/services/api";
// import axios from "axios";

// let cachedAvatars: string[] = [];

// export const getAvatarsList = async (): Promise<string[]> => {
//   if (cachedAvatars.length > 0) {
//     return cachedAvatars;
//   }

//   try {
//     // const { data } = await api.get("/avatars");
//     // cachedAvatars = data.avatars;
//     // return cachedAvatars;
//     const { data } = await axios.get(
//       "https://staging.ourproperty.ng/api/files-list",
//       {
//         headers: {
//           Authorization:
//             "Bearer 798|Rl5sySkgjC1HLSI4BG5FJSVpzRIIgxLL7RuA67Apa88a543f",
//         },
//       }
//     );
//     cachedAvatars = [...data.avatars, ...data.avatars, ...data.avatars];
//     return cachedAvatars;
//   } catch (error) {
//     console.error("Failed to fetch avatars:", error);
//     return [];
//   }
// };



export const avatarLinks = [
  'https://pubassets.ourproperty.ng/uploads/gBTaZYUXOch2qrKq5k5F2EdShRihQjYGuxDwOuu6.png',
  'https://pubassets.ourproperty.ng/uploads/7M10IKK6OGULqivpfmJ7AMYWNb1BAzpboSLtHffM.png',
  'https://pubassets.ourproperty.ng/uploads/es2Oy2BoX9CmUjhJMfXS2ILNRkrelzY8aGIKddz1.png',
  'https://pubassets.ourproperty.ng/uploads/yZlXfgqcoIV4SSDpvTrbV2M5udRiusWXunoiC9hz.png',
  'https://pubassets.ourproperty.ng/uploads/YhSZNRte5NqAu8uNOmNwOPyQIZvKxSGRy4JKF5DO.png',
  'https://pubassets.ourproperty.ng/uploads/VDtHgwc2C6MwrdjFfjf6X0StiabEj2fRllraBsOT.png',
  'https://pubassets.ourproperty.ng/uploads/l8GSUMmMDVhK8kQxdJH1DEMQcdxYSpeOGEa9JHSV.png',
  'https://pubassets.ourproperty.ng/uploads/UIczCGlVxjMMmJZtwkY3BgxoUSNTqbY9stCcX6Wi.png',
  'https://pubassets.ourproperty.ng/uploads/Bedc5t1a83qOb1Au3dl3N8RKkn7WNrgZpmg8yCER.png',
  'https://pubassets.ourproperty.ng/uploads/VDtHgwc2C6MwrdjFfjf6X0StiabEj2fRllraBsOT.png',
  'https://pubassets.ourproperty.ng/uploads/M5Ig0igT6oiY94Wt53hKt13mtxBH6JW6VV5HFBxx.png',
  'https://pubassets.ourproperty.ng/uploads/GM2QHalbZb7J8N7M8WHW6Vfb89w5Z3XxborQf9jc.png',
  'https://pubassets.ourproperty.ng/uploads/qA0HT7LUjC7f8W4EjrgBvChrO1AtyRVZM9pfPGpn.png',
  'https://pubassets.ourproperty.ng/uploads/p4qmzmRp3tWIllj47ROHauxVrfBbaRPqkao9jXUz.png',
  'https://pubassets.ourproperty.ng/uploads/K9dbOnyPhM1nl4W7RqqJTF7Mx8UQjUoE6tq9TPwR.png',
  'https://pubassets.ourproperty.ng/uploads/exrZfrfrugv7GFDyqRv04NS6xh7GTBKr4oIqHcAs.png',
  'https://pubassets.ourproperty.ng/uploads/bXLrY1waESpxJL2eeSFSGg5TkrT8beXYQrFiE99r.png',
  'https://pubassets.ourproperty.ng/uploads/vJAXNzO4N1FSu9MzaUvGL53kOCLOTg6OAA54krBK.png',
  'https://pubassets.ourproperty.ng/uploads/SkLXPs3gbFe27wGdBkfQoYnSOeEWr8zbBqk9nzYj.png',
  'https://pubassets.ourproperty.ng/uploads/fCJTQVWPE2L5hnOIvY2Ler8G8Zz3k6rzu3piG0fT.png',
  'https://pubassets.ourproperty.ng/uploads/d5er8ZL5nbfNwpmVe6juZb5rnL3JwCcdiquWaKfo.png',
  'https://pubassets.ourproperty.ng/uploads/j9nfE2aXD987Wz0yeROm4Ncr8iwvYmyMnY4n8wBG.png',
  'https://pubassets.ourproperty.ng/uploads/7C8Vti4kYcvUkAFxdYoMJCxIpLl5oTKJfbllMDqm.png',
  'https://pubassets.ourproperty.ng/uploads/pnn2GADMZTnL0FoANIwbhEQECIvN1E1on5t7nlSx.png',
  'https://pubassets.ourproperty.ng/uploads/VEKHgY9bhVuY56OOitmVni2Sk5CCU2jFW5JtChKP.png',
  'https://pubassets.ourproperty.ng/uploads/EbSXKWa73PC5DGuUruAWekGO1muFSFsj2ilVr7fG.png',
  'https://pubassets.ourproperty.ng/uploads/7KXiymC25G9FVCoopBAsFKjcud3VQjPNcMR5LdVr.png',
  'https://pubassets.ourproperty.ng/uploads/RbKLugTwNNX8tuXkBUH28CHTkuu5HRIeoYjzIY0z.png',
  'https://pubassets.ourproperty.ng/uploads/A0gRpwauPgXgEtr12iseoLNmxjk9q0j1amFnY00b.png',
  'https://pubassets.ourproperty.ng/uploads/tyflOgIoaiixGd7DYvTFub1VEAwbsvOIFy6ubxTg.png',
  'https://pubassets.ourproperty.ng/uploads/4BYbjc47i2n1Dh5OQ7niBJCnuWOvLyYW7HCH2lHY.png',
  'https://pubassets.ourproperty.ng/uploads/xNZJPpCcnLCqUnCFBPzSxNYlLfdTl5G5es8I4VKu.png',
  'https://pubassets.ourproperty.ng/uploads/nYpI4H4wdWGPsIDX3PSqAPqySsO6d3HnL9fiCD8m.png',
  'https://pubassets.ourproperty.ng/uploads/Txzue6sNq5nwRaUHD6X0kh2nnOYXX0TOKPXvMfkJ.png',
  'https://pubassets.ourproperty.ng/uploads/Z3fT3tiGIXdBi66aHavlgZGfkqfcaF7dpbSfKQGg.png',
  'https://pubassets.ourproperty.ng/uploads/LqayDWXP6WMYeczl67AMB76GUp6tgmRSzAZD7Ltb.png',
  'https://pubassets.ourproperty.ng/uploads/MiXKlZVB5HqZGNyLu6jpfnfcQaY5vlPwWvd7Rwkr.png',
  'https://pubassets.ourproperty.ng/uploads/oEwbt6NKrYWIx4NZfQxkscx34MMGJBSDgbA9lyHU.png',
  'https://pubassets.ourproperty.ng/uploads/ERFtWbKZhE3jPiPeOidUe7QnUBttYDGdrXB8GvQg.png',
  'https://pubassets.ourproperty.ng/uploads/GdQ4nw4J5zMNAUmtTP4GMxLyOoZhJCOvVaEhobAT.png',
  'https://pubassets.ourproperty.ng/uploads/Jxac26rkfsxcx5sEmK4hsi7rU7CWkegD4kaf7eW9.png',
  'https://pubassets.ourproperty.ng/uploads/22Lb8S1EKQJcK7WtXtFciIlIVwXIUKAY85ukPQy5.png',
  'https://pubassets.ourproperty.ng/uploads/E62VaPkLJ05sfIwKj3nvfK5N6kvlA9GPGQpFHUga.png',
  'https://pubassets.ourproperty.ng/uploads/ll95b8D2YdwgyVjG9bIkrKCWlHx9ZZP4glCNSI2E.png',
  'https://pubassets.ourproperty.ng/uploads/UeHG28utJmv673FdhAMkwQT1Iqsw1wQgcfudaBbj.png',
  'https://pubassets.ourproperty.ng/uploads/wY5EG56esonczs2vmo9nViwPOC9h0t8cFdR7IEKO.png',
  'https://pubassets.ourproperty.ng/uploads/ZR5yx0996Xg0hKpEvf3LEtHenF7TKcMrR0pID0RH.png',
  'https://pubassets.ourproperty.ng/uploads/gkPOBmMBZi1c8Lp9VCbiEf7PuGDAj0c5r0JUmFww.png',
  'https://pubassets.ourproperty.ng/uploads/WVaRTdl51SieJHw1sp6wu9h81Hu7F6NVa3wlkDZH.png',
  'https://pubassets.ourproperty.ng/uploads/gkPOBmMBZi1c8Lp9VCbiEf7PuGDAj0c5r0JUmFww.png',
  'https://pubassets.ourproperty.ng/uploads/WVaRTdl51SieJHw1sp6wu9h81Hu7F6NVa3wlkDZH.png',
  'https://pubassets.ourproperty.ng/uploads/QMaNwB0jmPMth73tIhYhh1gXi502O2QU9oMKLOa7.png',
  'https://pubassets.ourproperty.ng/uploads/RUB3gc34KHTJwCArJzxh9W4snGsOKpDDQt86gQj9.png',
  'https://pubassets.ourproperty.ng/uploads/SPi5fvEd7srru0ZsjkzSyyU9LSX1EHOcOWsrZmLh.png',
  'https://pubassets.ourproperty.ng/uploads/D52apo9jV2aMKX9ihCx9aAOBHZT7E13E4Qzkcw9o.png',
  'https://pubassets.ourproperty.ng/uploads/jggZKhmBVf4ywfZhjxmU4FVeUl5odJSkWy0HhXd1.png',
  'https://pubassets.ourproperty.ng/uploads/5HOUuPqSJdmOtHaFPHikrO3LvSKZcsiUSLTlsqJV.png',
  'https://pubassets.ourproperty.ng/uploads/OXJp1IPhelIiXs3MZ8eQTjg7IQADrW5BDrSZltqx.png',
  'https://pubassets.ourproperty.ng/uploads/wPOsNOFOTsrVqYmIMwqIQHj5wW5as4Am7WB0QrUo.png',
  'https://pubassets.ourproperty.ng/uploads/owkEUYXuk5coZQbd7DkD3XByCkdaIctE2wNDILp9.png',
  'https://pubassets.ourproperty.ng/uploads/RRCiaBmGZaJXpSNJx8RhWxucg3WgwCcn6ermQWHm.png',
  'https://pubassets.ourproperty.ng/uploads/O7iyKmYI4yOMbMKbKQEh9B3pZBatdPiy0s8Encpe.png',
  'https://pubassets.ourproperty.ng/uploads/MfS6lutJ5PCdbaFbpQN8ZwyRibiidCyisvU2KcXj.png',
  'https://pubassets.ourproperty.ng/uploads/MfS6lutJ5PCdbaFbpQN8ZwyRibiidCyisvU2KcXj.png',
  'https://pubassets.ourproperty.ng/uploads/Lx9lY7wkUWCWw1quDFbsDGDchayOzZ9BLZMFjbJD.png',
  'https://pubassets.ourproperty.ng/uploads/RZu6mO19UpfylUSbKWhlOoPvTUZSTeENWSqEsl4l.png',
  'https://pubassets.ourproperty.ng/uploads/z2GYPl453LOEXEnwZY3cFlXopSz2RImO7F8XFn56.png',
  'https://pubassets.ourproperty.ng/uploads/Q37URLiTFguif6VwDZXP9WgT33cODCPhpL6RHGQH.png',
  'https://pubassets.ourproperty.ng/uploads/KWTFbHQMTjDfKCxtLhzRWkiLX4r7KansvBw5rzrJ.png',
  'https://pubassets.ourproperty.ng/uploads/oFcobdPJ4vguPLGTx4p2A18fcmsWclPWXPFhoh0X.png',
  'https://pubassets.ourproperty.ng/uploads/Hbhp20Mml8OQliqclgGaTCVHCJgc0gk3A38YkopQ.png',
  'https://pubassets.ourproperty.ng/uploads/7KzyYQxIGjoMvqwxE8EiJrRwLaMdX5dVeAhYVWiY.png',
  'https://pubassets.ourproperty.ng/uploads/UIEQacVLNYRM6O1Ad5sC4ZiUbCAab2V3FkMDbRuv.png',
  'https://pubassets.ourproperty.ng/uploads/UIEQacVLNYRM6O1Ad5sC4ZiUbCAab2V3FkMDbRuv.png',
  'https://pubassets.ourproperty.ng/uploads/UqtWdHOmQdN8ZhIAGvZyGwcAdoqtRI131nk1bPGx.png',
  'https://pubassets.ourproperty.ng/uploads/aDn3DCds1E1EhgK3H2vQr015ZgZpkpfPaP3Tgtze.png',
  'https://pubassets.ourproperty.ng/uploads/1Z6w6qd0yUUrcL7iOdXrfzcVz2gik0mbEjdfRTrd.png',
  'https://pubassets.ourproperty.ng/uploads/J67ed2N0zsiOhxmr9iIn1TcyXE40hEDY0Fbkxuv0.png',
  'https://pubassets.ourproperty.ng/uploads/dlpaYTEJAPSSnfmOzHieGbepXkPXJ6XZdrupHDv1.png',
];
