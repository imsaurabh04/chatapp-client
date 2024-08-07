import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import {
  Attachment as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialog/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useGetChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [iAmTyping, setIAmTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useGetChatDetailsQuery({ chatId }, {skip: !chatId});
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const members = chatDetails.data?.chat?.members;

  const errors = [
    {
      isError: chatDetails.isError,
      error: chatDetails.error,
    },
    {
      isError: oldMessagesChunk.isError,
      error: oldMessagesChunk.error,
    },
  ];

  useErrors(errors);

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);

    if (!iAmTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIAmTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIAmTyping(false);
    }, 2000);
  };

  const handleFileMenu = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessage("");
      setMessages([]);
      setPage(1);
      setOldMessages([]);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
  }, [messages]);

  useEffect(() => {
    if(oldMessagesChunk.isError) {
      return navigate("/");
    }

  }, [oldMessagesChunk.isError])

  const alertHandler = useCallback(
    (data) => {
      if(data.chatId !== chatId) return;
      
      const messageForAlert = {
        content: data.message,
        _id: uuid(),
        sender: {
          _id: "ncduyfbsmoewrewudbhgduwbudndjjd",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const StartTypingAlertHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const StopTypingAlertHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertHandler,
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: StartTypingAlertHandler,
    [STOP_TYPING]: StopTypingAlertHandler,
  };

  useSocketEvents(socket, eventHandler);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <div
      style={{
        backgroundImage: 'url("/chatbackground.jpg")',
        backgroundSize: "contain",
        height: "calc(100vh - 4rem)",
      }}
    >
      <Stack
        ref={containerRef}
        spacing={"1rem"}
        sx={{
          height: "90%",
          boxSizing: "border-box",
          overflowX: "hidden",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      <form
        onSubmit={handleSubmit}
        style={{
          height: "10%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"0.5rem"}
          marginX={"0.5rem"}
          width={"100%"}
        >
          <IconButton
            sx={{
              rotate: "-30deg",
              bgcolor: "#6499E9",
              color: "whitesmoke",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
            onClick={handleFileMenu}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageChangeHandler}
          />

          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: "#6499E9",
              color: "whitesmoke",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </div>
  );
};

export default AppLayout()(Chat);
