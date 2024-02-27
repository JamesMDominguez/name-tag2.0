"use client"

import FaceUpload from '../faceUpload';
import { getSession } from "next-auth/react"
import { gql, useMutation } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const DELETE_FACE = gql`mutation DeleteFace($deleteFaceId: ID!, $fileName: String!) {
  deleteFace(id: $deleteFaceId, fileName: $fileName)
}`

const getNameTag = gql`query Query($getNameTagId: String!) {
  getNameTag(id: $getNameTagId) {
    title
    banner
    faces {
      image
      name
      _id
    }
  }
}`

const UPDATE_FACE = gql`mutation UpdateFace($updateFaceId: ID!, $name: String!) {
  updateFace(id: $updateFaceId, name: $name)
}`

function Page({ params }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [editingIndex, setEditingIndex] = useState<undefined | number>(undefined)
  const open = Boolean(anchorEl);
  const pid = params.id;
  const [filter, setFilter] = useState<string>("")
  const [isShown, setIsShown] = useState<any>({ id: null, index: null });
  const [inputValue, setInputValue] = useState('');
  const [selectedInput, setSelectedInput] = useState<number | undefined>(undefined);
  const { data,error } = useSuspenseQuery<any>(getNameTag, { variables: { getNameTagId: pid } })
  

  const handleMenu = (event) => {
    setAnchorEl2(event.currentTarget);
  };


  const [updateFace] = useMutation(UPDATE_FACE, {
    refetchQueries: [{ query: getNameTag, variables: { getNameTagId: pid } }]
  });
  const [deleteFace] = useMutation(DELETE_FACE, {
    refetchQueries: [{ query: getNameTag, variables: { getNameTagId: pid } }]
  })
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleClose2 = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl2(null);
  };
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  if (error) return <div>Error loading page</div>
  return (
    <>
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
                anchorEl={anchorEl2}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
              >
                <MenuItem onClick={handleClose2}>Profile</MenuItem>
                <MenuItem onClick={handleClose2}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>


      <div style={{ display: "flex", justifyContent: "center", overflow: "hidden", paddingBottom: "20px",marginTop:"30px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="banner" style={{ position: "relative", paddingBottom: "1rem" }}>
            <img src={data.getNameTag.banner} className='bannerImg' alt={''} />
            <p style={{ position: 'absolute', fontSize: "30px", fontFamily: "Gloria Hallelujah", top: "12rem", left: "10px", padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff', borderRadius: "30px" }}>{data.getNameTag.title}</p>
          </div>
          <TextField label={'Search Names'} id="margin-none" size='small' sx={{ width: "20rem" }} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>
      
      <Stack direction="row" useFlexGap flexWrap="wrap" gap={5} justifyContent="center" sx={{ paddingLeft: "100px", paddingRight: "100px" }}>
        {data.getNameTag.faces.filter((face: { name: string }) => face.name.startsWith(filter)).map((face: any, index: number) => {

          return (
            <div onMouseEnter={() => setIsShown({ id: data.getNameTag.faces._id, index: index })} key={`image-${index}`}>
              <Stack gap={1}>
                <div style={{ position: "relative" }}>
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    style={{ position: "absolute", top: 0, right: 0 }}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon style={{ color: isShown.index == index ? "black" : "white" }} />
                  </IconButton>
                  <div style={{
                    overflow: 'clip',
                    width: '150px',
                    height: '150px',
                    borderRadius: '20px',
                    border: '2px solid black',
                  }}>
                    <img src={face.image} alt="User Image" style={{
                      height: '100%',
                      width: '100%',
                    }} />
                  </div>
                </div>
                {face.name == "" || editingIndex == index ?
                  <TextField id="nametagInput" value={selectedInput === index ? inputValue : ""} label="Enter Name" variant="standard"
                    sx={{ width: "150px" }}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                    }}
                    onFocus={() => {
                      setSelectedInput(index)
                    }}
                    onBlur={() => {
                      setInputValue("")
                      setSelectedInput(undefined)
                    }}
                    InputProps={{
                      endAdornment: selectedInput === index && (
                        <InputAdornment position="end">
                          <IconButton onClick={() => {
                            setEditingIndex(undefined)
                            setInputValue("")
                            updateFace({ variables: { updateFaceId: face._id, name: inputValue } })
                          }} onMouseDown={handleMouseDownPassword}>
                            <CheckIcon color='success' />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  /> :
                  <p style={{ fontFamily: "Gloria Hallelujah", fontSize: "30px", textAlign: "center"}}>{face.name}</p>
                }
              </Stack>
            </div>
          )
        })}
      </Stack>
      <FaceUpload pid={pid}/>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          setEditingIndex(isShown.index)
        }}>Edit</MenuItem>
        <MenuItem onClick={(e) => {
          handleClose(e)
          deleteFace({ variables: { deleteFaceId: data.getNameTag.faces[isShown.index]._id, fileName: data.getNameTag.faces[isShown.index].image.split("/")[4] } })
        }}>Delete</MenuItem>
      </Menu>
    </>
  )
}

export default Page;
