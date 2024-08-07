import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { setIsNewGroup } from "../../redux/reducers/misc";
import { useMyFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import toast from "react-hot-toast";

const NewGroup = () => {
  const groupName = useInputValidation("");

  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state) => state.misc);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isLoading, isError, data, error, refetch } = useMyFriendsQuery();
  const [createNewGroup, isNewGroupLoading] =
    useAsyncMutation(useNewGroupMutation);

  useErrors([
    {
      isError,
      error,
    },
  ]);

  useEffect(() => {
    if(data) {
      refetch();
    }
    
  }, [data, refetch])

  const selectMemberHandler = (id) => {
    setSelectedMembers((oldValues) =>
      oldValues.includes(id)
        ? oldValues.filter((currElement) => currElement !== id)
        : [...oldValues, id]
    );
  };

  const closeHandler = () => dispatch(setIsNewGroup(false));

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please select at least 2 members");

    createNewGroup("Creating new group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack direction={"column"} p={"1rem"} width={{xs: "19rem", sm:"25rem"}}>
        <DialogTitle textAlign={"center"}>New Group</DialogTitle>

        <TextField
          size="small"
          value={groupName.value}
          onChange={groupName.changeHandler}
          label="Group Name"
        />
        <Typography textAlign={"center"} marginTop={"1rem"} variant="body1">
          Members
        </Typography>

        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography variant="body1" margin={"1rem"} textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>

        <Stack
          direction={"row"}
          marginY={"1rem"}
          justifyContent={"space-evenly"}
        >
          <Button
            size="small"
            onClick={submitHandler}
            color="success"
            variant="outlined"
            disabled={isNewGroupLoading}
          >
            Create
          </Button>
          <Button
            size="small"
            color="error"
            onClick={closeHandler}
            variant="contained"
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
