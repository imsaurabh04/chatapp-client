import React, { Suspense, lazy } from "react";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import toast from "react-hot-toast";
import {
  setIsMobileMenu,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationsDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMobile = () => dispatch(setIsMobileMenu(true));
  const handleSearch = () => dispatch(setIsSearch(true));
  const handleNotifications = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  }

  const handleNewGroup = () => dispatch(setIsNewGroup(true));

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const navigateToGroups = () => {
    return navigate("/groups");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          sx={{
            bgcolor: "#9EDDFF",
          }}
        >
          <Toolbar>
            <Stack 
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{display: { xs: "none", sm: "flex" }}}
            >
              <img src="/Chatterbox-logo.png" alt="app-logo" width={45} />
              <Typography
                sx={{
                  fontFamily: "Ubuntu, sans-serif",
                  fontWeight: "400",
                }}
                color={"black"}
                variant="h5"
              >
                ChatterBox
              </Typography>
            </Stack>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
              }}
            ></Box>

            <Box>
              <IconBtn
                title="Search"
                icon={<SearchIcon />}
                onClick={handleSearch}
              />
              <IconBtn
                title="New Group"
                icon={<AddIcon />}
                onClick={handleNewGroup}
              />
              <IconBtn
                title="Manage Groups"
                icon={<GroupIcon />}
                onClick={navigateToGroups}
              />
              <IconBtn
                title="Notifications"
                icon={<NotificationsIcon />}
                onClick={handleNotifications}
                value={notificationCount}
              />
              <IconBtn
                title="Logout"
                icon={<LogoutIcon />}
                onClick={handleLogout}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationsDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
