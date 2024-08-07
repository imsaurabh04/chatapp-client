import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { transformImage } from "../../lib/features";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notifications = () => {

  const dispatch = useDispatch();
  const { isNotification } = useSelector(state => state.misc);

  const { isLoading, data, isError, error } = useGetNotificationsQuery();
  const [ acceptFriendRequest ] = useAcceptFriendRequestMutation();

  useErrors([{ isError, error }]);

  const friendRequestHandler = async({ _id, accept }) => {
    dispatch(setIsNotification(false));

    try {
      const res = await acceptFriendRequest({ requestId: _id, accept });
      if(res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleIsNotificationClose = () => dispatch(setIsNotification(false));

  return (
    <Dialog open={isNotification} onClose={handleIsNotificationClose}>
      <Stack direction={"column"} p={"1rem"} width={{xs: "19rem", sm:"25rem"}}>
        <DialogTitle textAlign={"center"}>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests?.length > 0 ? (
              data?.allRequests?.map((i) => (
                <NotificationItem
                  sender={i.sender}
                  _id={i._id}
                  handler={friendRequestHandler}
                  key={i._id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>0 notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ _id, sender, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={transformImage(avatar)} />
        <Stack direction={"column"}>
          <Typography
            variant="body1"
            sx={{
              display: "-webkit-box",
              flexGrow: 1,
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {`${name} sent you a friend request.`}
          </Typography>
          <Stack direction={"row"} spacing={"0.5rem"}>
            <Button
              size="small"
              onClick={() => handler({ _id, accept: true })}
              color="success"
            >
              Accept
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handler({ _id, accept: false })}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
