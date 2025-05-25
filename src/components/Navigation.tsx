
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Book, Home } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import AuthForm from './LoginForm';
import AddBookModal from './AddBookForm';
import axios from 'axios';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const { currentUser } = useBooks();
  const [showLogin, setShowLogin] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    publishedDate: "",
    coverImage: "",
    genre: "",
    isbn: "",
    pages: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post("https://bookhaven-backend-c95u.onrender.com/api/books", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Adjust to your route
        toast.success("Book added successfully");
        setShowModal(false);
      }
      // refresh book list
    } catch (err) {
      toast.error("Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">BookHaven</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link
                to="/books"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/books') 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Browse Books</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className='relative'>
              {localStorage.getItem('userId') ? (
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-amber-600 hover:bg-amber-50'
                  }`}
                  onMouseOver={() => setShowAddBook(true)}
                >
                  {localStorage.getItem('user')}
                </button>
              ) : (
                <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )}

                <div 
                  onClick={() => setShowAddBook(!showAddBook)} 
                  className={`absolute w-28 p-2 z-10 bg-amber-100 border-2 border-amber-200 text-amber-600 rounded-lg text-sm top-10 left-0 space-y-1 ${
                    localStorage.getItem('userId') && showAddBook ? '' : 'hidden'
                  }`}
                >
                  {localStorage.getItem('role') === 'admin' && (
                    <button onClick={() => setShowModal(true)} className="w-full text-left px-2 py-1 hover:bg-amber-200 rounded">
                      Add Book
                    </button>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-2 py-1 hover:bg-amber-200 rounded"
                  >
                    Logout
                  </button>
                </div>
            </div>
          </div>
        </div>

        {showLogin && (
          <AuthForm
            onClose={() => setShowLogin(false)}
            onLogin={(email, password) => console.log('Login with:', email, password)}
            onSignup={(name, email, password) => console.log('Signup with:', name, email, password)}
          />
        )}

        {showModal && (
          <AddBookModal
            onClose={() => setShowModal(false)}
            onSubmit={handleAddBookSubmit}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </nav>
  );
};

export default Navigation;
