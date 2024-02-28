'use client'
import { signOut } from "next-auth/react"
import Nametag from '../components/nametagCard';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';
import LoadingTag from '../components/loadingTag';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useSession } from "next-auth/react"
import AddIcon from '@mui/icons-material/Add';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { ChangeEvent, useState } from 'react'
import { useMutation } from '@apollo/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const GET_TAGS = gql`
query GetNameTags($username: String!) {
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

const CREATENAMETAG = gql`mutation Mutation($email: String!, $title: String!) {
  createNameTag(email: $email, title: $title)
}`

const theme = createTheme({
  palette: {
    secondary: {
      main: '#212121',
    },
  },
});

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

const colors = ["#8FC39D", "#c78787", "#dbd991", "#8cdbc6", "#82abd9", "#8a84d9", "#ad7ede", "#d696d6"]

function Page() {
  const { data: session } = useSession()
  const { loading, data, error } = useSuspenseQuery(GET_TAGS, { variables: { username: session.user.email } });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setShareOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [createNameTag] = useMutation(CREATENAMETAG, {
    refetchQueries: [{ query: GET_TAGS, variables: { username: session?.user?.email } }],
  });
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <LoadingTag />
    )
  }


  return (
    <div>
      <AppBar color='inherit'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <img src='/nametag.webp' height={20} />
          <Typography variant="h6" component="div" fontFamily={"gloria Hallelujah"} sx={{ flexGrow: 1 }}>
            Name Tag
          </Typography>
          <div>
            <Button variant="outlined" color="inherit" sx={{ height: "30px", margin: "8px" }} onClick={() => setShareOpen(true)} startIcon={<AddIcon />}>Create</Button>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ height: "100vh" }} // Adjusted to full height
      >
        {data?.getNameTags.map((tag) => (
          <Nametag
            key={tag.nameTag._id}
            id={tag.nameTag._id}
            name={tag.nameTag.title}
            color={colors[Math.floor(Math.random() * 8)]}
          />
        ))}
      </Stack>

      <Modal
        open={isOpen}
        onClose={() => setShareOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p style={{ fontFamily: "Sans-serif", fontSize: "20px" }}>Create Name Tag</p>
          <Stack flexWrap="wrap" direction="row-reverse" row-reverse>
            <TextField onChange={(e)=>setTagName(e.target.value)} value={tagName} fullWidth id="outlined-basic" margin="normal" label="Name" variant="outlined" />

              <Button variant='outlined' size='small' color='inherit' sx={{ marginTop: "10px" }} onClick={() => {
                createNameTag({ variables: { title: tagName, email: session?.user?.email } })
                handleClose()
              }}>Create</Button>
              <Button variant="text" size='medium' color='inherit' sx={{ marginTop: "10px", marginRight: "10px" }} onClick={() => { handleClose() }}>Back</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}

export default Page;
