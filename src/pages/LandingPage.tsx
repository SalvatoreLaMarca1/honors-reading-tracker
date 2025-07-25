import { useNavigate } from 'react-router-dom';
import PreDashBar from '../components/preDashBar';


function LandingPage() {
    const navigate = useNavigate();
   
    return (
        <div className="hold-all">
            <PreDashBar/>
            <div className="main-section">

                <div className="split-section">
                    <div className="left-side">
                        <h1>Develop better reading habits, one page at a time.</h1>
                        <h6>Set goals, track progress, and build a consistent reading habit that lasts. Join thousands of readers who have transformed their relationship with books.</h6>
                        <button onClick={() => navigate("/create-account")} className="cta-button">Get Started Today</button>
                    </div>
                    <div className="right-side">
                        <svg xmlns="http://www.w3.org/2000/svg" height="300px" viewBox="0 -960 960 960" width="300px">
                            <path d="M481.77-118Q434-155 377.5-179 321-203 260-203q-39.61 0-78.15 11-38.54 11-73.21 30Q76-146 47-163.86T18-216v-480q0-21.15 9-39.24 9-18.1 28-27.76 45.63-22 97.82-33.5Q205-808 258.18-808q59.32 0 115.57 14.63Q430-778.73 480-746.29V-216q51-31.5 107-50.25T700-285q36 0 78.5 7.75T859.56-247v-535q12.21 5.75 22.58 10.37Q892.52-767 906-763q18 10.39 27 27.99 9 17.6 9 39.01v492q0 30-29.5 44t-61.5-2q-34.17-19-72.55-30-38.38-11-78.59-11-61.21 0-115.77 23.5Q529.54-156 481.77-118ZM540-309v-377l260-265v410.86L540-309Zm-142 52v-437q-28-15-67.49-23-39.49-8-69.77-8-48.23 0-88.48 8.5Q132-708 100-694.47V-249q34.67-17.96 75.84-26.98Q217-285 260.5-285q38.56 0 74.03 7.48T398-257Zm0 0v-438 438Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LandingPage;