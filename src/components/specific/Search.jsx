import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const [ searchUser ] = useLazySearchUserQuery();
  const [ sendFriendRequest, isLoadingSendFriendRequest ] = useAsyncMutation(useSendFriendRequestMutation);

  const [users, setUsers] = useState([]);

  const searchInput = useInputValidation("");

  const handleIsSearchClose = () => dispatch(setIsSearch(false));

  const addFriendHandler = async(id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
    handleIsSearchClose();
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(searchInput.value)
        .then(({ data }) => setUsers(data.users))
        .catch((err) => toast.error("Something went wrong"));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchInput.value]);

  return (
    <Dialog open={isSearch} onClose={handleIsSearchClose}>
      <Stack direction={"column"} p={"1rem"} width={{xs: "19rem", sm:"25rem"}}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          variant="outlined"
          size="small"
          value={searchInput.value}
          onChange={searchInput.changeHandler}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
