import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    return (
        <header>
            <h1>Jebra</h1>
            <h2>Interactive Algebra Lessons</h2>
            <nav>
                <ul>
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