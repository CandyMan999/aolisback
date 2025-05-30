import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Text, Loading } from ".."; // Adjust the import path based on your project structure
import { COLORS } from "../../constants";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const StyledButton = styled(motion.button)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isSelected ? COLORS.black : COLORS.grey};
  border: ${(props) =>
    props.isSelected ? `1px solid ${COLORS.pink}` : `1px solid ${COLORS.grey}`};
  border-radius: 25px;
  box-shadow: ${(props) =>
    props.isSelected
      ? `0 0 10px ${COLORS.pink}`
      : `2px 2px 4px rgba(0, 0, 0, 0.3)`};
  color: ${COLORS.black};
  cursor: pointer;
  width: 30%; // Adjust based on your design
  height: 50px; // Adjust based on your design
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  transform: ${(props) => (props.isSelected ? "scale(1.1)" : "scale(0.9)")};
  transition: transform 0.2s ease, background-color 0.2s ease,
    box-shadow 0.2s ease;
`;

const CountBox = styled.div`
  position: absolute;
  top: -10px;
  left: -5px;
  background-color: ${COLORS.pink};
  border-radius: 50%;
  padding: 5px 10px;
  color: ${COLORS.white};
  font-weight: bold;
  border: solid 1px ${COLORS.lighterGrey};
`;

const LikeAndMatchButtons = ({
  handleGetLikedUsers,
  loading,
  handleGetAllUsers,
  handleGetUsersWhoLikeMe,
  handleGetMatchedUsers,
  currentUser,
  setSearch,
  usersWhoLikeMeCount,
  setSkip,

  dispatch,
}) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [changeStyle, setChangeStyle] = useState(false);

  useEffect(() => {
    // Function to check scroll position
    const handleScroll = () => {
      const scrollTop = window.scrollY; // How much the user has scrolled

      setChangeStyle(scrollTop > 1); // fix position the header
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup scroll event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!selectedButton) {
      try {
        setSearch("Browse");
        // setViewMode("swipe");
        dispatch({ type: "CHANGE_VIEW_MODE", payload: "swipe" });
        handleGetAllUsers();
      } catch (err) {
        console.log(
          "error getting all browsable users inside button component: ",
          err
        );
      }
    }
    if (selectedButton === "My Likes") {
      try {
        handleGetLikedUsers();
        // setViewMode("grid");
        dispatch({ type: "CHANGE_VIEW_MODE", payload: "grid" });
        setSkip(0);
      } catch (err) {
        console.log("error getting liked users inside button component: ", err);
      }
    }
    if (selectedButton === "Likes Me") {
      try {
        // if (currentUser && currentUser.plan.planType === "Free") {
        //   window.ReactNativeWebView.postMessage("GO_PREMIUM");
        // } else {
        //   handleGetUsersWhoLikeMe();
        // }
        setSkip(0);
        // setViewMode("grid");
        dispatch({ type: "CHANGE_VIEW_MODE", payload: "grid" });
        handleGetUsersWhoLikeMe(); //delete this after uncommenting code
      } catch (err) {
        console.log("error getting liked users inside button component: ", err);
      }
    }
    if (selectedButton === "Matches") {
      try {
        // setViewMode("grid");
        dispatch({ type: "CHANGE_VIEW_MODE", payload: "grid" });
        handleGetMatchedUsers();

        setSkip(0);
      } catch (err) {
        console.log("error getting liked users inside button component: ", err);
      }
    }
  }, [selectedButton, currentUser.matchedUsers, currentUser.likedUsers]);

  const handleClick = async (button) => {
    setSelectedButton(selectedButton === button ? null : button);

    if (button === "My Likes") {
      try {
        setSearch("My Likes");
      } catch (err) {
        console.log("error getting liked users inside button component: ", err);
      }
    }
    if (button === "Likes Me") {
      try {
        // if (currentUser && currentUser.plan.planType === "Free") {
        //   setSelectedButton(null);
        //   window.ReactNativeWebView.postMessage("GO_PREMIUM");
        // } else {
        //   setSearch("Likes Me");
        // }
        setSearch("Likes Me"); // delete this line after uncommenting code
      } catch (err) {
        console.log("error getting liked users inside button component: ", err);
      }
    }
    if (button === "Matches") {
      try {
        setSearch("Matches");
      } catch (err) {
        console.log("error getting liked users inside button component: ", err);
      }
    }
  };

  return (
    <ButtonContainer
      style={{ marginTop: "2%", zIndex: changeStyle ? undefined : 1 }}
    >
      {["Matches", "My Likes", "Likes Me"].map((button) => (
        <StyledButton
          key={button}
          onClick={() => handleClick(button)}
          isSelected={selectedButton === button}
        >
          {loading && selectedButton === button ? (
            <Loading bar color={COLORS.vividBlue} width={"80%"} />
          ) : (
            <Text
              bold={selectedButton === button}
              color={selectedButton === button ? COLORS.pink : COLORS.black}
            >
              {button}
            </Text>
          )}
          {button === "Likes Me" && usersWhoLikeMeCount > 0 && (
            <CountBox>{usersWhoLikeMeCount}</CountBox>
          )}
        </StyledButton>
      ))}
    </ButtonContainer>
  );
};

export default LikeAndMatchButtons;
