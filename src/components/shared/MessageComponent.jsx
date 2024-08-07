import { Box, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachments = [], createdAt } = message;

    const sameSender = sender?._id === user?._id;
    const timeAgo = moment(createdAt).fromNow();

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            whileInView={{ opacity: 1, x: 0 }}
            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                backgroundColor: sameSender ? "whitesmoke" : "#6499E9",
                color: sameSender ? "black" : "white",
                padding: "0.5rem",
                borderRadius: "5px",
                width: "fit-content",
            }}
        >
            {!sameSender && (
                <Typography color={"#BEFFF7"} fontWeight={"600"} variant="caption">
                    {sender.name}
                </Typography>
            )}
            {content && <Typography maxWidth={500}>{content}</Typography>}

            {attachments.length > 0 &&
                attachments.map((attachment, index) => {
                    const url = attachment.url;
                    const file = fileFormat(url);

                    return (
                        <Box key={index}>
                            <a
                                href={url}
                                target="_blank"
                                download
                                style={{
                                    color: "black",
                                }}
                            >
                                <RenderAttachment file={file} url={url} />
                            </a>
                        </Box>
                    );
                })}

            <Typography
                color={`${sameSender ? "text.secondary" : "#BEFFF7"}`}
                variant="caption"
            >
                {timeAgo}
            </Typography>
        </motion.div>
    );
};

export default MessageComponent;
