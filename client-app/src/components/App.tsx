import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Header from "components/Header";

import Home from "components/pages/Home";
import Options from "components/pages/Options";
import InstructorPortal from "components/pages/InstructorPortal";
import Signup from "components/pages/Signup";
import StudentPortal from "components/pages/StudentPortal";

import "./App.scss";

const App: React.FC = () => {
    return (
        <div className={"app"}>
            <Router>
                <Header />
                <Switch>
                    <Route path="/options">
                        <Options />
                    </Route>
                    <Route path="/instructor">
                        <InstructorPortal />
                    </Route>
                    <Route path="/signup">
                        <Signup />
                    </Route>
                    <Route path="/student">
                        <StudentPortal />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
};

export default App;