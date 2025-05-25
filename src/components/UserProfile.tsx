
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Heart, Calendar } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';

const UserProfile = () => {
  const { currentUser, books, reviews } = useBooks();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  const readBooks = books.filter(book => currentUser.readBooks.includes(book.id));
  const toReadBooks = books.filter(book => currentUser.toReadBooks.includes(book.id));
  const userReviews = reviews.filter(review => review.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentUser.name}</h1>
              <p className="text-gray-600 mb-4">{currentUser.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {currentUser.favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{readBooks.length}</div>
              <div className="text-gray-600">Books Read</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{userReviews.length}</div>
              <div className="text-gray-600">Reviews Written</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{toReadBooks.length}</div>
              <div className="text-gray-600">Want to Read</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Read Books */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Books Read</h2>
            </div>
            
            {readBooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No books read yet. <Link to="/books" className="text-amber-600 hover:text-amber-700">Start exploring!</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {readBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">{book.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Want to Read */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Want to Read</h2>
            </div>
            
            {toReadBooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No books in your reading list. <Link to="/books" className="text-amber-600 hover:text-amber-700">Add some!</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {toReadBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <p className="text-xs text-amber-600">{book.genre}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Reviews */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <div className="flex items-center space-x-2 mb-6">
            <Star className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-900">My Reviews</h2>
          </div>
          
          {userReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven't written any reviews yet. <Link to="/books" className="text-amber-600 hover:text-amber-700">Start reviewing!</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userReviews.map((review) => {
                const book = books.find(b => b.id === review.bookId);
                return (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <Link to={`/book/${review.bookId}`}>
                        <img
                          src={book?.coverUrl}
                          alt={book?.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link 
                          to={`/book/${review.bookId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors"
                        >
                          {book?.title}
                        </Link>
                        <p className="text-gray-600 mb-2">{book?.author}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
