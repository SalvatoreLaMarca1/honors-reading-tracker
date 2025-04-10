import { useEffect, useState } from "react";
import { addBook, getAllBooks } from "../supabase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Form } from 'react-bootstrap';

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
      console.log("Books loaded:", books);
      setBooks(books);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        padding: '0', 
        color: '#ecf0f1'
      }}>
        <div style={{ padding: '2rem 1.5rem' }}>
          <h1 style={{ 
            marginBottom: '1.5rem', 
            color: '#DCD7C9',
            fontWeight: 600
          }}>My Reading List</h1>
          <div style={{ 
            background: 'linear-gradient(145deg, #2c3e50, #1a2533)', 
            borderRadius: '15px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)', 
            padding: '2rem'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                border: '3px solid #61dafb', 
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>
                {`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}
              </style>
              <p style={{ 
                marginTop: '1rem', 
                color: '#ecf0f1',
                fontWeight: 500
              }}>Loading your books...</p>
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
      const updatedBooks = await getAllBooks();
      setBooks(updatedBooks);
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

  // Get progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return '#e74c3c';  // Red
    if (percentage < 75) return '#f39c12';  // Orange/Yellow
    return '#2ecc71';  // Green
  }

  return (
    <div className="holdBooks" style={{ color: '#ecf0f1' }}>
      <div style={{ padding: '2rem 1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem'
        }}>
          <h1 style={{ 
            color: '#DCD7C9',
            fontWeight: 600,
            margin: 0
          }}>My Reading List</h1>
          
          <button 
            style={{
              background: 'linear-gradient(145deg, #3498db, #2980b9)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 20px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onClick={handleShowModal}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            Add New Book
          </button>
        </div>

        {books.length === 0 ? (
          <div style={{ 
            background: 'linear-gradient(145deg, #2c3e50, #1a2533)', 
            borderRadius: '15px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <svg width="64" height="64" viewBox="0 0 16 16" style={{ color: '#61dafb' }} fill="currentColor">
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
              </svg>
            </div>
            <h2 style={{ color: 'white', marginBottom: '1rem', fontWeight: 600 }}>No books yet</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Start by adding a book to your reading list</p>
            <button 
              style={{
                background: 'linear-gradient(145deg, #3498db, #2980b9)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 24px',
                fontSize: '1.1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
              onClick={handleShowModal}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {books.map((book: Book) => (
              <div key={book.book_id} style={{ height: '100%' }}>
                <div style={{ 
                  background: 'linear-gradient(145deg, #2c3e50, #1a2533)',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3)';
                }}>
                  <div style={{ 
                    height: '8px', 
                    background: 'linear-gradient(90deg, #61dafb, #3498db)'
                  }}></div>
                  <div style={{ 
                    padding: '1.5rem', 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h5 style={{ 
                      color: 'white', 
                      marginBottom: '0.5rem', 
                      fontWeight: 600,
                      fontSize: '1.25rem'
                    }}>{book.title}</h5>
                    <h6 style={{ 
                      color: '#aaa', 
                      marginBottom: '1rem',
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}>by {book.author}</h6>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.875rem', 
                      color: '#aaa', 
                      marginBottom: '1rem'
                    }}>
                      <span>{book.number_of_pages} pages</span>
                      <span>Added {new Date(book.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#aaa', marginBottom: 'auto' }}>
                      <span>{book.minutes_read || 0} minutes read</span>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem'
                      }}>
                        <span style={{ color: '#aaa' }}>Reading Progress</span>
                        <span style={{ color: '#aaa' }}>{book.pages_read || 0} of {book.number_of_pages} pages</span>
                      </div>
                      <div style={{ 
                        height: '8px', 
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${calculateProgress(book.pages_read, book.number_of_pages)}%`,
                          height: '100%',
                          background: getProgressColor(calculateProgress(book.pages_read, book.number_of_pages)),
                          borderRadius: '4px',
                          transition: 'width 0.5s ease-out'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        centered
        contentClassName="bg-dark text-light"
        dialogClassName="modal-dark"
        backdropClassName="modal-backdrop-dark"
      >
        <div style={{ 
          background: 'linear-gradient(145deg, #2c3e50, #1a2533)',
          color: '#ecf0f1',
          borderRadius: '15px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(97, 218, 251, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h5 style={{ margin: 0, fontWeight: 600 }}>Add New Book</h5>
            <button 
              style={{ 
                background: 'transparent',
                border: 'none',
                color: '#ecf0f1',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onClick={handleCloseModal}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              &times;
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <Form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    color: '#ecf0f1',
                    fontWeight: 500
                  }}
                >
                  Book Title
                </label>
                <input
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: validationErrors.title 
                      ? '1px solid #e74c3c' 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  type="text"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                />
                {validationErrors.title && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {validationErrors.title}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    color: '#ecf0f1',
                    fontWeight: 500
                  }}
                >
                  Author
                </label>
                <input
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: validationErrors.author 
                      ? '1px solid #e74c3c' 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                />
                {validationErrors.author && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {validationErrors.author}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    color: '#ecf0f1',
                    fontWeight: 500
                  }}
                >
                  Number of Pages
                </label>
                <input
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: validationErrors.number_of_pages 
                      ? '1px solid #e74c3c' 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  type="number"
                  name="number_of_pages"
                  value={newBook.number_of_pages || ''}
                  onChange={handleInputChange}
                  placeholder="Enter number of pages"
                  min="1"
                />
                {validationErrors.number_of_pages && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {validationErrors.number_of_pages}
                  </div>
                )}
              </div>
            </Form>
          </div>
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(97, 218, 251, 0.2)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleCloseModal}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Cancel
            </button>
            <button 
              style={{
                background: isSubmitting 
                  ? 'rgba(97, 218, 251, 0.5)'
                  : 'linear-gradient(145deg, #3498db, #2980b9)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                fontWeight: 500,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.8 : 1
              }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #3498db, #1c6ea4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #3498db, #2980b9)';
                }
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBooks;