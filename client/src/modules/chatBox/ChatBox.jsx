import React, { Component, useState, useContext, useEffect } from "react";
import { Subscription } from "react-apollo";
import {
  Wrapper,
  RoomList,
  MessageList,
  CreateRoom,
  SendMessage,
  Box,
} from "../../components";

import {
  CREATE_ROOM_MUTATION,
  CHANGE_ROOM_MUTATION,
  CREATE_COMMENT_MUTATION,
} from "../../graphql/mutations";
import {
  GET_ROOMS_QUERY,
  GET_COMMENTS_QUERY,
  FIND_USER_QUERY,
} from "../../graphql/queries";
import {
  CREATE_VIDEO_SUBSCRIPTION,
  ROOM_CREATED_OR_UPDATED_SUBSCRIPTION,
  CREATE_COMMENT_SUBSCRIPTION,
} from "../../graphql/subscriptions";

import Profile from "../profile";
import { useClient } from "../../client";
import Context from "../../context";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const ChatBox = ({}) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  // const [roomId, setRoomId] = useState("");

  const [loading, setLoading] = useState(false);
  const mobile = useMediaQuery("(max-width: 650px)");
  const { currentUser } = state;

  useEffect(() => {
    getRooms();

    if (state.roomId) {
      subscribeToRoom(state.roomId);
    }
  }, []);

  useEffect(() => {
    if (state.roomId) {
      getComments();
    }
    if (!currentUser) {
      // setRoomId("");
      dispatch({ type: "CHANGE_ROOM", payload: null });
    }
  }, [state.roomId, currentUser]);

  const getRooms = async () => {
    try {
      const { getRooms } = await client.request(GET_ROOMS_QUERY, {});

      setRooms([...getRooms]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getComments = async () => {
    const variables = {
      roomId: state.roomId,
    };
    try {
      setLoading(true);
      const { getComments } = await client.request(
        GET_COMMENTS_QUERY,
        variables
      );

      if (!!getComments) {
        setMessages(getComments);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };

  const subscribeToRoom = async (roomId) => {
    setLoading(true);
    const variables = {
      roomId,
      userId: currentUser._id,
    };
    try {
      const { changeRoom } = await client.request(
        CHANGE_ROOM_MUTATION,
        variables
      );
      if (!!changeRoom) {
        // setRoomId(changeRoom._id);
        await dispatch({ type: "CHANGE_ROOM", payload: changeRoom._id });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err.message);
    }
  };

  const usernameClick = async (authorId) => {
    const variables = { _id: authorId };

    try {
      const { findUser } = await client.request(FIND_USER_QUERY, variables);
      // setUserClicked(findUser);
      dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
      await dispatch({ type: "UPDATE_PROFILE", payload: findUser });
    } catch (err) {
      console.log(err.message);
    }
  };

  const createRoom = async (variables) => {
    try {
      setLoading(true);
      const { createRoom } = await client.request(
        CREATE_ROOM_MUTATION,
        variables
      );

      // setRoomId(createRoom._id);
      await dispatch({ type: "CHANGE_ROOM", payload: createRoom._id });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const sendMessage = async (text) => {
    const variables = {
      text,
      userId: currentUser._id,
      roomId: state.roomId,
    };

    try {
      await client.request(CREATE_COMMENT_MUTATION, variables);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper style={{ width: "100vW" }}>
      <RoomList
        roomId={state.roomId}
        subscribeToRoom={subscribeToRoom}
        rooms={rooms}
        currentUser={currentUser}
        loading={loading}
      />
      <MessageList
        usernameClick={usernameClick}
        roomId={state.roomId}
        messages={messages}
        currentUser={!!currentUser && currentUser._id}
        loading={loading}
      />

      <CreateRoom
        createRoom={createRoom}
        currentUserID={!!currentUser && currentUser._id}
        dispatch={dispatch}
      />

      <SendMessage
        disabled={!state.roomId}
        sendMessage={sendMessage}
        dispatch={dispatch}
        currentUserID={!!currentUser && currentUser._id}
      />

      <Subscription
        subscription={ROOM_CREATED_OR_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { roomCreatedOrUpdated } = subscriptionData.data;

          setRooms([...roomCreatedOrUpdated]);
        }}
      />

      <Subscription
        subscription={CREATE_COMMENT_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { createComment } = subscriptionData.data;

          setMessages([...messages, createComment]);
        }}
      />

      <Profile userClicked={state.profile} mobile={mobile} />
    </Wrapper>
  );
};

export default ChatBox;
