import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Header from "components/Header";

import Home from "components/pages/Home";
import Options from "components/pages/Options";
import Login from "components/pages/Login";
import Signup from "components/pages/Signup";
import Play from "components/pages/Play";

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/options">
                    <Options />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/play">
                    <Play />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
