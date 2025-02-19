
import {useState} from 'react';
import "../styles/Login.css"
import { Link, useNavigate } from 'react-router-dom';
import { getUsers} from '../supabase';

export default function Login() {

    getUsers();

    const navigate = useNavigate()
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isValidUser = (email: string, password: string) => {
        if(email === "paslamarca@gmail.com" && password === "1234") {
            //alert("Login successful!")
            navigate('/honors-reading-tracker/dashboard')
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
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control input" placeholder='Enter email'></input>
            </div>

            <div className="spacer"/>

            <div className='form-group'>
                <label className="text">Password</label>
                <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='form-control input' placeholder='Enter password'></input>
            </div>

            <div className='spacer'/>

            <div className="button-cluster">

                <Link to="/honors-reading-tracker/create-account">
                    <button type="button" className="btn btn-primary btn-sm sButton">Sign Up</button>
                </Link>

                
                <button type="button" onClick={() => {isValidUser(email, password)}} className="btn btn-primary btn-sm sButton">Log in</button>
            </div>
        </form>
    )
}