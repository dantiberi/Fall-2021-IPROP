import React from "react";

import styles from "./Header.module.scss"
import { ReactComponent as JebraSVG } from "assets/JebraLogov2Dark.svg";

import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { StyledEngineProvider } from "@mui/material/styles"

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
        href: "/login",
    },
    {
        label: "Sign up",
        href: "/signup",
    },
    {
        label: "Play",
        href: "/play",
    },
];


const Header: React.FC = () => {
    const menuButtons = headersData.map(({ label, href }) => (
        <Button
            className={styles.menuButton}
            key={label}
            color="inherit"
            to={href}
            component={Link}
        >
            {label}
        </Button>
    ));

    return (
        <header>
            <StyledEngineProvider injectFirst>
                <AppBar className={styles.header}>
                    <Toolbar className={styles.toolbar}>
                        <JebraSVG className={styles.logo} />
                        <div className={styles.menu}>
                            {menuButtons}
                        </div>
                    </Toolbar>
                </AppBar>
            </StyledEngineProvider>
        </header>
    );
};

export default Header;