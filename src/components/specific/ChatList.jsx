import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'

const ChatList = ({
    w = "100%",
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [{
        chatId: "",
        count: 0
    }],
    handleDeleteChat
}) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"}>
        {
            chats?.map((chatData, index) => {
                const { avatar, _id, name, groupChat, members } = chatData;

                const newMessageAlert = newMessagesAlert.find(
                    ({ chatId }) => chatId === _id
                )

                const isOnline = members?.some(member => onlineUsers.includes(member));

                return <ChatItem 
                    index={index}
                    key={_id}
                    avatar={avatar}
                    name={name}
                    _id={_id}
                    groupChat={groupChat}
                    members={members}
                    sameSender={chatId === _id}
                    newMessageAlert={newMessageAlert}
                    isOnline={isOnline}
                    handleDeleteChat={handleDeleteChat}
                />
            })
        }
    </Stack>
  )
}

export default ChatList