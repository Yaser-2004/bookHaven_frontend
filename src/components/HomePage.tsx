import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, BookOpen } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';

const HomePage = () => {
  const {
    books,
    searchTerm,
    selectedGenre,
    setSearchTerm,
    setSelectedGenre
  } = useBooks();

  const topRatedBooks = books.sort((a, b) => b.averageRating - a.averageRating).slice(0, 4);
  const genres = [...new Set(books.map(book => book.genre))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-amber-600"> Great Read</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of readers sharing reviews, discovering new books, and building their personal libraries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Browse Books
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center px-8 py-3 border border-amber-600 text-base font-medium rounded-md text-amber-600 bg-white hover:bg-amber-50 transition-colors"
            >
              Explore Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Top Rated Books */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-amber-600" />
              <h2 className="text-3xl font-bold text-gray-900">Top Rated</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topRatedBooks.map((book) => (
              <Link key={book._id} to={`/book/${book._id}`} className="group">
                <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700">{book.averageRating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Genre */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Genre</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/books?genre=${encodeURIComponent(genre)}`}
                className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg hover:bg-amber-50 transition-all duration-300 group"
              >
                <div className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {genre}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {books.filter(book => book.genre === genre).length} books
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
