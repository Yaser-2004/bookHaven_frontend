
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publishedDate: Date;
  averageRating: number;
  totalReviews: number;
  description: string;
  coverImage: string;
  featured?: boolean;
  isbn: string;
  pages: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface BookContextType {
  books: Book[];
  reviews: Review[];
  bookReviews: Review[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  searchTerm: string;
  selectedGenre: string;
  setSearchTerm: (term: string) => void;
  setSelectedGenre: (genre: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getBookById: (id: string) => Book | undefined;
  getReviewsByBookId: (bookId: string) => Promise<Review[]>;
  filteredBooks: Book[]; // still aliasing `books` for now
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}


const BookContext = createContext<BookContextType | undefined>(undefined);

const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely beautiful and thought-provoking. Made me reflect on my own life choices.',
    date: '2024-03-15'
  },
  {
    id: '2',
    bookId: '1',
    userId: '2',
    userName: 'Mike Chen',
    rating: 4,
    comment: 'Great concept, well executed. Some parts felt a bit slow but overall very engaging.',
    date: '2024-03-10'
  },
  {
    id: '3',
    bookId: '2',
    userId: '3',
    userName: 'Emily Davis',
    rating: 5,
    comment: 'A masterpiece of science fiction. Herbert created an incredibly detailed universe.',
    date: '2024-03-12'
  }
];

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
  };

  const getBookById = (id: string) => books.find(book => book._id === id);

  const getReviewsByBookId = async (bookId: string) => {
    try {
      const response = await axios.get(`https://bookhaven-backend-c95u.onrender.com/api/reviews/${bookId}`);
  
      setBookReviews(response.data); // store in state
      console.log(response.data);
      return response.data as Review[];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  };
  

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = {
          page: currentPage,
          limit: 6,
          search: searchTerm, // optional
          genre: selectedGenre, // optional
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (selectedGenre) {
          params.genre = selectedGenre;
        }

        const response = await axios.get('https://bookhaven-backend-c95u.onrender.com/api/books/all', { params });

        setBooks(response.data.books);
        setTotalPages(response.data.totalPages || 1);
        console.log(response.data.books);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [searchTerm, selectedGenre, currentPage]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === '' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });
  


  return (
    <BookContext.Provider value={{
      books,
      reviews,
      bookReviews,
      currentUser,
      searchTerm,
      selectedGenre,
      setSearchTerm,
      setCurrentUser,
      setSelectedGenre,
      addReview,
      getBookById,
      getReviewsByBookId,
      filteredBooks, // You no longer need local filtering, since it's done in API
      currentPage,
      totalPages,
      setCurrentPage
    }}>
      {children}
    </BookContext.Provider>
    
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
