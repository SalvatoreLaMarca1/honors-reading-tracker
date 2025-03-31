import { useEffect, useState } from "react";
import { addBook, getAllBooks } from "../supabase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

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

interface NewBookData {
    title: string;
    author: string;
    number_of_pages: number;
  }

const MyBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newBook, setNewBook] = useState<NewBookData>({
    title: '',
    author: '',
    number_of_pages: 0
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});


  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = async () => {
    try {
      const books = await getAllBooks();
      console.log("Users?")
      console.log(books);
      setBooks(books);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  if (loading) {
    return (
      <div className="container-fluid p-0 w-100">
        <div className="px-4 py-5">
          <h1 className="mb-4">My Reading List</h1>
          <div className="card">
            <div className="card-body text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your books...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewBook({ title: '', author: '', number_of_pages: 0 });
    setValidationErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: name === 'number_of_pages' ? parseInt(value) || 0 : value
    });
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!newBook.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!newBook.author.trim()) {
      errors.author = "Author is required";
    }
    
    if (!newBook.number_of_pages || newBook.number_of_pages <= 0) {
      errors.number_of_pages = "Please enter a valid number of pages";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addBook(newBook);
      handleCloseModal();
      getAllBooks(); // Refresh the books list
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate percentage of book read
  const calculateProgress = (pagesRead: number = 0, totalPages: number) => {
    return Math.round((pagesRead / totalPages) * 100);
  }

  return (
    <div className="holdBooks">
      <div className="px-4 py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-column">
          <button 
            className="btn btn-primary"
            onClick={handleShowModal}
          >
            Add New Book
          </button>
        </div>

        {books.length === 0 ? (
          <div className="card text-center p-5">
            <div className="mb-3">
              <svg className="bi" width="48" height="48" fill="currentColor" style={{ color: '#6c757d' }}>
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
              </svg>
            </div>
            <h2 className="card-title">No books yet</h2>
            <p className="card-text text-muted mb-4">Start by adding a book to your reading list</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => { /* Add navigation to add book page */ }}
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4 mx-0 row-cols-lg-3 g-4 mx-0">
            {books.map((book: Book) => (
              <div key={book.book_id} className="col">
                <div className="card h-100">
                  <div className="card-header bg-primary"></div>
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <h6 className="card-subtitle mb-3 text-muted">by {book.author}</h6>
                    <div className="d-flex justify-content-between small text-muted mb-3">
                      <span>{book.number_of_pages} pages</span>
                      <span>Added {new Date(book.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="small text-muted">
                        <span>{book.minutes_read} minutes</span>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Reading Progress: </small>
                      <small className="text-muted">{book.pages_read || 0} of {book.number_of_pages} pages</small>
                    </div>
                    <div className="progress" style={{height: "10px"}}>
                      <div 
                        className={`progress-bar ${calculateProgress(book.pages_read, book.number_of_pages) < 25 ? 'bg-danger' : calculateProgress(book.pages_read, book.number_of_pages) < 75 ? 'bg-warning' : 'bg-success'}`} 
                        role="progressbar" 
                        style={{ width: `${calculateProgress(book.pages_read, book.number_of_pages)}%` }} 
                        aria-valuenow={calculateProgress(book.pages_read, book.number_of_pages)} 
                        aria-valuemin={0} 
                        aria-valuemax={100}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Book Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newBook.title}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.title}
                placeholder="Enter book title"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={newBook.author}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.author}
                placeholder="Enter author name"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.author}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Pages</Form.Label>
              <Form.Control
                type="number"
                name="number_of_pages"
                value={newBook.number_of_pages || ''}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.number_of_pages}
                placeholder="Enter number of pages"
                min="1"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.number_of_pages}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Book'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default MyBooks;