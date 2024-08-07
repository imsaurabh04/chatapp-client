import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobileMenu, setSelectedDeleteChat } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../../constants/events";
import { incrementNotificationCount, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../dialog/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const navigate = useNavigate();

    const socket = getSocket();

    const dispatch = useDispatch();
    const { isMobileMenu, isDeleteMenu } = useSelector((state) => state.misc);
    const { user } = useSelector(state => state.auth);
    const { newMessagesAlert } = useSelector(state => state.chat);
    const deleteOptionAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers ] = useState([]);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert});
      
    }, [newMessagesAlert])

    useEffect(() => {
      refetch();
      
    }, [user._id])

    const handleIsMobileMenuClose = () => {
      dispatch(setIsMobileMenu(false));
    };

    const handleDeleteChat = (e, chatId, groupChat) => {
      e.preventDefault();
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteOptionAnchor.current = e.currentTarget;
    };

    const newMessageAlertHandler = useCallback((data) => {
      if(data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data))
    }, [chatId]);

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, [dispatch]);

    const refetchHandler = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersHandler = useCallback((data) => {
      setOnlineUsers(data)
    }, []);

    const eventHandlers = { 
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHATS]: refetchHandler,
      [ONLINE_USERS]: onlineUsersHandler
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu 
          isDeleteMenu={isDeleteMenu} 
          dispatch={dispatch} 
          deleteOptionAnchor={deleteOptionAnchor.current} 
        />

        {
          <Drawer
            sx={{
              display: { xs: "block", sm: "none" },
            }}
            open={isMobileMenu}
            onClose={handleIsMobileMenuClose}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                w="60vw"
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Drawer>
        }

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            height={"100%"}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "#6499E9",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
