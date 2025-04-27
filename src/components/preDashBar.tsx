

import { useNavigate } from "react-router-dom";

function PreDashBar() {
    const navigate = useNavigate();
    return (
        <>
        <div className="bar">
                <h1 onClick={() => navigate("/")} className="logo"><u>Read Now</u></h1>
                <div className="right-cluster">
                    <h5 onClick={() => navigate("/login")} className="nav-btn">Log In</h5>
                    <h5 onClick={() => navigate("/create-account")} className="nav-btn">Sign Up</h5>
                    <h5 onClick={() => navigate("/about")} className="nav-btn">About</h5>
                </div>
            </div>
        </>
    )
}

export default PreDashBar