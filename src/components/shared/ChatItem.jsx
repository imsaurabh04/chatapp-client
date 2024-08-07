import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents';
import { Box, Stack, Typography } from '@mui/material';
import AvatarCard from './AvatarCard';
import { motion } from "framer-motion";

const ChatItem = ({
    avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat
}) => {
    return (
        <Link
            sx={{
                padding: 0
            }}
            to={`/chat/${_id}`}
            onContextMenu={e => handleDeleteChat(e, _id, groupChat)}
        >
            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    backgroundColor: sameSender ? "black" : "unset",
                    color: sameSender ? "white" : "unset",
                    position: "relative"
                }}>
                <AvatarCard avatar={avatar} />
                <Stack>
                    <Typography>{name}</Typography>
                    {newMessageAlert && (
                        <Typography>{newMessageAlert.count} New Message</Typography>
                    )}
                </Stack>
                {!groupChat && isOnline && <Box sx={{
                    height: "10px",
                    width: "10px",
                    bgcolor: "green",
                    borderRadius: "50%",
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)"
                }} />}
            </motion.div>
        </Link>
    )
}

export default memo(ChatItem);