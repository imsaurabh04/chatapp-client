import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";
import { useGetAllMessagesQuery } from "../../redux/api/api";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0 ? (
        attachments.map((attachment) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={attachment.public_id}>
              <a
                href={url}
                download
                target="_blank"
                style={{
                  color: "black",
                }}
              >
                <RenderAttachment file={file} url={url} />
              </a>
            </Box>
          );
        })
      ) : (
        <span>No Attachments</span>
      );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => {
      if (!params.row.content) return <span>No Content</span>;
    },
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"0.5rem"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState([]);

  const { isLoading, isError, data, error } = useGetAllMessagesQuery();

  useErrors([{ isError, error }]);

  useEffect(() => {
    if(data) {
      setRows(
        data.messages.map((message) => ({
          ...message,
          id: message._id,
          sender: {
            name: message.sender.name,
            avatar: transformImage(message.sender.avatar, 50),
          },
          createdAt: moment(message.createdAt).format(
            "ddd Do, MMM YYYY, h:mm:ss a"
          ),
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table
          heading={"All Messages"}
          rows={rows}
          columns={columns}
          rowHeight={150}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
