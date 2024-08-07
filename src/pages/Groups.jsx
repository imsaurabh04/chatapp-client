import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  KeyboardBackspace as BackIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import GroupList from "../components/specific/GroupList";
import UserItem from "../components/shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember, setIsMobileMenu } from "../redux/reducers/misc";
import {
  useDeleteChatMutation,
  useGetChatDetailsQuery,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors, useSocketEvents } from "../hooks/hook";
import { LayoutLoader } from "../components/layout/Loaders";
import { getSocket } from "../socket";
import { REFETCH_GROUPS } from "../constants/events";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialog/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialog/AddMemberDialog")
);

const Groups = () => {
  const socket = getSocket();
  const navigate = useNavigate();
  const groupId = useSearchParams()[0].get("group");

  const dispatch = useDispatch();
  const { isMobileMenu, isAddMember } = useSelector((state) => state.misc);

  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const myGroups = useMyGroupsQuery();
  const groupDetails = useGetChatDetailsQuery(
    { chatId: groupId, populate: true },
    { skip: !groupId }
  );
  const [updateGroupName, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteChat, isLoadingDeleteChat] = useAsyncMutation(
    useDeleteChatMutation
  );

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];
  useErrors(errors);

  useEffect(() => {
    if (groupDetails.data && groupId) {
      const groupData = groupDetails.data.chat;
      setGroupName(groupData.name);
      setGroupNameUpdatedValue(groupData.name);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [groupDetails.data, groupId]);

  useEffect(() => {
    myGroups.refetch();
    if (!groupDetails.isUninitialized) {
      groupDetails.refetch();
    }
  }, [
    myGroups.data,
    groupDetails.data,
    myGroups.refetch,
    groupDetails.refetch,
  ]);

  const handleMobile = () => dispatch(setIsMobileMenu(true));
  const handleMobileMenuClose = () => dispatch(setIsMobileMenu(false));

  const updateGroupNameHandler = () => {
    setIsEdit(false);
    updateGroupName("Updating group name...", {
      chatId: groupId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteDialog = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = () => {
    deleteChat("Deleting group...", groupId);
    closeConfirmDeleteDialog();
    navigate("/groups");
  };

  const openAddMemberHandler = () => dispatch(setIsAddMember(true));

  const removeMemberHandler = (userId) => {
    removeMember("Removing member...", { groupId, userId });
    if (groupDetails.data?.chat?.creator?.toString() === userId.toString()) {
      navigate("/groups");
    }
  };

  const refetchGroupsHandler = useCallback(() => {
    myGroups.refetch();
    groupDetails.refetch();
  }, [myGroups.refetch, groupDetails.refetch]);

  const eventHandler = {
    [REFETCH_GROUPS]: refetchGroupsHandler,
  };

  useSocketEvents(socket, eventHandler);

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: { xs: "none", sm: "block" },
          overflow: "auto",
          height: "100%",
        }}
        sm={4}
      >
        <GroupList myGroups={myGroups.data?.groups} groupId={groupId} />
      </Grid>

      <Grid
        item
        height={"100%"}
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: "5rem 1.5rem", sm: "1rem 3rem" },
          position: "relative",
        }}
      >
        <Box>
          <Tooltip title="Back">
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                color: "whitesmoke",
                bgcolor: "black",
                "&:hover": {
                  bgcolor: "GrayText",
                },
                position: "absolute",
                left: "2rem",
                top: "2rem",
              }}
            >
              <BackIcon />
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={handleMobile}
            sx={{
              display: { xs: "block", sm: "none" },
              position: "absolute",
              right: "2rem",
              top: "2rem",
            }}
          >
            {isMobileMenu ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        {groupName && (
          <>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              spacing={"1rem"}
              padding={{ xs: "1rem", sm: "3rem" }}
            >
              {isEdit ? (
                <>
                  <TextField
                    value={groupNameUpdatedValue}
                    onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                  />
                  <IconButton
                    size="large"
                    sx={{
                      bgcolor: "whitesmoke",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={updateGroupNameHandler}
                    disabled={isLoadingGroupName}
                  >
                    <DoneIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "2rem" },
                    }}
                  >
                    {groupNameUpdatedValue}
                  </Typography>
                  <IconButton
                    size="large"
                    sx={{
                      bgcolor: "whitesmoke",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={(e) => setIsEdit(true)}
                    disabled={isLoadingGroupName}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Stack>

            <Typography
              variant="body1"
              alignSelf={"flex-start"}
              margin={{ xs: "1rem", sm: "0.5rem 2rem" }}
              paddingX={{ sm: "1rem" }}
            >
              Members
            </Typography>
            <Stack
              sx={{
                height: "50vh",
                width: "100%",
                maxWidth: "45rem",
                boxSizing: "border-box",
                padding: { sm: "1rem", xs: 0, md: "1rem 4rem" },
                spacing: "2rem",
                overflow: "auto",
              }}
            >
              {groupDetails.data?.chat?.members?.map((i) => (
                <UserItem
                  key={i._id}
                  user={i}
                  isAdmin={
                    groupDetails.data?.chat?.creator?.toString() ===
                    i._id.toString()
                  }
                  isAdded
                  styling={{
                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                    padding: "0.5rem",
                    borderRadius: "1rem",
                  }}
                  handler={removeMemberHandler}
                  handlerIsLoading={isLoadingRemoveMember}
                />
              ))}
            </Stack>

            <Stack
              marginTop={{ xs: "1rem", sm: 0 }}
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={"1rem"}
              padding={{ xs: 0, sm: "1rem", md: "1rem 4rem" }}
            >
              <Button
                onClick={openConfirmDeleteHandler}
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
              >
                Delete Group
              </Button>
              <Button
                onClick={openAddMemberHandler}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
              >
                Add member
              </Button>
            </Stack>
          </>
        )}

        {isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog groupId={groupId} />
          </Suspense>
        )}

        {confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeleteDialog}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )}

        <Drawer
          sx={{
            display: { xs: "block", sm: "none" },
          }}
          open={isMobileMenu}
          onClose={handleMobileMenuClose}
        >
          <GroupList
            w={"60vw"}
            myGroups={myGroups.data?.groups}
            groupId={groupId}
          />
        </Drawer>
      </Grid>
    </Grid>
  );
};

export default Groups;
