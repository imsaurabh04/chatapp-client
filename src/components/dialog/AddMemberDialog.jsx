import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMembersMutation,
  useMyFriendsQuery,
} from "../../redux/api/api";

const AddMemberDialog = ({ groupId }) => {

  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isLoading, isError, data, error } = useMyFriendsQuery(groupId);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  useErrors([
    {
      isError,
      error,
    },
  ]);

  const members = data?.friends;

  const selectMemberHandler = (id) => {
    setSelectedMembers((oldValues) =>
      oldValues.includes(id)
        ? oldValues.filter((currElement) => currElement !== id)
        : [...oldValues, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
    setSelectedMembers([]);
  };

  const addMemberSubmitHandler = () => {

    addMembers("Adding members...", { groupId, members: selectedMembers });
    closeHandler();
  };

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"1rem"} width={{xs: "19rem", sm:"25rem"}} spacing={"1rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"0.5rem"}>
          {isLoading ? (
            <Skeleton />
          ) : members?.length > 0 ? (
            members?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography p={"2rem"} textAlign={"center"}>
              No Friends
            </Typography>
          )}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button onClick={closeHandler} color="error">
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            disabled={isLoadingAddMembers}
            variant="contained"
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
