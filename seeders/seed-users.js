const mongoose = require("mongoose");
const { User, Picture, Comment, Video } = require("../models");
const { faker } = require("@faker-js/faker");
const axios = require("axios");
const { findCoords } = require("./randomCoords");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const TOTAL_USERS = 1000;

const seedUsers = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("DB connected"))
      .catch((err) => console.log(err));

    const handleIsLoggedIn = () => Math.random() < 0.5;
    const handleAge = () => Math.floor(Math.random() * (30 - 18 + 1)) + 18;
    const getRandomGender = (gender) => {
      const genders = ["Female", "Male", "Gender_Diverse"];
      const getGender = gender === "female" ? "Female" : "Male";
      return Math.random() < 0.5 ? getGender : "Gender_Diverse";
    };
    const getRandomSex = () => {
      const genders = ["Female", "Male", "Gender_Diverse"];
      return genders[Math.floor(Math.random() * genders.length)];
    };
    const handleKids = () => (Math.random() < 0.5 ? "Yes" : "No");
    const handleDrink = () =>
      ["Yes", "Socially", "Never"][Math.floor(Math.random() * 3)];
    const handleSmoke = () =>
      ["Yes", "Socially", "Never"][Math.floor(Math.random() * 3)];
    const handle420 = () =>
      ["Friendly", "Unfriendly"][Math.floor(Math.random() * 2)];
    const handleDrugs = () =>
      ["Recreational", "Yes", "No"][Math.floor(Math.random() * 3)];

    const handleCoordinates = async () => {
      const coords = await findCoords();
      const randomCoords = await faker.location.nearbyGPSCoordinate({
        origin: coords,
        radius: 50,
      });
      return Math.random() < 0.1 ? [0, 0] : [randomCoords[1], randomCoords[0]];
    };

    const getRandomAgeRange = () => {
      const lowEnd = Math.floor(Math.random() * (80 - 18 + 1)) + 18;
      const highEnd = Math.floor(Math.random() * (80 - lowEnd + 1)) + lowEnd;
      return { lowEnd, highEnd };
    };

    const handleUsername = () => {
      let name = faker.internet.userName();
      const randomNumber = Math.floor(Math.random() * 90) + 10; // Random 2-digit number
      const emojis = [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
      ];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const randomSuffix = `${randomNumber}${randomEmoji}`;
      return `${name.slice(0, 5)}Dummy${randomSuffix}`;
    };

    const generatePhone = () => {
      let randomNumber = "";
      for (let i = 0; i < 16; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }
      return randomNumber;
    };

    for (let i = 0; i < TOTAL_USERS; i++) {
      const randomCoords = await handleCoordinates();
      const ageRange = getRandomAgeRange();
      const { data } = await axios.get("https://randomuser.me/api/");

      const newUser = await User.create({
        username: handleUsername(),
        isLoggedIn: handleIsLoggedIn(),
        email: faker.internet.email(),
        seeder: true,
        password: "Katie1221",
        intro: `${faker.person.bio()}, I am dummy data and will not be here for long. I am Just here for the Beta launch to show how the application works.`,
        age: handleAge(),
        sex: getRandomGender(data.results[0].gender),
        // sex: "Female",
        kids: handleKids(),
        occupation: faker.person.jobTitle(),
        singleTime: faker.date.past(),
        drink: handleDrink(),
        smoke: handleSmoke(),
        marijuana: handle420(),
        drugs: handleDrugs(),
        profileComplete: true,
        isBanned: false,
        phoneNumber: generatePhone(),
        location: {
          coordinates: randomCoords,
          showOnMap: true,
        },
        lookingFor: {
          ageRange: {
            lowEnd: 18,
            highEnd: 80,
          },
          kids: "Yes",
          sex: getRandomSex(),
        },
      });

      const url = data.results[0].picture.large;

      const newPhoto = await Picture.create({
        url,
        user: newUser,
      });

      const newNew = await User.findByIdAndUpdate(
        { _id: newUser._id },
        { $push: { pictures: newPhoto } },
        { new: true }
      ).populate("pictures");

      console.log(`${i + 1} of ${TOTAL_USERS}, ${newNew}`);
    }

    process.exit(0);
  } catch (err) {
    console.log(err.stack);
  }
};

seedUsers();
