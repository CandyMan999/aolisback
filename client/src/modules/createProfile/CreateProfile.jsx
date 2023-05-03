import React, { Fragment, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { Box, ProfileProgress, Loading } from "../../components";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { COLORS } from "../../constants";

import { CREATE_PROFILE_MUTATION } from "../../graphql/mutations";

import { SingleTime } from "./single-time";
import { GetLocation } from "./get-location";
import { MyPhotos } from "./my-photos";
import { MyDetails } from "./my-details";

import { useClient } from "../../client";
import Context from "../../context";

const CreateProfile = () => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const mobile = useMediaQuery("(max-width: 650px)");
  const [authError, setAuthError] = useState("");
  const [profile, setProfile] = useState({
    singleTime: currentUser.singleTime
      ? moment(Number(currentUser.singleTime)).format("MM/DD/YYYY")
      : "",
  });
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);

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
        setSpinner(false);
        setSuccess(true);
        dispatch({ type: "UPDATE_USER", payload: createProfile });
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
      if (!(Number(values.age) > 0.5)) err.age = "Age Must be a number";
    }
    if (!values.intro.length) {
      err.intro = "Tell us about You!";
    }
    if (!values.occupation.length)
      err.occupation = "If you ain't got a job, then Lie";

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
      {success && <Redirect to="/" />}

      {spinner ? (
        <Box center height={"100vh"}>
          <Loading grid color={COLORS.themeGreen} size={60} />
        </Box>
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
                <h3 style={{ marginBottom: 5 }}>Create Profile</h3>
                <SingleTime
                  handleChange={handleChange}
                  profile={profile}
                  client={client}
                  dispatch={dispatch}
                  currentUser={currentUser}
                  handleSubmit={handleSubmit}
                  completed={completedCounts.mySobriety}
                  total={totalCounts.mySobriety}
                />
                <GetLocation
                  client={client}
                  currentUser={currentUser}
                  dispatch={dispatch}
                  completed={completedCounts.myLocation}
                  total={totalCounts.myLocation}
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
                />
              </Box>
            );
          }}
        </ProfileProgress>
      )}
    </Fragment>
  );
};

export default CreateProfile;
