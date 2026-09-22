import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from './UserNavbar';
import './UserViewPlant.css';
import API_BASE_URL from '../apiConfig';

function UserViewPlant() {
    const url = API_BASE_URL;
    const token = localStorage.getItem('Token')
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);
    const [searchQuery, updateSearchQuery] = useState('');
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [quantities, setQuantities] = useState({});
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [isLoading,updateLoadingStatus]=useState(true);

    useEffect(() => {

        axios.get(`${url}/plants/getAllPlants`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                updateLoadingStatus(false);
                setPlants(res.data)})
            .catch(error => navigate('/Components/ErrorPage'));
    },[]);

    const handleQuantityChange = (plantId, value) => {
        setQuantities(prev => ({ ...prev, [plantId]: parseInt(value) }));
    };

    const addToCart = (plant) => {
        const qty = quantities[plant._id] || 1;
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        console.log(cartItems);

        const existingIndex = cartItems.findIndex(item => item.plant === plant._id);
        if (existingIndex !== -1) {
            cartItems[existingIndex].quantity = cartItems[existingIndex].quantity + qty;
        } else {
            cartItems.push({ plant: plant._id, price: plant.price, quantity: qty, name: plant.plantName });
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        window.dispatchEvent(new Event('storage'))
        setShowCartMessage(true);
        setTimeout(() => setShowCartMessage(false), 3000);
    };

    const handleViewReviews = async (plant) => {
        try {
            console.log(plant)
            const res = await axios.get(`${url}/reviews/getByPlantId/${plant._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            // const selectedReview = res.data.filter(review => review.plantId === plant.id.toString());
            setSelectedPlant(plant);
            console.log(res.data);
            setReviews(res.data);
            setShowReviewPopup(true);
        } catch (error) {
            setReviews([])
            setSelectedPlant(plant);
            setShowReviewPopup(true);
            navigate('/Components/ErrorPage')
            // console.error('Error fetching reviews:', error);
        }
    };

   

    const searchedArr = searchQuery === ""
        ? plants
        : plants.filter(plant =>
            plant.plantName.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="user-view-plant">
            <UserNavbar />
           
            <div className="search-section">
                <h1 className='search-title'>Plants</h1><br />
                <input
                    type="text"
                    placeholder="Search plants..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => updateSearchQuery(e.target.value)}
                />
            </div>

            {showCartMessage && <div className="cart-popup">Added to cart!</div>}

            {isLoading&&<div className='initial-loading'>
                <p>Loading.... please wait</p>
                </div>}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            <div className='plants-cards'>
                {searchedArr.length === 0 ? (
                    <p>No plants are added yet</p>
                ) : (
                    searchedArr.map((plant, index) => (
                        <div className="plant-card" key={index}>
                            <img src={plant.coverImage} alt={plant.plantName} className="plant-img" />
                            <h5 className='head-line'>{plant.plantName}</h5>
                            <p className="price">Price: ₹{plant.price}</p>
                            <p className="description">{plant.description}</p>
                            <p className='stock'>In Stock: {plant.stockQuantity}</p>
                            <p>Category: {plant.category}</p>
                            <label htmlFor={`qty-${plant._id}`}>Quantity: </label>
                            <select
                                id={`qty-${plant._id}`}
                                className="quantity-select"
                                value={quantities[plant._id] || 1}
                                onChange={(e) => handleQuantityChange(plant._id, e.target.value)}
                            >
                                {[1, 2, 3, 4, 5].map(q => (
                                    <option key={q} value={q}>{q}</option>
                                ))}
                            </select>
                            <div className="button-group">
                                <button className="btn1" disabled={plant.stockQuantity===0} onClick={() => addToCart(plant)}>Add to Cart</button><br />
                                <button className="btn2" onClick={() => handleViewReviews(plant)}>View Reviews</button><br />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showReviewPopup && selectedPlant && (
                <div className="pop-overlay" onClick={() => setShowReviewPopup(false)}>
                    <div className="pop-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Reviews for {selectedPlant.name}</h2>
                        <div className="reviews-list">
                            {reviews.length === 0 ? (
                                <p>No reviews yet.</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="review-card">
                                        <h3 className='review-cardh3'>{review.user.username || 'Anonymous'}</h3>
                                        <div className="pStars">
                                            ⭐ Rating {review.rating}/5
                                        </div>
                                        <p className="comment">{review.reviewText}</p>
                                        <p className="date">Reviewed on: {new Date(review.date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="close-btn" onClick={() => setShowReviewPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserViewPlant;
