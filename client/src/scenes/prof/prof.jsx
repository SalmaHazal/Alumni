import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { setLogout, setMode } from "../../state/index"; // Import setMode
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { DarkMode, LightMode } from "@mui/icons-material"; // Import icons for Dark and Light mode
import { useTheme } from "@mui/material/styles"; // Import useTheme hook
import { useTranslation } from 'react-i18next';

// Custom hook to get the first letter of a word
const useFirstLetter = (word) => {
  const [firstLetter, setFirstLetter] = useState('');
  
  useEffect(() => {
    if (word && typeof word === 'string') {
      setFirstLetter(word.charAt(0));
    } else {
      setFirstLetter('');
    }
  }, [word]);
  
  return firstLetter;
};

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const firstName = useSelector((state) => state.user.firstName); 
  const firstLetter = useFirstLetter(firstName);

  // Access the theme from Material-UI
  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{firstLetter}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate(`/home`)} >
          <Avatar  sx={{ marginRight: 1 }}  /> {firstName}
        </MenuItem>
        <Divider />

        {/* Add Dark Mode/Light Mode toggle item */}
        <MenuItem onClick={() => dispatch(setMode())}>
          <ListItemIcon>
            {theme.palette.mode === "dark" ? (
              <LightMode fontSize="small" />
            ) : (
              <DarkMode fontSize="small" />
            )}
              </ListItemIcon>
              {theme.palette.mode === "dark" ? t("Light Mode") : t("Dark Mode")}

        </MenuItem>

        <MenuItem onClick={() => {
          dispatch(setLogout());
          handleClose();
        }}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          { t ("Add another account")}
        </MenuItem>
        <MenuItem onClick={() => {
          navigate('/settings');
        }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          { t ("Settings")}
        </MenuItem>
        <MenuItem onClick={() => {
          dispatch(setLogout());
          navigate('/');
          handleClose();
        }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          { t ("Logout")}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
