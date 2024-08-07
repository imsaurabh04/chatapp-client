import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdmin = false,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar src={transformImage(avatar)} />
        <Box
          sx={{
            display: "-webkit-box",
            flexGrow: 1,
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isAdmin ? (
            <Stack direction="row" spacing="0.5rem" alignItems="center">
              <Typography variant="body1">You</Typography>
              <Paper variant="outlined">
                <Typography variant="body1" color="green" fontSize="small" textTransform="uppercase" p="0 0.5rem">Admin</Typography>
              </Paper>
            </Stack>
          ) : (
            <Typography variant="body1">{name}</Typography>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
          sx={{
            bgcolor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isAdded ? "error.dark" : "primary.dark",
            },
          }}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
