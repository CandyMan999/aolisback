const mongoose = require("mongoose");
const { User, Picture } = require("../models");
const { faker } = require("@faker-js/faker");
const axios = require("axios");
const { findCoords } = require("./randomCoords");

require("dotenv").config();

const TOTAL_USERS = 10000;

const seedUsers = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("DB connected"))
      .catch((err) => console.log(err));

    // const USERS = await User.find();

    // if (USERS.length) await User.collection.drop();

    const handleIsLoggedIn = () => {
      return Math.random() < 0.5;
    };

    const handleAge = () => {
      var min = 18;
      var max = 80;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const getRandomGender = (gender) => {
      var genders = ["Female", "Male", "Gender_Diverse"];
      const getGender = gender === "female" ? "Female" : "Male";
      return Math.random() < 0.5 ? getGender : "Gender_Diverse";
    };
    const getRandomSex = () => {
      var genders = ["Female", "Male", "Gender_Diverse"];
      var randomIndex = Math.floor(Math.random() * genders.length);
      return genders[randomIndex];
    };

    const handleKids = () => {
      return Math.random() < 0.5 ? "Yes" : "No";
    };

    const handleDrink = () => {
      var drink = ["Yes", "Socially", "Never"];
      var randomIndex = Math.floor(Math.random() * drink.length);
      return drink[randomIndex];
    };
    const handleSmoke = () => {
      var smoke = ["Yes", "Socially", "Never"];
      var randomIndex = Math.floor(Math.random() * smoke.length);
      return smoke[randomIndex];
    };

    const handle420 = () => {
      var smoke = ["Friendly", "Unfriendly"];
      var randomIndex = Math.floor(Math.random() * smoke.length);
      return smoke[randomIndex];
    };
    const handleDrugs = () => {
      var drugs = ["Recreational", "Yes", "No"];
      var randomIndex = Math.floor(Math.random() * drugs.length);
      return drugs[randomIndex];
    };

    const handleCoordinates = async () => {
      const coords = await findCoords();

      const randomCoords = await faker.location.nearbyGPSCoordinate({
        origin: coords,
        radius: 50,
      });

      return Math.random() < 0.1 ? [0, 0] : [randomCoords[1], randomCoords[0]];
    };

    const getRandomAgeRange = () => {
      var lowEnd = Math.floor(Math.random() * (80 - 18 + 1)) + 18;

      var highEnd = Math.floor(Math.random() * (80 - lowEnd + 1)) + lowEnd;

      var ageRange = {
        lowEnd: lowEnd,
        highEnd: highEnd,
      };

      return ageRange;
    };

    for (let i = 0; i < TOTAL_USERS; i++) {
      const randomCoords = await handleCoordinates();

      const ageRange = await getRandomAgeRange();
      const { data } = await axios.get("https://randomuser.me/api/");

      const newUser = await User.create({
        username: faker.internet.userName(),
        isLoggedIn: handleIsLoggedIn(),
        email: faker.internet.email(),
        password: "Katie1221",
        intro: faker.person.bio(),
        age: handleAge(),
        sex: getRandomGender(data.results[0].gender),
        kids: handleKids(),
        occupation: faker.person.jobTitle(),
        singleTime: faker.date.past(),
        drink: handleDrink(),
        smoke: handleSmoke(),
        marijuana: handle420(),
        drugs: handleDrugs(),
        location: {
          coordinates: randomCoords,
        },
        lookingFor: {
          ageRange,
          kids: handleKids(),
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
