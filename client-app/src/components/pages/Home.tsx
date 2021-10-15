import Question from "components/Question";
import React from "react";

const Home: React.FC = () => {
    return (
        <div>
            <h3>Home</h3>
            <Question id={4} />
        </div>
    );
};

export default Home;