import { ListItemText, Menu, MenuItem, MenuList } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc';
import { 
  AudioFile as AudioFileIcon,
  Image as ImageIcon, 
  UploadFile as UploadFileIcon, 
  VideoFile as VideoFileIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../../redux/api/api';

const FileMenu = ({ anchorE1, chatId }) => {

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const { isFileMenu } = useSelector(state => state.misc);
  const dispatch = useDispatch();

  const [ sendAttachments ] = useSendAttachmentsMutation();

  const handleFileMenuClose = () => dispatch(setIsFileMenu(false));

  const selectRef = (ref) => ref.current?.click();

  const fileChangeHandler = async(e, key) => {

    const files = Array.from(e.target.files);

    if(files.length <= 0) return;

    if(files.length > 5) return toast.error(`You can only send 5 ${key}s at a time.`)

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    handleFileMenuClose();

    try {

      const formData = new FormData();

      formData.append("chatId", chatId);
      files.map(file => formData.append("files", file));

      const res = await sendAttachments(formData);
      if(res.data?.success) {
        toast.success(`${key} sent successfully`, { id: toastId });
      } else {
        toast.error(res.error?.data?.message || `Failed to send ${key}`, { id: toastId });
      }
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };
  
  return (
    <Menu 
      anchorEl={anchorE1} 
      open={isFileMenu} 
      onClose={handleFileMenuClose}
    >
        <div 
          style={{
            width: "9rem"
          }}
        >
          <MenuList>
            <MenuItem onClick={() => selectRef(imageRef)}>
              <ImageIcon />
              <ListItemText sx={{ marginLeft: "0.5rem" }}>Image</ListItemText>
              <input 
                ref={imageRef}
                style={{display: "none"}} 
                type="file" 
                accept="image/jpeg, image/png, image/gif"
                onChange={e => fileChangeHandler(e, "Image")}
                multiple />
            </MenuItem>

            <MenuItem onClick={() => selectRef(audioRef)}>
              <AudioFileIcon />
              <ListItemText sx={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
              <input
                ref={audioRef} 
                style={{display: "none"}} 
                type="file" 
                accept="audio/mpeg, audio/wav"
                onChange={e => fileChangeHandler(e, "Audio")}
                multiple />
            </MenuItem>

            <MenuItem onClick={() => selectRef(videoRef)}>
              <VideoFileIcon />
              <ListItemText sx={{ marginLeft: "0.5rem" }}>Video</ListItemText>
              <input 
                ref={videoRef}
                style={{display: "none"}} 
                type="file" 
                accept="video/mp4, video/webm, video/ogg"
                onChange={e => fileChangeHandler(e, "Video")}
                multiple />
            </MenuItem>

            <MenuItem onClick={() => selectRef(fileRef)}>
              <UploadFileIcon />
              <ListItemText sx={{ marginLeft: "0.5rem" }}>File</ListItemText>
              <input 
                ref={fileRef}
                style={{display: "none"}} 
                type="file" 
                accept="*"
                onChange={e => fileChangeHandler(e, "File")}
                multiple />
            </MenuItem>
          </MenuList>
        </div>
    </Menu>
  )
}

export default FileMenu