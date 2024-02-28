import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, gql } from '@apollo/client';

const REMOVE_COLLABORATOR = gql`mutation Mutation($deleteCollaboratorId: ID!) {
  deleteCollaborator(id: $deleteCollaboratorId)
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


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

function Collaborator({ id, email, access,tagID }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [removeCollaborator] = useMutation(REMOVE_COLLABORATOR, {
    refetchQueries: [{ query: getNameTag, variables: { getNameTagId: tagID } }]
  });

  const deleteCollaborator = () => {
    removeCollaborator({ variables: { deleteCollaboratorId: id } })
    handleClose()
  }
  return (
    <>
      <Stack direction="row" sx={{ mt: "10px" }} justifyContent="space-between">
        <Stack direction="row">
          <AccountCircle sx={{ marginRight: "10px" }} />
          <Stack>
            <p style={{ fontFamily: "Sans-serif", fontSize: "17px" }}>{email}</p>
          </Stack>
        </Stack>
        <Button
          id="demo-customized-button"
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {access}
        </Button>
      </Stack>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disabled onClick={handleClose} disableRipple>
          <EditIcon />
          Editor
        </MenuItem>
        <MenuItem disabled onClick={handleClose} disableRipple>
          <VisibilityIcon />
          Viewer
        </MenuItem>
        <MenuItem onClick={() => deleteCollaborator()} disableRipple>
          <DeleteForeverIcon />
          Remove
        </MenuItem>
      </StyledMenu>
    </>
  )
}
export default Collaborator