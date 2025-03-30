
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


// Getting Book information


export async function getAllBooks() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return []
    }
    
    const { data, error } = await supabase
      .from('Books')
      .select('*')
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error fetching books:', error)
      return []
    }
    
    return data
  }


  interface BookData {
    title: string;
    author: string;
    number_of_pages: number;
  }
  
  interface Book extends BookData {
    book_id: number;
    created_at: string;
    user_id: string;
  }


  
  export async function createBook(bookData: BookData): Promise<Book | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a book');
    }
    
    // Prepare the book data with the current user's ID
    const newBook = {
      ...bookData,
      user_id: user.id
    };
    
    // Insert the book into the Books table
    const { data, error } = await supabase
      .from('Books')
      .insert([newBook])
      .select();
    
    if (error) {
      console.error('Error creating book:', error);
      throw error;
    }
    
    return data?.[0] || null;
  }



  export const addBook = async (bookData: { 
    title: string; 
    author: string; 
    number_of_pages: number 
  }) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      console.log("Attempting to insert book with user_id:", user.id);
      
      const { data, error } = await supabase
        .from('Books')
        .insert([{
          title: bookData.title,
          author: bookData.author,
          number_of_pages: bookData.number_of_pages,
          pages_read: 0,
          minutes_read: 0,
          user_id: user.id,
          created_at: new Date().toISOString() // Add this if your table expects it
        }])
        
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  // Add this to your supabase.ts file

  export const updateBookReadingTime = async (bookId: number, additionalMinutes: number) => {
    try {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      const userId = user.id;
      
      // First get the current book data, ensuring it belongs to the current user
      const { data: bookData, error: fetchError } = await supabase
        .from('Books')
        .select('minutes_read')
        .eq('book_id', bookId)
        .eq('user_id', userId)  // Filter by user_id to ensure ownership
        .single();
       
      if (fetchError) {
        throw fetchError;
      }
      
      // If no book found, it means the book doesn't exist or doesn't belong to this user
      if (!bookData) {
        throw new Error('Book not found or not owned by current user');
      }
     
      // Calculate new total minutes
      const currentMinutes = bookData.minutes_read || 0;
      const newTotalMinutes = currentMinutes + additionalMinutes;
     
      // Update the book with new minutes read, still ensuring user ownership
      const { data, error } = await supabase
        .from('Books')
        .update({ minutes_read: newTotalMinutes })
        .eq('book_id', bookId)
        .eq('user_id', userId)  // Again filter by user_id for security
        .select();
       
      if (error) {
        throw error;
      }
     
      return data;
    } catch (error) {
      console.error('Error updating reading time:', error);
      throw error;
    }
  };

  export const addEntry = async (bookId: number, minutesRead: number, pagesRead: number) => {

      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      console.log(user)
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      const userId = user.id;

      const { data, error } = await supabase
        .from('Entries')
        .insert([
          {
            book_id: bookId,
            user_id: userId,
            minutes_read: minutesRead,
            pages_read: pagesRead
          }
        ])
        
      if (error) {
        console.error("Error inserting entry: ", error)
      }

      return data;
    
  }