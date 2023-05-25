import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import CategoryIcon from '@mui/icons-material/Category';
import EngineeringIcon from '@mui/icons-material/Engineering';
import TuneIcon from '@mui/icons-material/Tune';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import CampaignIcon from '@mui/icons-material/Campaign';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';

import Link from 'next/link';
import { useLogout } from '@/GraphQL/login';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const drawerWidth = 240;

const navItems = [
  {
    label: "categories",
    icon: <CategoryIcon />,
    href: "/categories"
  }, {
    label: "items",
    icon: <BackupTableIcon />,
    href: "/items"
  }, {
    label: "options",
    icon: <TuneIcon />,
    href: "/options"
  }, {
    label: "campaigns",
    icon: <CampaignIcon />,
    href: "/campaigns"
  }, {
    label: "jobs",
    icon: <BorderColorIcon />,
    href: "/jobs"
  },
  {
    label: "transactions",
    icon: <ReceiptLongIcon />,
    href: "/transactions"
  }, {
    label: "workers",
    icon: <EngineeringIcon />,
    href: "/workers"
  },
  {
    label: "customers",
    icon: <BackupTableIcon />,
    href: "/customers"
  }
]

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface Props {
  children: React.ReactNode;
  label: string;
}

export default function Wrapper(props: Props) {
  const { t } = useTranslation('common')
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, {
      locale: newLocale,
      scroll: false,
    });
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {props.label}
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
              <div style={{cursor: 'pointer'}} onClick={() => onToggleLanguageClick('vi')}>VI</div>
              <div style={{cursor: 'pointer'}} onClick={() => onToggleLanguageClick('en')}>EN</div>
              <IconButton
                onClick={handleLogout}
                color="inherit"
                aria-label="logout"
                edge="end"
                sx={{ mr: 2 }}
              >
                <LogoutIcon />
              </IconButton>
            </div>
          </div>

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>

        </DrawerHeader>
        <Divider />
        <List>
          {navItems.map((nav, index) => (
            <ListItem key={nav.label} disablePadding>
              <Link href={nav.href}>
                <ListItemButton>
                  <ListItemIcon>
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(nav.label)} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {props.children}
      </Main>
    </Box>
  );
}
