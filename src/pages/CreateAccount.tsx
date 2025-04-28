
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { signUp } from '../supabase';
import PreDashBar from '../components/PreDashBar';


export default function CreateAccount() {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");


    function passwordFunctions(p:string) {
        setPassword(p)
        checkPassword(p)
    }

    const numRegEx = /\d/
    const specialRegEx = /^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/
    const upperRegEx = /[A-Z]/

    
    /**
     * Checks to see if the password follows rules
     */
    const checkPassword = (p: string) => {
        const numeric = document.getElementById("numeric")
        const special = document.getElementById("special")
        const upper = document.getElementById("uppercase")
        
        if(numRegEx.test(p)) {
            if(numeric !== null) numeric.style.color = "green"
        } else {
            if(numeric !== null) numeric.style.color = "crimson"
        }
        if(specialRegEx.test(p)) {
            if(special !== null) special.style.color = "green"
        } else {
            if(special !== null) special.style.color = "crimson"
        }
        if(upperRegEx.test(p)) {
            if(upper !== null) upper.style.color = "green"
        } else {
            if(upper != null) upper.style.color="crimson"
        }

        console.log(p)
        
    }

    const isValidAccount = (email: string, password: string) => {
        // check for email validation???
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const e = emailRegex.test(email)
        const s = specialRegEx.test(password)
        const u = upperRegEx.test(password)
        const n = numRegEx.test(password)

        if(!e) alert("invalid email")

        // check if password follows rules
        if(!(s && u && n)) alert("Invalid password")

        if(s && u && n && e) {
            // createAccount(email, password)
            signUp(email, password)
        }
    }


    return (
        <div>
            <PreDashBar/>
            <form className='login-holder'>
                <h1>Create Account</h1>

                <div className='form-group'>
                    <label className="text">Email</label>
                    <input type="email" onChange = {(e) => setEmail(e.target.value)} className="form-control input" placeholder='Enter email'></input>
                </div>

                <div className="spacer"/>

                <div className='form-group'>
                    <label className="text">Password</label>
                    <input type='password' onChange={(e) => passwordFunctions(e.target.value)} className='form-control input' placeholder='Enter password'></input>
                    <div>
                        <ul className ="password-requirements">
                            <li id="uppercase">1 Uppercase Character</li>
                            <li id="special">1 Special Character</li>
                            <li id="numeric">1 Numeric Character</li>
                        </ul>
                    </div>
                </div>
                <div className='spacer'/>

                <div  className="button-cluster">

                    <Link to="/login">
                        <button type="button" className="btn btn-primary btn-sm sButton">Already have an account?</button>
                    </Link>
                    <button type='button' onClick={() => isValidAccount(email, password)} className="btn btn-primary btn-sm sButton">Create Account</button>
                </div>
            </form>
       </div>
    )
}