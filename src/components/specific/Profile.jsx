import {
    CalendarMonth as CalendarIcon,
    Face as FaceIcon,
    AlternateEmail as UsernameIcon
} from "@mui/icons-material";
import { Avatar, Box, Stack, Typography } from '@mui/material';
import moment from "moment";
import React from 'react';

const Profile = ({ user }) => {

    return (
        <Stack direction={"column"} spacing={"2rem"} alignItems={"center"}>
            <Avatar sx={{
                height: 200,
                width: 200,
                border: "2px solid gray",
                objectFit: "contain",
                marginBottom: "1rem"
            }}
            src={user?.avatar?.url}
            />
            <ProfileCard
                heading={"Bio"}
                text={user?.bio} />
            <ProfileCard
                heading={"Username"}
                text={user?.username}
                Icon={<UsernameIcon />} />
            <ProfileCard
                heading={"Name"}
                text={user?.name}
                Icon={<FaceIcon />} />
            <ProfileCard
                heading={"Joined"}
                text={moment(user?.createdAt).fromNow()}
                Icon={<CalendarIcon />} />
        </Stack>
    )
}

const ProfileCard = ({ heading, text, Icon }) => {
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            color={"white"}
            textAlign={"center"}
        >
            <Box sx={{
                color: "black"
            }}>
                {Icon && Icon}
            </Box> 
            <Stack>
                <Typography color={"#BEFFF7"} variant='body1'>{text}</Typography>
                <Typography color={"black"} variant='caption'>{heading}</Typography>
            </Stack>
        </Stack>
    )
}

export default Profile