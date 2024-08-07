import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { useErrors } from "../../hooks/hook";
import { useGetDashboardStatsQuery } from "../../redux/api/api";

const Appbar = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: "1rem",
        m: "2rem 0",
        borderRadius: "1rem",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={{ xs: "0.5rem", sm: "1rem" }}
      >
        <AdminPanelSettingsIcon
          sx={{
            fontSize: "3rem",
          }}
        />
        <SearchField placeholder="Search..." type="text" />
        <IconButton
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            padding: "0.7rem",
            bgcolor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <SearchIcon />
        </IconButton>
        <CurveButton sx={{ display: { xs: "none", sm: "block" } }}>
          Search
        </CurveButton>
        <Box flexGrow={1} />
        <Typography
          sx={{
            display: { xs: "none", lg: "block" },
            textAlign: "center",
            color: "GrayText",
          }}
        >
          {moment().format("dddd, MMMM D YYYY")}
        </Typography>

        <NotificationsIcon />
      </Stack>
    </Paper>
  );
};

const Widgets = ({ data }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={"2rem"}
    justifyContent={"space-between"}
    alignItems={"center"}
    margin={"2rem 0"}
  >
    <Widget title={"Users"} value={data?.stats?.usersCount} icon={<PersonIcon />} />
    <Widget title={"Chats"} value={data?.stats?.chatsCount} icon={<GroupIcon />} />
    <Widget title={"Messages"} value={data?.stats?.messagesCount} icon={<MessageIcon />} />
  </Stack>
);

const Dashboard = () => {
  const { isLoading, isError, data, error } = useGetDashboardStatsQuery();

  useErrors([{ isError, error }]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Container component={"main"}>
          <Appbar />

          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              lg: "stretch",
            }}
            sx={{
              gap: "2rem",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: { xs: "1.5rem", sm: "2rem 3.5rem" },
                borderRadius: "1rem",
                width: "100%",
                maxWidth: "40rem",
              }}
            >
              <Typography variant="h4" margin={"1rem 0"}>
                Last Messages
              </Typography>
              <LineChart value={data?.stats?.messagesChart} />
            </Paper>
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                borderRadius: "1rem",
                width: { xs: "100%", sm: "50%" },
                maxWidth: "24rem",
                position: "relative",
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[(data?.stats?.chatsCount - data?.stats?.groups), data?.stats?.groups]}
              />
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                spacing={"0.5rem"}
                position={"absolute"}
              >
                <PersonIcon />
                <Typography>Vs</Typography>
                <GroupIcon />
              </Stack>
            </Paper>
          </Stack>

          <Widgets data={data} />
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, icon }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        borderRadius: "1rem",
        width: "20rem",
      }}
    >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: "rgba(0,0,0,0.7)",
            borderRadius: "100%",
            border: "5px solid black",
            width: "5rem",
            height: "5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value}
        </Typography>
        <Stack direction={"row"} alignItems={"center"} spacing={"0.5rem"}>
          {icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Dashboard;
