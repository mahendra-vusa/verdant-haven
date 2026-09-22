import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './MyReviews.css';
import UserNavbar from './UserNavbar';
import API_BASE_URL from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyReviews() {
  const navigation = useNavigate();
  const userId = useSelector((state) => state.user.id);
  const token = localStorage.getItem('Token');
  const url = API_BASE_URL;
  const [reviews, setReviews] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isLoading,updateLoadingStatus]=useState(true)

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${url}/reviews/getByUserId/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setReviews(res.data);
      updateLoadingStatus(false)
    } catch (error) {
      updateLoadingStatus(false)
      setReviews([])
      // console.error('Error fetching reviews:', error);
    }
  };

  const handleView = async (plant) => {
    console.log(plant);
    setSelectedPlant(plant);
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${url}/reviews/deleteReview/${reviewToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowDeletePopup(false);
      setReviewToDelete(null);
      fetchReviews();
      toast.success('Review deleted successfully!')
    } catch (error) {
      toast.success('Failure while  deleting the review!')
      navigation('/Components/ErrorPage')
    }
  };

  const closePopup = () => {
    setSelectedPlant(null);
    setShowDeletePopup(false);
    setReviewToDelete(null);
  };

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
      <div className="my-reviews-container">
        <h1>My Reviews</h1>
        <hr className='hrline' />
        {isLoading&&<div className='initial-loading'>
                <p>Loading.... please wait</p>
        </div>}
        {reviews.length === 0 ? (
          <p style={{ textAlign: "center", margin: "auto" }}>No reviews found.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="mreview-card">
                <h3>{review.plant.plantName || 'Plant'}</h3>
                <div className="stars">Rating
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: star <= review.rating ? '#FFD700' : '#ccc' }}>★</span>
                  ))}
                </div>
                <p className="date"><strong>Date:</strong>{new Date(review.date).toLocaleDateString()}</p>
                <p className="comment">"{review.reviewText}"</p>
                <div className="review-actions">
                  <button className="view-btn" onClick={() => handleView(review.plant)}>View Plant</button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(review._id)}>Delete Review</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Plant Popup */}
      {selectedPlant && (
        <div className="pop-overlay" onClick={closePopup}>
          <div className="pop-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPlant.coverImage} alt={selectedPlant.name} className="plant-image" />
            <h2>{selectedPlant.plantName}</h2>
            <p><strong>Category:</strong> {selectedPlant.category}</p>
            <p><strong>Price:</strong> ₹{selectedPlant.price}</p>
            <p><strong>Description:</strong> {selectedPlant.description}</p>
            <button onClick={closePopup} className="close-btn">Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Are you sure you want to delete this review?</h3>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyReviews
