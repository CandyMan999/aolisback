import React, { useState, useContext, useEffect } from "react";
import { Subscription } from "react-apollo";
import {
  Wrapper,
  MessageList,
  CreateRoom,
  SendMessage,
  TermsAgreement,
  ReplyPreview,
} from "../../components";

import {
  CREATE_ROOM_MUTATION,
  CHANGE_ROOM_MUTATION,
  CREATE_COMMENT_MUTATION,
  VOTE_TO_KICK_MUTATION,
} from "../../graphql/mutations";
import {
  GET_ROOMS_QUERY,
  GET_COMMENTS_QUERY,
  FIND_USER_QUERY,
} from "../../graphql/queries";
import {
  ROOM_CREATED_OR_UPDATED_SUBSCRIPTION,
  CREATE_COMMENT_SUBSCRIPTION,
} from "../../graphql/subscriptions";

import { useClient } from "../../client";
import Context from "../../context";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const ChatBox = () => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const roomMobile = useMediaQuery("(max-width: 950px)");
  const { currentUser } = state;

  useEffect(() => {
    if (!!currentUser && currentUser.username && !currentUser.terms) {
      dispatch({ type: "SHOW_TERMS", payload: true });
    }
  }, [currentUser]);

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

  const voteToKick = async (targetUserId) => {
    const variables = {
      roomId: state.roomId,
      userId: currentUser._id,
      targetUserId,
    };

    try {
      const { voteToKick } = await client.request(
        VOTE_TO_KICK_MUTATION,
        variables
      );

      // Optimistically update local state with the mutation result
      setRooms((prevRooms) =>
        prevRooms.map((r) => (r._id === voteToKick._id ? voteToKick : r))
      );

      // Also refresh from the server to prevent stale data requiring a
      // second click to appear
      await getRooms();
    } catch (err) {
      console.error(err);
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

        // Function to get all unique usernames
        const uniqueUsernames = getUniqueUsernames(getComments);

        setUsernames(uniqueUsernames);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };

  const getUniqueUsernames = (comments) => {
    const usernameSet = new Set();

    comments.forEach((comment) => {
      if (comment.author && comment.author.username) {
        usernameSet.add(comment.author.username);
      }
    });

    return Array.from(usernameSet);
  };

  // --- helpers to extract a clean error message & room name ---
  const extractGraphQLError = (err) => {
    // graphql-request / Apollo-style errors
    const raw =
      err?.response?.errors?.[0]?.message ||
      err?.message ||
      "You were removed from the room.";
    // strip duplicate "AuthenticationError:" prefixes
    return raw.replace(/^AuthenticationError:\s*/i, "").trim();
  };

  const parseRoomName = (msg) => {
    // e.g. "User banned from room Team Money"
    const m = msg.match(/User banned from room\s(.+)$/i);
    return m?.[1] || null;
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
        await dispatch({ type: "CHANGE_ROOM", payload: changeRoom._id });
        setTimeout(() => {
          dispatch({ type: "CREATE_ROOM", payload: false });
        }, 1000);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);

      const message = extractGraphQLError(err);
      const roomName = parseRoomName(message);

      // Send structured payload to RN app (if we're inside WebView)
      try {
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "ROOM_BANNED",
            message, // "User banned from room Team Money"
            roomName, // "Team Money"
            code:
              err?.response?.errors?.[0]?.extensions?.code || "UNAUTHENTICATED",
          })
        );
      } catch (e) {
        // no-op in desktop browsers
      }

      console.error(message);
    }
  };

  const usernameClick = async (authorId) => {
    const variables = { _id: authorId };

    try {
      const { findUser } = await client.request(FIND_USER_QUERY, variables);

      await dispatch({ type: "UPDATE_PROFILE", payload: findUser });
      dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
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
      replyToCommentId: state.reply.commentId,
    };

    try {
      const { createComment } = await client.request(
        CREATE_COMMENT_MUTATION,
        variables
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseTerms = () => {
    dispatch({ type: "SHOW_TERMS", payload: false });
  };

  return (
    <Wrapper style={{ width: "100vw", height: `calc(100vh - 60px)` }}>
      <MessageList
        usernameClick={usernameClick}
        roomId={state.roomId}
        messages={messages}
        currentUserID={!!currentUser && currentUser._id}
        loading={loading}
        mobile={roomMobile}
        rooms={rooms}
        subscribeToRoom={subscribeToRoom}
        currentUser={currentUser}
        showRoomList={state.showRoomList}
        state={state}
        voteToKick={voteToKick}
      />

      <CreateRoom
        createRoom={createRoom}
        currentUserID={!!currentUser && currentUser._id}
        dispatch={dispatch}
        currentUser={currentUser}
        state={state}
      />
      {state.reply.commentId && (
        <ReplyPreview state={state} dispatch={dispatch} />
      )}

      <SendMessage
        disabled={!state.roomId}
        sendMessage={sendMessage}
        dispatch={dispatch}
        currentUserID={!!currentUser && currentUser._id}
        showRoomList={state.showRoomList}
        usernames={usernames}
        state={state}
      />

      <Subscription
        subscription={ROOM_CREATED_OR_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { roomCreatedOrUpdated } = subscriptionData.data;

          setRooms([...roomCreatedOrUpdated]);

          // If the current user was removed from the room (kicked or logout),
          // reset their active room in real time
          if (state.roomId && currentUser) {
            const currentRoom = roomCreatedOrUpdated.find(
              (r) => r._id === state.roomId
            );

            const stillInRoom =
              currentRoom &&
              currentRoom.users.find((u) => u._id === currentUser._id);

            if (!stillInRoom) {
              dispatch({ type: "CHANGE_ROOM", payload: null });
              setMessages([]);
            }
            try {
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({
                  type: "KICKED_FROM_ROOM",
                  message: `You were removed from ${
                    currentRoom?.name || "this room"
                  }.`,
                  roomName: currentRoom?.name || null,
                })
              );
            } catch (e) {}
          }
        }}
      />

      <Subscription
        subscription={CREATE_COMMENT_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { createComment } = subscriptionData.data;

          // Function to get all unique usernames
          const uniqueUsernames = getUniqueUsernames([
            ...messages,
            createComment,
          ]);

          setUsernames(uniqueUsernames);
          setMessages([...messages, createComment]);
        }}
      />
      {state.showTerms && (
        <TermsAgreement
          state={state}
          client={client}
          dispatch={dispatch}
          onClose={handleCloseTerms}
        />
      )}
    </Wrapper>
  );
};

export default ChatBox;
