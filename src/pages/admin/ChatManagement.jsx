import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { useGetAllChatsQuery } from "../../redux/api/api";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <AvatarCard avatar={params.row.avatar} />
      </Box>
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <AvatarCard max={100} avatar={params.row.members} />
      </Box>
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"0.5rem"}>
        {params.row.creator.avatar && <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />}
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const [rows, setRows] = useState([]);

  const { isLoading, isError, data, error } = useGetAllChatsQuery();

  useErrors([{ isError, error }]);

  useEffect(() => {
    if(data) {
      setRows(
        data.chats.map((chat) => ({
          ...chat,
          id: chat._id,
          members: chat.members.map((i) => i.avatar),
          creator: {
            name: chat.creator.name,
            avatar: transformImage(chat.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Chats"} rows={rows} columns={columns} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
