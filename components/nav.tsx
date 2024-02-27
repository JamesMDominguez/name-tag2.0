'use client'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ShareModal from './shareModal';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import styles from './nametag.module.css';
import LoginBtn from './login-btn'
import CreateNameTag from './createNameTag';
import { useRouter,usePathname } from 'next/navigation'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';

const style: any = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: "20px",
  boxShadow: 10,
  p: 4,
};

function Nav() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter();
  const pid = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl);
  const [state, setState] = useState({ left: false });
  const toggleDrawer = (isOpen: boolean) => {
    setState({ ...state, left: isOpen });
  };

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#212121',
      },
    },
  });

  const list = () => (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{router.push('/name-tags'); toggleDrawer(false);}}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );


  return (
    <div className={styles.nav}>
      <div style={{ display: "flex" }}>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open2 ? 'long-menu' : undefined}
          aria-expanded={open2 ? 'true' : undefined}
          aria-haspopup="true"
          sx={{ padding: "0px", height: "25px", marginRight: "20px" }}
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={() => toggleDrawer(false)}
        >
          {list()}
        </Drawer>
        <img id={styles.nameTagImg} src='/nametag.webp' onClick={() => router.push("/name-tags")} />
        <h2 onClick={() => router.push("/name-tags")}>Name Tag</h2>
      </div>
      <div style={{ display: "flex" }}>
        <ThemeProvider theme={theme}>
          <Button onClick={handleOpen} color='secondary' sx={{ border: '1px solid black', borderRadius: '20px', fontSize: "10px" }} variant="outlined" startIcon={pid?<PeopleOutlineRoundedIcon />:<AddIcon/>}>
            {pid?"Share":"Create"}
          </Button>
        </ThemeProvider>
        <LoginBtn />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {pid?<ShareModal groupName={pid} handleClose={handleClose}/>:<CreateNameTag handleClose={handleClose} />}
        </Box>
      </Modal>
    </div>
  )
}
export default Nav;