import { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import { addEntry, getAllBooks, updateBookReadingTime } from "../supabase"; // Adjust import path as needed
import PagesReadModal from "../components/PagesReadModal"; // Adjust import path as needed

interface Book {
  book_id: number;
  title: string;
  author: string;
  number_of_pages: number;
  created_at: string;
  user_id: string;
  pages_read?: number;
  minutes_read?: number;
}

function Read() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const [showPagesModal, setShowPagesModal] = useState(false);

  // Fetch books when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getAllBooks();
        setBooks(booksData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Timer logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    
    // Cleanup function to clear interval when component unmounts or when isRunning changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]); // Only re-run effect when isRunning changes

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setShowModal(false);
    // Start the timer automatically when a book is selected
    setIsRunning(true);
  };

  const handleFinishReading = () => {
    if (!selectedBook) {
      alert("No book selected!");
      return;
    }

    // Calculate minutes read (seconds / 60, rounded)
    const minutesRead = Math.round(seconds / 60);
    
    // Here you would update the book in the database with the new reading time
    // For example:
    updateBookReadingTime(selectedBook.book_id, minutesRead);

    setShowPagesModal(true);

    // addEntry(selectedBook.book_id, minutesRead, pagesRead);
    
    console.log(`Finished reading "${selectedBook.title}" for ${minutesRead} minutes`);
    
  };

  const handlePagesSubmit = (pagesRead: number) => {

    if(!selectedBook) {
      alert("No book selected!")
      return
    }

    
    // Calculate minutes read (seconds / 60, rounded)
    const minutesRead = Math.round(seconds / 60);
    
    // Update the book in the database with the new reading time and pages
    updateBookReadingTime(selectedBook.book_id, minutesRead);
    addEntry(selectedBook.book_id, minutesRead, pagesRead);

    console.log("THIS IS THE PSAGES REASD ", pagesRead)
    
    console.log(`Finished reading "${selectedBook.title}" for ${minutesRead} minutes (${pagesRead} pages)`);
    
    // Close the modal
    setShowPagesModal(false);
    
    // Navigate to dashboard
    navigate('/honors-reading-tracker/dashboard');
  };

  // Format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="container py-4">
      {/* Book Selection Modal */}
      <Modal 
        show={showModal} 
        onHide={() => {
          if (books.length > 0) {
            setSelectedBook(books[0]);
          }
          setShowModal(false);
        }}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Select a Book to Read</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading your books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center">
              <p>You don't have any books yet.</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/honors-reading-tracker/dashboard')}
              >
                Go Add Some Books
              </Button>
            </div>
          ) : (
            <div className="list-group">
              {books.map(book => (
                <button
                  key={book.book_id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleBookSelect(book)}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{book.title}</h5>
                    <small>{book.pages_read || 0} of {book.number_of_pages} pages</small>
                  </div>
                  <p className="mb-1">by {book.author}</p>
                </button>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/honors-reading-tracker/dashboard')}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reading Timer UI */}
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h2 className="mb-4">
            {selectedBook ? selectedBook.title : "No book selected"}
          </h2>
          
          <div className="reading-timer mb-4">
            <h1 className="display-1 fw-bold text-primary">
              {formatTime(seconds)}
            </h1>
            <p className="text-muted">Time Read</p>
          </div>
          
          <div className="d-flex justify-content-center gap-3">
            <button 
              onClick={handleFinishReading}
              className="btn btn-success"
              disabled={!selectedBook}
            >
              Finish Reading
            </button>
            
            
            <button 
              className="btn btn-primary" 
              onClick={toggleTimer}
              disabled={!selectedBook}
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => setShowModal(true)}
            >
              Change Book
            </button>
          </div>
        </div>
      </div>
      
      {selectedBook && (
        <div className="mt-3 text-center">
          <p className="text-muted">
            Currently reading: <strong>{selectedBook.title}</strong> by {selectedBook.author}
          </p>
        </div>
      )}


      <PagesReadModal 
        show={showPagesModal} 
        handleClose={() => setShowPagesModal(false)} 
        handleSubmit={handlePagesSubmit}
      />

    </div>
  );
}

export default Read;