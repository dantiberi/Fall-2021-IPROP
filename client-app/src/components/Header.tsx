import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss"

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1>Jebra</h1>
            <h2>Interactive Algebra Lessons</h2>
            <nav>
                <ul className={styles.navlinks}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/options">Options</Link>
                    </li>
                    <li>
                        <Link to="/login">Log in</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;