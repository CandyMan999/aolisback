import React, { Fragment, useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { EARN_REWARD_MUTATION } from "./graphql/mutations";
import Navbar from "./modules/navbar";
import HomeContainer from "./modules/home";
import CreateProfile from "./modules/createProfile";
import GridSearch from "./modules/gridSearch";
import MessageCenter from "./modules/messageCenter";
import Message from "./modules/Message";
import AdminPage from "./modules/admin";
import SpeedDatePage from "./modules/speedDate";
import { Map } from "./components";
import { useClient } from "./client";
import Context from "./context";
import "./App.css";

const App = (props) => {
  const client = useClient();
  const { state } = useContext(Context);
  const { currentUser } = state;
  useEffect(() => {
    // Listener for postMessage from React Native app
    const handleRewardMessage = async (event) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.type === "EARNED_REWARD") {
          const variables = {
            userId: currentUser._id,
            rewardType: data.reward, // Should be "Minutes", "Likes", or "Messages"
          };
          const { earnReward } = await client.request(
            EARN_REWARD_MUTATION,
            variables
          );
          console.log("User earned a reward:", data.reward, earnReward);

          // Example: refetchUserPlan();
          // Example: toast.success(`You earned extra ${data.reward}!`);
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleRewardMessage, false);
    document.addEventListener("message", handleRewardMessage, false);

    return () => {
      window.removeEventListener("message", handleRewardMessage);
      document.removeEventListener("message", handleRewardMessage);
    };
  }, []);

  return (
    <Fragment>
      <Navbar props={props} />
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <ProtectedRoute exact path="/profile" component={CreateProfile} />
        <ProtectedRoute props={props} path="/location" component={Map} />
        <Route path="/message-center" component={MessageCenter} />
        <Route path="/message" component={Message} />
        <ProtectedRoute path="/grid-search" component={GridSearch} />
        <Route path="/speed-date" component={SpeedDatePage} />
        <ProtectedRoute exact path="/admin" component={AdminPage} />
      </Switch>
    </Fragment>
  );
};

export default App;
