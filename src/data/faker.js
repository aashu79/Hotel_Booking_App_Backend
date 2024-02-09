const fs = require("fs/promises");
const path = require("path");
const { faker } = require("@faker-js/faker");
const axios = require("axios");

const getPexelsImageUrls = async (query, apiKey, count = 3) => {
  try {
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${query}&per_page=${count}`,
      {
        headers: { Authorization: apiKey },
      }
    );

    return response.data.photos.map((photo) => photo.src.original);
  } catch (error) {
    console.error("Error fetching Pexels images:", error.message);
    return [];
  }
};

const generateRandomHotel = async () => {
  const apiKey = "6JsUwHJBVwH4ah1vU8Rs5PECHzINnUaEVODjnj6PpNcbMCxF98gpN8OI"; // Replace with your Pexels API key
  const imageQueries = ["hotel", "resort", "inn", "vacation", "luxury"]; // Add more queries if needed

  // Randomly select an image query for each hotel
  const randomImageQuery = faker.helpers.arrayElement(imageQueries);

  const imageUrl = await getPexelsImageUrls(randomImageQuery, apiKey);
  const hf = [
    "Swimming Pool",
    "Fitness Center",
    "Free Wi-Fi",
    "Restaurant",
    "Spa and Wellness Center",
    "Business Center",
    "Conference Rooms",
    "Room Service",
    "Parking",
    "Concierge Service",
    "Lounge/Bar",
    "Pet-Friendly",
    "Kids Club",
    "Airport Shuttle",
    "Laundry Service",
    "Gym",
    "Hot Tub",
    "Valet Parking",
    "Bicycle Rental",
    "Car Rental",
  ];

  const hotel = {
    userId: "659c2133bb6ed5f59d47a408",
    name: faker.company.catchPhrase(),
    city: faker.location.city(),
    country: faker.location.country(),
    description: faker.lorem.paragraph(),
    type: faker.helpers.arrayElement(["Hotel", "Resort", "Inn"]),
    adultCount: faker.number.int({ min: 1, max: 10 }),
    childCount: faker.number.int({ min: 0, max: 5 }),
    facilities: [
      faker.helpers.arrayElement(hf),
      faker.helpers.arrayElement(hf),
      faker.helpers.arrayElement(hf),
    ],
    pricePerNight: faker.number.int({ min: 50, max: 500 }),
    starRating: faker.number.int({ min: 1, max: 5, precision: 0.1 }),
    isFeatured: faker.datatype.boolean(0.2),
    imageUrl,
    lastUpdated: faker.date.recent(),
  };

  return hotel;
};

const generateRandomHotels = async (count) => {
  const hotels = [];
  for (let i = 0; i < count; i++) {
    hotels.push(await generateRandomHotel());
  }
  return hotels;
};

const outputFilePath = path.join(__dirname, "generated_hotels.json");
const numberOfHotels = 50;

generateRandomHotels(numberOfHotels)
  .then((data) =>
    fs
      .writeFile(outputFilePath, JSON.stringify(data, null, 2))
      .then(() => console.log(`Data written to ${outputFilePath}`))
      .catch((error) => console.error("Error writing data:", error))
  )
  .catch((error) => console.error("Error generating data:", error));
