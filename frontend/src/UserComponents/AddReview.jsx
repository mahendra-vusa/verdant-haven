import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  { useState } from 'react';
import UserNavbar from './UserNavbar';
import './AddReview.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

function AddReview() {
  const navigation = useNavigate();
  const userId = useSelector((state) => state.user.id);
  const username = useSelector((state) => state.user.username);
  const token = localStorage.getItem('Token');
  const url = API_BASE_URL;
  const { plantId, plantName } = useParams()

  const [reviewTxt, setReviewTxt] = useState('');
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  // console.log(userId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reviewTxt || rating === 0) {
      alert('Please provide both a review and a rating.');
      return;
    }

    const reviewData = {
      user: userId,
      username,
      plant: plantId,
      plantName,
      rating,
      reviewText: reviewTxt
    };

    try {
      await axios.post(`${url}/reviews/add`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Review Submitted Successfully!');
      setRating(0);
      setReviewTxt('');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // console.error('Error submitting review:', error);
      toast.error('Something went wrong while adding review')
      navigation('/Components/ErrorPage')
    }
  }

  return (
    <>
      <UserNavbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ top: "70px" }}
      />
      <div className='review-box'>
        <h1>Submit Your Review</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder='Write your review here...'
            value={reviewTxt}
            onChange={(e) => setReviewTxt(e.target.value)}
            required
          />
          <div className='star-rating'>
            {[1, 2, 3, 4, 5].map((star, index) => {
              const starVal = index + 1;
              return (
                <span
                  key={index}
                  onClick={() => setRating(starVal)}
                  onMouseEnter={() => setHover(starVal)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    cursor: 'pointer',
                    fontSize: '30px',
                    color: starVal <= (hover || rating) ? '#FFD700' : '#ccc'
                  }}
                >
                  ★
                </span>
              );
            })}
          </div>
          <button type='submit' className='submit-btn'>Submit Review</button>
        </form>
      </div>
    </>
  );
}

export default AddReview;
