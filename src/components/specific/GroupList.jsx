import { Stack, Typography } from "@mui/material";
import React from "react";
import GroupItem from "../shared/GroupItem";

const GroupList = ({ w = "100%", myGroups = [], groupId }) => {
  return (
    <Stack width={w} height={"100%"} bgcolor={"#A6F6FF"} overflow={"auto"}>
      {myGroups.length > 0 ? (
        myGroups.map((group, index) => {
          return (
            <GroupItem
              index={index}
              key={group._id}
              group={group}
              groupId={groupId}
            />
          );
        })
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            padding: "2rem",
          }}
        >
          No Groups
        </Typography>
      )}
    </Stack>
  );
};

export default GroupList;
