'use client'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import EditNameTag from './editNameTag'

const DELETE_TAG = gql`mutation DeleteNameTag($tagId: String!) {
    deleteNameTag(tagID: $tagId)
  }`
const GET_TAGS = gql`query Query($username: String!) {
    getNameTags(username: $username) {
      access
      email
      nameTag {
        title
        banner
        _id
      }
    }
  }`

function Nametag({ id, name, color }) {
    const [isOpen, setOpen] = useState(false);
    const handleModelOpen = () => setOpen(true);
    const handleModelClose = () => {
        setOpen(false)
    };
    const router = useRouter();
    const [deleteNameTag] = useMutation(DELETE_TAG, {
        refetchQueries: [{ query: GET_TAGS, variables: { username: "jamesdominguez2020@gmail.com" } }]
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };
    const handleClose = (e) => {
        e.stopPropagation();
        setAnchorEl(null);
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        borderRadius: "20px",
        boxShadow: 10,
        p: 4,
    }

    return (
        <>
        <div onClick={() => router.push(`${id}`)} style={{ width: "350px", height: "20%", boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: "22px", margin: "20px" }}>
            <div style={{ height: "10%", backgroundColor: color, borderTopLeftRadius: '20px', borderTopRightRadius: '20px', textAlign: "center", position: "relative", height:"75px" }}>
                <p style={{ color: "white", fontSize: "40px", fontFamily: "Arial" }}>Hello</p>
                <p style={{ color: "white", fontSize: "15px", fontFamily: "Arial" }}>My Name is</p>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    style={{ position: "absolute", top: 10, right: 10 }}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon style={{ color: 'white' }} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                        }
                    }}
                >
                    <MenuItem onClick={(e) => {
                        handleClose(e)
                        e.stopPropagation()
                        handleModelOpen()
                    }}>Edit</MenuItem>
                    <MenuItem onClick={(e) => {
                        handleClose(e)
                        deleteNameTag({ variables: { tagId: id } })
                    }}>Delete</MenuItem>
                </Menu>
            </div>
            <div style={{ backgroundColor: "white", padding: "20px", textAlign: "center" }}>
                <p style={{ fontFamily: "Gloria Hallelujah", fontSize: "30px" }}>{name}</p>
            </div>
            <div style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', backgroundColor: color, height:"52px" }}></div>
        </div>
        <Modal
            open={isOpen}
            onClose={handleModelClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <EditNameTag handleClose={handleModelClose} name={name} tagID={id}/>
        </Box>
        </Modal>
        </>
    )
}
export default Nametag;