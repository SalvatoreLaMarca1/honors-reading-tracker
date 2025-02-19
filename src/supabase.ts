
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://dxreyeabeinrrvkolfyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cmV5ZWFiZWlucnJ2a29sZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5Mzk4MzYsImV4cCI6MjA1NTUxNTgzNn0.xkwTRvi18s2rh6pBTWhxXm6hHNLmECZ15ebB5Bw0Klo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUsers() {
    console.log("Connecting to Supabase...")

    const {data, error} = await supabase
        .from('Users')
        .select('*');

    if(error) {
        console.error("Error fetching users:", error.message)
        return;
    }

    // map out data -> arrays with seperated parts
    const emails = data.map(user => user.email)
    const passwords = data.map(user => user.password)

    console.log(emails)
    console.log(passwords)

         console.log("Fetched Users:", data);
    // return data;
}
