import React, { Fragment, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import moment from "moment";
import {
  Box,
  ProfileProgress,
  Loading,
  ProfileProgressSummary,
  Text,
  Banner,
  FONT_SIZES,
} from "../../components";

import { CREATE_PROFILE_MUTATION } from "../../graphql/mutations";

import { SingleTime } from "./single-time";
import { GetLocation } from "./get-location";
import { MyPhotos } from "./my-photos";
import { MyDetails } from "./my-details";
import { LookingFor } from "./looking-for";
import { Settings } from "./settings";

const CreateProfile = ({ client, dispatch, state, currentUser }) => {
  const [authError, setAuthError] = useState("");
  const [profile, setProfile] = useState({
    singleTime: currentUser.singleTime
      ? moment(Number(currentUser.singleTime)).format("MM/DD/YYYY")
      : "",
  });
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);
  const mobile = useMediaQuery("(max-width: 860px)");

  const handleSubmit = async ({
    intro,
    occupation,
    age,
    drink,
    smoke,
    marijuana,
    drugs,
    sex,
    kids,
  }) => {
    const { singleTime } = profile;

    try {
      setSpinner(true);

      const variables = {
        _id: state.currentUser._id,
        intro,
        sex,
        age,
        occupation,
        singleTime,
        drink,
        smoke,
        marijuana,
        drugs,
        kids,
      };

      const { createProfile } = await client.request(
        CREATE_PROFILE_MUTATION,
        variables
      );

      if (createProfile) {
        await dispatch({ type: "UPDATE_USER_DETAILS", payload: createProfile });
        setSpinner(false);
        setSuccess(true);
      }
    } catch (err) {
      setSpinner(false);
      setAuthError(err.response.errors[0].message);
    }
  };

  const handleValidation = (values) => {
    const err = {};
    if (!values.age.length) err.age = "Required";
    if (values.age) {
      if (!(Number(values.age) > 0.5)) err.age = "Must be a Number";
      if (Number(values.age) < 18) err.age = "Must be 18 or older!";
      if (Number(values.age) > 80) err.age = "Must be 80 or less!";
      if (!Number.isInteger(Number(values.age)))
        err.age = "Age cannot have decimals!";
    }
    console.log("value: ", values);
    if (!values.intro.length) {
      err.intro = "Tell us about You!";
    }
    if (values.intro.length > 500) {
      err.intro = "Intro cannot be longer than 500 characters!";
    }
    if (values.intro.split(" ").some((word) => word.length > 20)) {
      err.intro = "Words cannot be longer than 20 characters!";
    }
    if (!values.drink === "") {
      err.drink = "Do You Drink?";
    }
    if (!values.sex === "") {
      err.drink = "What's Your Gender";
    }
    if (!values.kids === "") {
      err.kids = "Kids?";
    }
    if (!values.occupation.length)
      err.occupation = "If you ain't got a job, then Lie";
    if (values.occupation.length > 20) {
      err.occupation = "Too Long!";
    }
    return err;
  };

  const handleChange = (e) => {
    let updatedValue = e.currentTarget.value;
    if (updatedValue === "true" || updatedValue === "false") {
      updatedValue = JSON.parse(updatedValue);
    }

    setProfile({ ...profile, [e.target.name]: updatedValue });
  };

  return (
    <Fragment>
      {false ? (
        <Loading fade size={150} />
      ) : (
        <ProfileProgress me={currentUser}>
          {({ completedCounts, totalCounts }) => {
            return (
              <Box
                display="flex"
                column
                justifyContent="center"
                alignItems="center"
              >
                <Banner
                  fixed
                  mobile={mobile}
                  show={completedCounts.total < 8}
                  message={
                    "Get to it! Your profile won't appear in search results until it is complete"
                  }
                  type="info"
                  duration={8000}
                />
                <Banner
                  fixed
                  mobile={mobile}
                  show={completedCounts.total >= 8}
                  message={
                    "Congratulations! Your profile will now show in search results, for best results be sure to fill out what you are looking for"
                  }
                  duration={8000}
                  type="success"
                />
                <Box
                  width="100%"
                  height={mobile ? 100 : 200}
                  alignItems="center"
                  marginBottom={20}
                >
                  <Box
                    position="absolute"
                    top={mobile ? 5 : 32}
                    left={mobile ? 5 : "5%"}
                  >
                    <ProfileProgressSummary
                      mobile={mobile}
                      completed={completedCounts.total}
                      total={totalCounts.total}
                      client={client}
                      dispatch={dispatch}
                      currentUser={currentUser}
                    />
                  </Box>

                  <Box
                    width="100%"
                    display="flex"
                    height={mobile ? 110 : undefined}
                    justifyContent={"center"}
                  >
                    <Text
                      position={mobile ? "absolute" : undefined}
                      marginTop={0}
                      style={{ top: mobile ? 70 : undefined }}
                      bottom={mobile ? 0 : undefined}
                      center
                      bold
                      fontSize={
                        mobile ? FONT_SIZES.XX_LARGE : FONT_SIZES.XX_LARGE
                      }
                    >
                      Edit Profile
                    </Text>
                  </Box>
                </Box>
                <SingleTime
                  handleChange={handleChange}
                  profile={profile}
                  client={client}
                  dispatch={dispatch}
                  currentUser={currentUser}
                  handleSubmit={handleSubmit}
                  completed={completedCounts.singleTime}
                  total={totalCounts.singleTime}
                />
                <GetLocation
                  client={client}
                  currentUser={currentUser}
                  dispatch={dispatch}
                  completed={completedCounts.myLocation}
                  total={totalCounts.myLocation}
                  mobile={mobile}
                />
                <MyPhotos
                  currentUser={currentUser}
                  completed={completedCounts.myPhotos}
                  total={totalCounts.myPhotos}
                />
                <MyDetails
                  profile={profile}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  handleValidation={handleValidation}
                  currentUser={currentUser}
                  authError={authError}
                  completed={completedCounts.myDetails}
                  total={totalCounts.myDetails}
                  mobile={mobile}
                  submitted={success}
                  loading={spinner}
                />
                <LookingFor
                  profile={profile}
                  client={client}
                  dispatch={dispatch}
                  currentUser={currentUser}
                  authError={authError}
                  completed={completedCounts.lookingFor}
                  total={totalCounts.lookingFor}
                  mobile={mobile}
                />

                <Settings state={state} client={client} dispatch={dispatch} />
              </Box>
            );
          }}
        </ProfileProgress>
      )}
    </Fragment>
  );
};

export default CreateProfile;
