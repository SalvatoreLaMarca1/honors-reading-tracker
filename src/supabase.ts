
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://dxreyeabeinrrvkolfyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cmV5ZWFiZWlucnJ2a29sZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5Mzk4MzYsImV4cCI6MjA1NTUxNTgzNn0.xkwTRvi18s2rh6pBTWhxXm6hHNLmECZ15ebB5Bw0Klo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getUserByEmail(email: string) {
    const {data, error} = await supabase
        .from('Users')
        .select('*')
        .eq('email', email)
        .single() // Fetch only one user

    if(error) {
        console.error("Error fetching user:", error.message)
        return null;
    }

    return data;
}

/**
 * Takes inputted user credentials and checks if this user exists
 * @param email user inputted email
 * @param password user inputted password
 */
export async function checkCredentials(email: string, password: string) {

   if (!email || !password) return false;

    const user= await getUserByEmail(email)

    if(!user) {
        console.error("Failed to fetch users.")
        return false;
    }
    
    // Checking if email and password matches in database
    return user.password === password
}

/**
 * Attempts to sign up to database
 */
export async function createAccount(email: string, password: string) {

    // check if user already exists
    const existingUser = await getUserByEmail(email)

    if(existingUser) {
        console.error("Account already exists!")
        return;
    }

    // Insert new user into Supabase
    const { error } = await supabase   
        .from('Users')
        .insert([{ email, password }])

    if(error) {
        console.error("Error signing up:", error.message);
        alert("Sign-up failed. Try again.")
        return
    }

    alert("Account created successfully!")
}

// Testing Supa Authentication Ideas

export async function signUp(email: string, password: string) {

    const {error} = await supabase.auth.signUp({
        email,
        password
    })

    console.log(getUser())

    if (error) {
        if (error.message.includes("User already registered")) {
            alert("An account with this email already exists!");
        } else {
            console.error("Error signing up:", error.message);
            alert("Sign-up failed. Try again.");
        }
        return;
    }

    alert("Check your email for a confirmation link!");
}

export async function signIn(email: string, password: string) {
    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if(error) {
        console.error("Error signing in:", error.message)
        alert("Invalid credentials.");
        return false;
    }

    alert("Login successsful!")
    return true;
}

export function getUser() {
    const data = supabase.auth.getUser();
    console.log(data)
    return data
}