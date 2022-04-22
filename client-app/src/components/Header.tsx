import React, { useState, useEffect } from "react";

import styles from "./Header.module.scss"
import { ReactComponent as JebraSVG } from "assets/JebraLogov2Dark.svg";

import MenuIcon from '@mui/icons-material/Menu';

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";

import makeStyles from "@material-ui/core/styles/makeStyles";

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
        label: "Start Game",
        href: "/instructor",
    },
    {
        label: "Join Game",
        href: "/student",
    },
];
  
const useStyles = makeStyles(() => ({
    header: {
        backgroundColor: "#262F34",
        filter: "drop-shadow(4px 4px 1px rgba(0, 0, 0, 0.25))",
        borderRadius: "15px",
        //display: "flex",
        //flexFlow: "row wrap",
        position: "relative",
        height: "5rem",
        paddingLeft: "5rem",
        paddingRight: "5rem",
        //justifyContent: "space-between",
        "@media (max-width: 1000px)": {
            height: "3.5rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            //justifyContent: "start",
        },
    },
    menuButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        size: "18px",
        marginLeft: "38px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "start",
        height: "100%",
        "@media (max-width: 1000px)": {
            justifyContent: "space-between",
        },
    },
    drawerContainer: {
        padding: "20px 30px",
    },
}));
  
export default function Header() {
    const { header, menuButton, toolbar, drawerContainer } = useStyles();

    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });

    const { mobileView, drawerOpen } = state;

    useEffect(() => {
        const setResponsiveness = () => {
        return window.innerWidth < 1000
            ? setState((prevState) => ({ ...prevState, mobileView: true }))
            : setState((prevState) => ({ ...prevState, mobileView: false }));
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());

        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        };
    }, []);

    const displayDesktop = () => {
        return (
            <Toolbar className={toolbar}>
                <JebraSVG className={styles.logoDesktop} />
                <div>{getMenuButtons()}</div>
            </Toolbar>
        );
    };

    const displayMobile = () => {
        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));
        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));

        return (
            <Toolbar className={toolbar}>
                <IconButton
                    {...{
                        edge: "start",
                        color: "inherit",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleDrawerOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>{getDrawerChoices()}</div>
                </Drawer>

                <JebraSVG className={styles.logoMobile} />
            </Toolbar>
        );
    };

    const getDrawerChoices = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Link
                    {...{
                        component: RouterLink,
                        to: href,
                        color: "inherit",
                        style: { textDecoration: "none" },
                        key: label,
                    }}
                >
                    <MenuItem>{label}</MenuItem>
                </Link>
            );
        });
    };

    const getMenuButtons = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Button
                    {...{
                        key: label,
                        color: "inherit",
                        to: href,
                        component: RouterLink,
                        className: menuButton,
                    }}
                >
                    {label}
                </Button>
            );
        });
    };

    return (
        <AppBar className={header}>
            {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
    );
}