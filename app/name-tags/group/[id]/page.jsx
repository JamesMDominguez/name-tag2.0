"use client"
import FaceUpload from '../faceUpload';
import { gql, useMutation } from '@apollo/client';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Menu, Modal, MenuItem, Button, AppBar, Toolbar, Typography, IconButton, Stack, Box, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import { useRouter } from 'next/navigation';
import NameTagSkeleton from '../../../../components/nameTagSkeleton';
import Collaborator from '../../../../components/Collaborator';
import LinkIcon from '@mui/icons-material/Link';

const DELETE_FACE = gql`mutation DeleteFace($deleteFaceId: ID!, $fileName: String!) {
  deleteFace(id: $deleteFaceId, fileName: $fileName)
}`

const getNameTag = gql`query Query($getNameTagId: String!) {
  getNameTag(id: $getNameTagId) {
    title
    banner
    collaborators {
        _id
        email
        access
    }
    faces {
      image
      name
      _id
    }
  }
}`

const SHARE_TAG = gql`mutation Mutation($email: ID!, $nameTagId: ID!, $access: String!) {
  createCollaborator(email: $email, nameTagId: $nameTagId, access: $access)
}`

const UPDATE_FACE = gql`mutation UpdateFace($updateFaceId: ID!, $name: String!) {
  updateFace(id: $updateFaceId, name: $name)
}`

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
};



function Page({ params }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [editingIndex, setEditingIndex] = useState(undefined)
  const [userInput, setUserInput] = useState('');
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const open = Boolean(anchorEl);
  const pid = params.id;
  const [filter, setFilter] = useState("")
  const [isShown, setIsShown] = useState({ id: null, index: null });
  const [inputValue, setInputValue] = useState('');
  const [selectedInput, setSelectedInput] = useState(undefined);
  const { data, error, loading } = useQuery(getNameTag, { variables: { getNameTagId: pid } })
  const handleMenu = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const [updateFace] = useMutation(UPDATE_FACE, {
    refetchQueries: [{ query: getNameTag, variables: { getNameTagId: pid } }]
  });
  const [deleteFace] = useMutation(DELETE_FACE, {
    refetchQueries: [{ query: getNameTag, variables: { getNameTagId: pid } }]
  })
  const [createCollaborator] = useMutation(SHARE_TAG, { refetchQueries: [{ query: getNameTag, variables: { getNameTagId: pid } }] })

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleClose2 = (e) => {
    e.stopPropagation();
    setAnchorEl2(null);
  };
  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };


  const isEmail = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(userInput);
  }
  const shareTag = async () => {
    createCollaborator({ variables: { email: userInput, nameTagId: pid, access: "editor" } })
    setUserInput("")
  }

  const CloseOrShare = () => {
    if (isEmail()) {
      return <Button onClick={() => shareTag()} variant="contained" size="medium" sx={{ borderRadius: "20px" }}>Add</Button>
    }
    return <Button onClick={() => handleClose(false)} variant="contained" size="medium" sx={{ borderRadius: "20px" }}>Done</Button>
  }

  if (loading) return <NameTagSkeleton />
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
          <img src='/nametag.webp' height={30} />
          <Typography variant="h6" component="div" fontFamily={"gloria Hallelujah"} onClick={() => router.push('/name-tags')} sx={{ flexGrow: 1 }}>
            Name Tag
          </Typography>
          {true && (
            <div>
              <Stack direction={'row'}>
                <Button variant="outlined" color="inherit" sx={{ height: "30px", margin: "8px" }} onClick={() => setShareOpen(true)} startIcon={<GroupsIcon />}> Share</Button>
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
              </Stack>
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
                <MenuItem onClick={handleClose2}>NameTags</MenuItem>
                <MenuItem onClick={handleClose2}>Profile</MenuItem>
                <MenuItem onClick={handleClose2}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>


      <div style={{ display: "flex", justifyContent: "center", overflow: "hidden", paddingBottom: "20px", marginTop: "30px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="banner" style={{ position: "relative", paddingBottom: "1rem" }}>
            <img src={data.getNameTag.banner} className='bannerImg' alt={''} />
            <p style={{ position: 'absolute', fontSize: "30px", fontFamily: "Gloria Hallelujah", top: "12rem", left: "10px", padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff', borderRadius: "30px" }}>{data.getNameTag.title}</p>
          </div>
          <TextField label={'Search Names'} id="margin-none" size='small' sx={{ width: "20rem" }} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>

      <Stack direction="row" useFlexGap flexWrap="wrap" gap={5} justifyContent="center" sx={{ paddingLeft: "100px", paddingRight: "100px" }}>
        {data.getNameTag.faces.filter((face) => face.name.toLowerCase().startsWith(filter.toLowerCase())).map((face, index) => {
          return (
            <div onMouseEnter={() => setIsShown({ id: data.getNameTag.faces._id, index: index })} key={`image-${index}`}>
              <Stack gap={1}>
                <div style={{ position: "relative" }}>
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    style={{ position: "absolute", top: 0, right: -20 }}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon style={{ color: isShown.index == index ? "black" : "white" }} />
                  </IconButton>
                  <div style={{
                    overflow: 'clip',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '2px solid #bdbdbd',
                    backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 10px ), repeating-linear-gradient( #87878755, #878787 )",
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
                  <p style={{ fontFamily: "Gloria Hallelujah", fontSize: "30px", textAlign: "center" }}>{face.name}</p>
                }
              </Stack>
            </div>
          )
        })}
      </Stack>
      <FaceUpload pid={pid} />
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

      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p style={{ fontFamily: "Sans-serif", fontSize: "25px", marginBottom: "20px", fontWeight: "lighter" }}>Share {data?.getNameTag.title}</p>
          <Stack spacing={{ xs: 1 }} direction="column" useFlexGap flexWrap="wrap">
            <TextField value={userInput} onChange={(e) => setUserInput(e.target.value)} id="outlined-basic" label="Enter Email" variant="outlined" />
            <p style={{ fontFamily: "Sans-serif", fontSize: "18px", marginTop: "10px" }}>People with access</p>
            <Stack direction="column">
              {data?.getNameTag?.collaborators.map((collaborator) => (
                <Collaborator key={collaborator._id} id={collaborator._id} email={collaborator.email} access={collaborator.access} tagID={pid} />
              ))}
            </Stack>
          </Stack>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button disabled variant="outlined" startIcon={<LinkIcon />} sx={{ borderRadius: "20px" }}>Copy Link</Button>
            <CloseOrShare />
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default Page;
