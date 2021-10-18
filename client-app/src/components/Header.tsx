import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss"
import { ReactComponent as JebraSVG } from './assets/JebraLogov2Dark.svg';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link as RouterLink } from "react-router-dom";

const headersData = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Options",
      href: "/options",
    },
    {
      label: "Login",
      href: "/Login",
    },
    {
      label: "Sign up",
      href: "/signup",
    },
  ];
  
export default function Header() {
  const displayDesktop = () => {
    return <Toolbar className = {styles.toolbar}>
        {JebraLogo}
        <div className = {styles.menu}> {getMenuButtons()} </div>
        </Toolbar>;
  };

  const JebraLogo = (
    <JebraSVG 
        //viewBox="0 0 20 10"
        className={styles.logo}
    />
  );
  
  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button className = {styles.menuButton}
          {...{
            key: label,
            color: "inherit",
            to: href,
            component: RouterLink,
          }}
        >
          {label}
        </Button>
      );
    });
  };

  return (
    <header>
      <AppBar className ={styles.header}>{displayDesktop()}</AppBar>
    </header>
  );
}