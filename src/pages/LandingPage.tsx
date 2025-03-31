
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h1 className="display-3 fw-bold text-primary mb-3">Read Now</h1>
                    <p className="fs-4 text-secondary">Develop better reading habits, one page at a time</p>
                </div>
                
                <div className="row justify-content-center mb-5">
                    <div className="col-md-10">
                        <div className="card shadow border-0 p-4">
                            <div className="row align-items-center">
                                <div className="col-lg-7 mb-4 mb-lg-0">
                                    <h2 className="fs-2 fw-semibold mb-3">Track Your Reading Journey</h2>
                                    <p className="text-secondary mb-4">
                                        Set goals, track progress, and build a consistent reading habit that lasts.
                                        Join thousands of readers who have transformed their relationship with books.
                                    </p>
                                    
                                    <div className="d-flex flex-column flex-sm-row gap-3">
                                        <button className="btn btn-primary px-4 py-2" onClick={() => navigate("/login")}>
                                            Login
                                        </button>
                                        <button className="btn btn-outline-primary px-4 py-2" onClick={() => navigate("/create-account")}>
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="col-lg-5 d-none d-lg-block">
                                    <div className="bg-light rounded p-4 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
              
                
                <div className="text-center text-secondary small mt-4">
                    <p>Start your reading journey today.</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;