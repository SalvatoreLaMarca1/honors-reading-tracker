
import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn} from '../supabase';

export default function Login() {



    const navigate = useNavigate()
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isValidUser = async (email: string, password: string) => {

        try {
            //const check = await checkCredentials(email, password)

            const check = await signIn(email, password)

            if(check) {
                navigate('/honors-reading-tracker/dashboard')
            }
            else
                alert("Invalid credentials")

        } catch (error) {
            console.error("Error checking credentials:", error);
            alert("Something went wrong. Please try again.");
        }
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