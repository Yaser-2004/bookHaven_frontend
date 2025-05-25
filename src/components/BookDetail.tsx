
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, BookOpen, User, Edit, Divide } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import ReviewForm from './ReviewForm';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookById, getReviewsByBookId, currentUser } = useBooks();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  const book = getBookById(id!);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getReviewsByBookId(id);
      console.log("---->",fetchedReviews);
      
      setReviews(fetchedReviews); // local state if needed
    };
  
    fetchReviews();
  }, [id]);

  console.log(reviews);
  

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <Link to="/books" className="text-amber-600 hover:text-amber-700">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/books" 
          className="text-amber-600 hover:text-amber-700 mb-6 inline-flex items-center"
        >
          ← Back to Books
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
              />
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(book.averageRating)}
                    <span className="text-lg font-semibold text-gray-700 ml-2">
                      {book.averageRating}
                    </span>
                    <span className="text-gray-500">({book.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-gray-600">Genre</div>
                    <div className="font-semibold text-amber-600">{book.genre}</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-gray-600">Published</div>
                    <div className="font-semibold text-gray-900">{book.publishedDate
                    ? new Date(book.publishedDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Unknown'}</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-gray-600">Pages</div>
                    <div className="font-semibold text-gray-900">{book.pages}</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-gray-600">ISBN</div>
                    <div className="font-semibold text-gray-900 text-sm">{book.isbn}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {localStorage.getItem('user') ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Write a Review
                </button>
              ) : (<div className='text-amber-500 bg-amber-100 rounded-lg p-2 w-fit font-semibold'>Login / Sign Up to write a review</div>)}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this book!
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {review.user.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            bookId={book._id}
            onClose={() => setShowReviewForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BookDetail;
