import React, { useContext, useReducer, useState, useEffect } from "react";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";

import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import RequestModal from "./modules/requestModal";
import Profile from "./modules/profile";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Context from "./context";
import reducer from "./reducer";

import { ApolloProvider, Subscription } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";

import { InMemoryCache } from "apollo-cache-inmemory";

import { VIDEO_CHAT_REQUEST } from "./graphql/subscriptions";

export const WS_URL =
  process.env.NODE_ENV === "production"
    ? `wss://aol-is-back.herokuapp.com/graphql`
    : `ws://localhost:4000/graphql`;

const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

const Root = () => {
  const intialState = useContext(Context);
  const [state, dispatch] = useReducer(reducer, intialState);
  const [videoChat, setVideoChat] = useState(null);

  const mobile = useMediaQuery("(max-width: 650px)");

  const toggleChatRequest = (payload) => {
    dispatch({ type: "TOGGLE_CHAT", payload });
  };

  return (
    <Router>
      <ApolloProvider client={client}>
        <Context.Provider value={{ state, dispatch }}>
          <BrowserRouter>
            <App />
            {state.showChatRequest && !!videoChat && (
              <RequestModal
                currentUser={state.currentUser}
                receiver={videoChat.receiver}
                sender={videoChat.sender}
                status={videoChat.status}
                dispatch={dispatch}
                state={state}
                chatID={videoChat._id}
              />
            )}
            <Profile
              userClicked={state.profile}
              mobile={mobile}
              state={state}
              currentUser={state.currentUser}
            />
            <Subscription
              subscription={VIDEO_CHAT_REQUEST}
              onSubscriptionData={({ subscriptionData }) => {
                const { videoChatRequest } = subscriptionData.data;
                if (
                  videoChatRequest.receiver._id === state.currentUser._id ||
                  videoChatRequest.sender._id === state.currentUser._id
                ) {
                  setVideoChat(videoChatRequest);
                  toggleChatRequest(true);
                }
              }}
            />
          </BrowserRouter>
        </Context.Provider>
      </ApolloProvider>
    </Router>
  );
};
ReactDOM.render(<Root />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
