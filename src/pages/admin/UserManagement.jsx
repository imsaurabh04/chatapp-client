import { Avatar, Box, Skeleton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { useGetAllUsersQuery } from "../../redux/api/api";

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
        <Avatar alt={params.row.name} src={params.row.avatar} />
      </Box>
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "joinedDate",
    headerName: "Joined Date",
    headerClassName: "table-header",
    width: 200,
  },
];

const UserManagement = () => {
  const [rows, setRows] = useState([]);

  const { isLoading, isError, data, error } = useGetAllUsersQuery();

  useErrors([{ isError, error }]);

  useEffect(() => {
    if(data) {
      setRows(
        data.users.map((user) => ({
          ...user,
          id: user._id,
          avatar: transformImage(user.avatar, 50),
          joinedDate: moment(user.joinedDate).format("Do MMMM, YYYY"),
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Users"} rows={rows} columns={columns} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
