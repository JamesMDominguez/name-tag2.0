'use client'
import Nametag from '../../components/nametagCard';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';
import LoadingTag from '../../components/loadingTag';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import isAuth from './isAuth'

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

function Page() {
  const colors = ["#8FC39D", "#c78787", "#dbd991", "#8cdbc6", "#82abd9", "#8a84d9", "#ad7ede", "#d696d6"]
  const { loading, data, error } = useSuspenseQuery(GET_TAGS, { variables: { username: "jamesdominguez2020@gmail.com" } });
  const [anchorEl, setAnchorEl] = React.useState(null);

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
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <AppBar position="static" color='inherit'>
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
          <img src='/nametag.webp' height={30}/>
          <Typography variant="h6" component="div" fontFamily={"gloria Hallelujah"} sx={{ flexGrow: 1 }}>
          Name Tag
          </Typography>
          {true && (
            <div>
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",marginTop:"30px" }}>
        {data?.getNameTags.map((tag) => (
          <Nametag key={tag.nameTag._id} id={tag.nameTag._id} name={tag.nameTag.title} color={colors[Math.floor(Math.random() * 8)]} />
        ))}
      </div>
    </div>
  )
}

export default isAuth(Page);