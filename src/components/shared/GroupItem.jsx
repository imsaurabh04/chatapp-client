import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Stack, Typography } from "@mui/material";
import AvatarCard from "../shared/AvatarCard";
import { motion } from "framer-motion";

const GroupItem = ({ group, groupId, index }) => {

  const { avatar, name, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      sx={{
        "&:hover": {
          bgcolor: "#9EDDFF"
        }
      }}
      onClick={e => {
        if (groupId === _id) e.preventDefault();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
          <AvatarCard avatar={avatar} />
          <Typography>{name}</Typography>
        </Stack>
      </motion.div>
    </Link>
  );
};

export default memo(GroupItem);
