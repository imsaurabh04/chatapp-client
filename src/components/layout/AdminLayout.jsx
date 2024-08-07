import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  border-radius: 2rem;
  padding: 1rem 2rem;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLogout());
  }

  return (
    <Stack width={w} direction={"column"} spacing={"3rem"} p={{ xs: "1rem", sm: "3rem"}}>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
        <img src="/Chatterbox-logo.png" alt="logo" width={45} />
        <Typography
          variant="h5"
          textAlign={"center"}
          sx={{
            fontFamily: "Ubuntu, sans-serif",
            fontWeight: "400",
          }}
        >
          ChatterBox
        </Typography>
      </Stack>

      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: "black",
                color: "white",
                "&:hover": {
                  color: "white",
                },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={handleLogout}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <LogoutIcon />
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {

  const { isAdmin } = useSelector(state => state.auth); 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobile = () => {
    setIsMobileMenuOpen((oldValue) => !oldValue);
  };

  const handleClose = () => {
    setIsMobileMenuOpen(false);
  };

  if(!isAdmin) return <Navigate to="/admin" />;

  return (
    <Grid container minHeight={"100vh"}>
      <Grid
        item
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Sidebar />
      </Grid>

      <Grid item xs={12} md={8} lg={9} bgcolor={"rgba(0,0,0,0.02)"}>
        <Box
          position={"fixed"}
          right={"1rem"}
          top={"1rem"}
          sx={{
            display: { xs: "block", md: "none" },
            zIndex: 1000
          }}
        >
          <IconButton onClick={handleMobile}>
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        {children}

        <Drawer
          open={isMobileMenuOpen}
          onClose={handleClose}
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          <Sidebar w={"60vw"} />
        </Drawer>
      </Grid>
    </Grid>
  );
};

export default AdminLayout;
