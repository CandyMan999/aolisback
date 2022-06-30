import React, {
  Component,
  Fragment,
  useState,
  useContext,
  useEffect,
} from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
import {
  Box,
  Input,
  Button,
  CheckboxGroup,
  Textarea,
  Select,
  Loading,
  Checkbox,
  Text,
  Icon,
  PhotoUploader,
  PhotoSlider,
} from "../../components";
import { Formik, Form } from "formik";
import { COLORS } from "../../constants";

import {
  CREATE_PROFILE_MUTATION,
  UPDATE_LOCATION_MUTATION,
} from "../../graphql/mutations";

import { useClient } from "../../client";
import Context from "../../context";

const CreateProfile = ({}) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const [authError, setAuthError] = useState("");
  const [profile, setProfile] = useState({
    sex: currentUser.sex ? currentUser.sex : "male",
    sobrietyTime: currentUser.sobrietyTime
      ? moment(Number(currentUser.sobrietyTime)).format("MM/DD/YYYY")
      : "",
    kids: currentUser.kids ? currentUser.kids : false,
  });
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [locationSuccess, setLocationSuccess] = useState(
    !!state.currentUser.location.lat
  );

  useEffect(() => {
    if (userCoords.lat) {
      handleGetLocation();
    }
  }, [userCoords.lat]);

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    try {
      setSpinner(true);
      const variables = {
        lat: userCoords.lat ? userCoords.lat : currentUser.location.lat,
        lng: userCoords.lng ? userCoords.lng : currentUser.location.lng,
        _id: currentUser._id,
      };

      const { updateLocation } = await client.request(
        UPDATE_LOCATION_MUTATION,
        variables
      );

      console.log("updateLocation: ", updateLocation);
      if (updateLocation) {
        dispatch({ type: "UPDATE_USER", payload: updateLocation });
        setSpinner(false);
        setLocationSuccess(true);
      }
      if (!updateLocation) {
        setLocationSuccess(true);
        setSpinner(false);
      }
    } catch (err) {
      setSpinner(false);
      console.log(err);
    }
  };

  const handleSubmit = async ({ intro, occupation, age, sponsor, sponsee }) => {
    const { sex, sobrietyTime, kids } = profile;

    try {
      setSpinner(true);
      const variables = {
        _id: state.currentUser._id,
        intro,
        sex,
        age,
        occupation,
        sobrietyTime,
        sponsee,
        sponsor,
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
    if (updatedValue === "true" || updatedValue == "false") {
      updatedValue = JSON.parse(updatedValue);
    }

    setProfile({ ...profile, [e.target.name]: updatedValue });
  };

  const handleLocation = () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
        });
      } else {
        handlePermission();
      }
    } catch (err) {
      setAuthError(err.message);
      setSpinner(false);
    }
  };

  function handlePermission() {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        if (result.state == "granted") {
          report(result.state);
        } else if (result.state == "prompt") {
          report(result.state);
          // navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
        } else if (result.state == "denied") {
          report(result.state);
        }
        result.onchange = function () {
          report(result.state);
        };
      });
  }

  function report(state) {
    console.log("Permission " + state);
  }

  return (
    <Fragment>
      {success && <Redirect to="/" />}

      {spinner ? (
        <Box center height={"100vh"}>
          <Loading grid color={COLORS.themeGreen} size={60} />
        </Box>
      ) : (
        <Fragment>
          <Box
            display="flex"
            column
            justifyContent="center"
            alignItems="center"
          >
            <h3 style={{ marginBottom: 5 }}>Create Profile</h3>
            {profile.sobrietyTime && (
              <Text color={COLORS.themeGreen} marginTop={0} marginBottom={4}>
                Sober Since {profile.sobrietyTime}
              </Text>
            )}{" "}
            <label htmlFor="sobreityTime">
              SobrietyTime:{" "}
              <input
                type="date"
                id="sobrietyTime"
                name="sobrietyTime"
                value={profile.sobrietyTime}
                onChange={handleChange}
              />
            </label>
            <Box padding={10}>
              <Button
                style={{ display: "flex", alignItems: "center" }}
                disabled={locationSuccess}
                onClick={handleLocation}
                width="fit-content"
              >
                Get Location{" "}
                <Icon
                  name="pin"
                  color={COLORS.red}
                  style={{ padding: "0px" }}
                />
              </Button>
              {locationSuccess && (
                <Box alignItems="center">
                  <Icon name="thumbsUp" color={COLORS.themeGreen} />
                  <Text>Got yo ass</Text>
                </Box>
              )}
              {!locationSuccess && (
                <Box alignItems="center">
                  <Icon name="thumbsDown" color={COLORS.textRed} />
                  <Text>Couldn't find you</Text>
                </Box>
              )}
            </Box>
            <PhotoUploader />
            <PhotoSlider
              withDelete={true}
              images={currentUser.pictures}
              height={310}
              width={200}
            />
            <label htmlFor="sex" style={{ marginTop: 2, marginBottom: 8 }}>
              Gender:{" "}
              <select
                id="sex"
                name="sex"
                value={profile.sex}
                onChange={handleChange}
              >
                <option value={"male"}>male</option>
                <option value={"female"}>female</option>
              </select>
            </label>
            <label htmlFor="kids" style={{ marginBottom: 8 }}>
              I Have Kids:{" "}
              <select
                id="kids"
                name="kids"
                onChange={handleChange}
                value={profile.kids}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </label>
          </Box>
          <Formik
            onSubmit={handleSubmit}
            validate={handleValidation}
            initialValues={{
              intro: currentUser.intro ? currentUser.intro : "",
              age: currentUser.age ? currentUser.age : "",
              occupation: currentUser.occupation ? currentUser.occupation : "",
              sponsor: currentUser.sponsor ? currentUser.sponsor : false,
              sponsee: currentUser.sponsee ? currentUser.sponsee : false,
            }}
            render={(props) => (
              <Form style={{ height: "100%" }}>
                <Box
                  column
                  center
                  justifyContent="space-between"
                  width="100%"
                  height="100%"
                  marginBottom={16}
                >
                  {authError && (
                    <p style={{ color: COLORS.darkRed, margin: "0px" }}>
                      {authError}
                    </p>
                  )}

                  <Box
                    column
                    height={200}
                    width="75%"
                    justifyContent="space-between"
                    center
                  >
                    <Textarea
                      width={"90%"}
                      maxLength={140}
                      name="intro"
                      placeholder="intro"
                      type="input"
                    />
                    <Box marginBottom={15}>
                      {" "}
                      <Input
                        name="occupation"
                        type="input"
                        placeholder="occupation"
                      />
                    </Box>

                    <Input name="age" type="input" placeholder="age" />
                    <Checkbox
                      label="I am willing to be a sponsor"
                      type="checkbox"
                      id="sponsor"
                      name="sponsor"
                    />
                    <Checkbox
                      label="I am willing to be a sponsee"
                      type="checkbox"
                      id="sponsee"
                      name="sponsee"
                    />
                    <Button
                      type="submit"
                      disabled={!props.isValid}
                      style={{ zIndex: 100 }}
                    >
                      {console.log("formik props: ", props)}
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default CreateProfile;
