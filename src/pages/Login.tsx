
import "../styles/Login.css"
import {useState} from 'react';

//import 'bootstrap/dist/css/bootstrap.css';

import { Link, useNavigate } from 'react-router-dom';
//import { getData } from "../firebase";

export default function Login() {
    const navigate = useNavigate()
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isValidUser = (email: string, password: string) => {
        if(email === "paslamarca@gmail.com" && password === "1234") {
            //alert("Login successful!")
            navigate('/dashboard')
            //getData()
        }
        else
            alert("Invalid credentials")
    }

    return (

        <form className='login-holder'>
            <h1>Log in</h1>

            <div className='form-group'>
                <label className="text">Email</label>
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder='Enter email'></input>
            </div>

            <div className="spacer"/>

            <div className='form-group'>
                <label className="text">Password</label>
                <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='form-control' placeholder='Enter password'></input>
            </div>

            <div className='spacer'/>

            <div className="button-cluster">

                <Link to="/create-account">
                    <button type="button" className="btn btn-primary btn-sm">Sign Up</button>
                </Link>

                
                <button type="button" onClick={() => {isValidUser(email, password)}} className="btn btn-primary btn-sm">Log in</button>
            </div>
        </form>
    )
}