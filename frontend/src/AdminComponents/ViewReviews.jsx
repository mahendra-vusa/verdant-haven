import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewReviews.css';
import AdminNavbar from './AdminNavbar';
import API_BASE_URL from '../apiConfig';
import { useNavigate } from 'react-router-dom';


function ViewReviews() {
  const navigation = useNavigate();
  const token = localStorage.getItem('Token');
  const url = API_BASE_URL;
  const [reviews, setReviews] = useState([]);

  const [plantInfo, setPlantInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [userModal, setUserModal] = useState(false);

  const [sortOrder, setSortOrder] = useState('asc')

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading,updateLoadingStatus]=useState(true)


  const filteredReviews = reviews.filter(review =>
    review.plant.plantName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedArr = filteredReviews.sort((a, b) => {
    return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
  });

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${url}/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log(response.data);
      setReviews(response.data.reviews);
      updateLoadingStatus(false);
    }
    catch (err) {
      setReviews([]);
      // console.log(err);
      navigation('/Components/ErrorPage')
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const plantsPerPage = 2;
  let total = Math.ceil(sortedArr.length / plantsPerPage);
  const [currPage, updateCurrPage] = useState(1);
  let last = currPage * plantsPerPage;
  let first = last - plantsPerPage;



  const slicedArr = sortedArr.slice(first, last);

  const handleView = (plant) => {
    // const plant = plants.find(p => p.id == plantId);
    setPlantInfo(plant);
    setShowModal(true);
  };

  const handleViewProf = (user) => {
    // const user = users.find(p => p.id == userId);
    setUserInfo(user);
    setUserModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    setPlantInfo(null);
    setUserInfo(null);
  };

  function handlePrev() {
    updateCurrPage(currPage - 1);
  }
  function handleNext() {
    updateCurrPage(currPage + 1);
  }

  return (
    <>
      <AdminNavbar />
      <div className="user-my-review">
        <h2>View Reviews</h2>
        <div className="userView-line"></div>
        <div className='Adminfilter-section'>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Sort by Date: Ascending</option>
            <option value="desc">Sort by Date: Descending</option>
          </select>
        </div>
        {isLoading&&<div className='initial-loading'>
                <p>Loading.... please wait</p>
        </div>}
        {slicedArr.length === 0 ? (
          <p className='noReviews'>No reviews submitted yet.</p>
        ) : (
          slicedArr.map(review => (
            <div key={review._id} className="vreview-card">
              <h3>{review.plant.plantName}</h3>
              <p>Rating: {'⭐'.repeat(review.rating)}</p>
              <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
              <p>{review.reviewText}</p>
              <button className='viewBtn' onClick={() => handleView(review.plant)}>View Product</button>
              <button className='viewProf' onClick={() => handleViewProf(review.user)}>View Profile</button>
            </div>
          ))
        )}

        <div className='navigation-section'>
          <button onClick={handlePrev} disabled={!first}>⬅️Previous</button>
          <span>Page {slicedArr.length === 0 ? 0 : currPage} of {total}</span>
          <button onClick={handleNext} disabled={currPage === total}>Next➡️</button>
        </div>

        {showModal && plantInfo && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={closeModal}>×</button>
              <h3>{plantInfo.plantName}</h3>
              <img src={plantInfo.coverImage} alt={plantInfo.plantName} className="modal-image" />
              <p><strong>Price:</strong> ₹{plantInfo.price}</p>
              <p><strong>Category:</strong> {plantInfo.category}</p>
              <p><strong>Description:</strong> {plantInfo.description}</p>
            </div>
          </div>
        )}

        {userModal && userInfo && (
          <div className="pop-overlay">
            <div className="pop-content">
              <button className="modal-close" onClick={closeModal}>×</button>
              <h3>{userInfo.username}</h3>
              {/* <p><strong>ID:</strong> {userInfo.id}</p> */}
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Mobile:</strong> {userInfo.mobileNumber}</p>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default ViewReviews;
