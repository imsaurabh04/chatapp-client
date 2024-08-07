import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { useSelector } from "react-redux";
import {
    Delete as DeleteIcon,
    ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useAsyncMutation } from "../../hooks/hook";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../redux/api/api";
import { useNavigate } from "react-router-dom";

const DeleteChatMenu = ({ isDeleteMenu, dispatch, deleteOptionAnchor }) => {
    const navigate = useNavigate();
    const { selectedDeleteChat } = useSelector((state) => state.misc);

    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteOptionAnchor.current = null;
    }

    const leaveGroupHandler = () => {
        leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
        closeHandler();
    };

    const deleteChatHandler = () => {
        deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
        closeHandler();
    };

    useEffect(() => {
      
        if(deleteChatData || leaveGroupData) {
            navigate("/");
        }

    }, [deleteChatData, leaveGroupData])

    return (
        <Menu
            open={isDeleteMenu}
            onClose={closeHandler}
            anchorEl={deleteOptionAnchor}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "center",
            }}
        >
            <Stack
                sx={{
                    width: "10rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                    ":hover": {
                        bgcolor: "#EEEDEB"
                    }
                }}
                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}
                onClick={
                    selectedDeleteChat.groupChat ? leaveGroupHandler : deleteChatHandler
                }
            >
                {selectedDeleteChat.groupChat ? (
                    <>
                        <ExitToAppIcon />
                        <Typography>Leave Group</Typography>
                    </>
                ) : (
                    <>
                        <DeleteIcon />
                        <Typography>Delete Chat</Typography>
                    </>
                )}
            </Stack>
        </Menu>
    );
};

export default DeleteChatMenu;
