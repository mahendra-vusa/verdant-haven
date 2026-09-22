import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar';
import './OrdersPlaced.css'
import API_BASE_URL from '../apiConfig';
import { useNavigate } from 'react-router-dom';


function OrdersPlaced() {
  const url = API_BASE_URL;
  const navigation = useNavigate();
  const token = localStorage.getItem('Token')
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [plantDetails, setPlantDetails] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const ordersPerPage = 4;
  const [currPage, setCurrPage] = useState(1);
  const [isLoading,updateLoadingStatus]=useState(true);

  const statusOptions = ['Pending', 'Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const fetchOrders = async () => {
    try {
      await axios.get(`${url}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setOrders(response.data);
          setFilteredOrders(response.data);
          updateLoadingStatus(false)
        })
    } catch (error) {
      setOrders([])
      console.log(error);

    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = (orderId, newStatus) => {
    axios.put(`${url}/orders/update/${orderId}`, { orderStatus: newStatus }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        fetchOrders();
      })
      .catch(() => {
        navigation('/Components/ErrorPage')
      })
  }

  const handleViewItems = (items) => {
    setPlantDetails(items);
    setShowItemsModal(true);
  }

  const handleViewProfile = (profile) => {
    setUserProfile(profile);
    setShowProfileModal(true);
  }

  useEffect(() => {
    const filtered = orders.filter(order => (order._id.toLowerCase().includes(searchTerm.toLowerCase())));
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sorted);
  }, [searchTerm, sortOrder])


  const handleSort = (order) => {
    setSortOrder(order);

  }

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const lastIndex = currPage * ordersPerPage;
  const firstIndex = lastIndex - ordersPerPage;
  const paginatedOrders = filteredOrders.slice(firstIndex, lastIndex);

  const handlePrev = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
  };

  const handleNext = () => {
    if (currPage < totalPages) setCurrPage(currPage + 1)
  }


  return (
    <div>
      <AdminNavbar />
      <div className='main'>
        <h1 className="h1">Orders Placed</h1>
        <hr className='hr' />
        <label htmlFor='search' className='searchLabel'><strong>Search By Order ID:</strong></label>
        <input type="text" className='search' placeholder='Search Orders...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={sortOrder} onChange={(e) => handleSort(e.target.value)} className='sort'>
          <option value="asc">Sort by Date: Ascending</option>
          <option value="desc">Sort by Date: Descending</option>
        </select>

        <div>
        {isLoading&&<div className='initial-loading'>
                <p>Loading.... please wait</p>
        </div>}
          <div className='order-card-container'>
            {paginatedOrders.map(order => (
              <div className='order-card' key={order._id}>
                <strong>Order Id:</strong> {order._id} <br />
                <strong>Total Amount:</strong> ₹{order.totalAmount} <br />
                <strong>Order Status:</strong> {order.orderStatus} <br />
                <strong>Shipping Address:</strong> {order.shippingAddress} <br />
                <strong>Billing Address:</strong> {order.billingAddress} <br />
                <strong>Date:</strong> {new Date(order.orderDate).toDateString()} <br />
                {/* <strong>Number : </strong>{order.id} <br /> */}
                <strong>Status:</strong>
                <select value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className='admin-order-actions'>
                  <button className='btn-view-items' onClick={() => handleViewItems(order.orderItems)}>View Items</button>
                  <button className='btn-view-profile' onClick={() => handleViewProfile(order.user)}>View Profile</button>
                </div>

              </div>
            ))}
          </div>
          <div className='navigation-section'>
            <button onClick={handlePrev} disabled={currPage === 1}>⬅️Previous</button>
            <span>Page {filteredOrders.length === 0 ? 0 : currPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currPage === totalPages}>➡️Next</button>
          </div>
          <br />
          {showItemsModal && plantDetails.length > 0 && (
            <div className='modal-overlay'>
              <div className='modal-content'>
                <button className='modal-close' onClick={() => setShowItemsModal(false)}>X</button>
                <h2>Order Items</h2>
                <br />
                {plantDetails.map((item, idx) => (
                  <div key={idx} className='item-card'>
                    <div className='item-image'>
                      {item.plant&&item.plant.coverImage ? (
                        <img src={item.plant.coverImage} alt={item.plant.plantName||"plant not found"} className='plantimage' />
                      ) : (
                        <div className='image-placeholder'>Image Not Available</div>
                      )}
                    </div>
                    <div className='item-details'>
                      <h3>{item.plant.plantName}</h3>
                      <p><strong>Category:</strong> {item.plant.category||"plant not found"}</p>
                      <p><strong>Price:</strong> ₹{item.plant.price||"plant not found"}</p>
                      <p><strong>Description:</strong> {item.plant.description||"plant not found"}</p>
                      <p><strong>Quantity:</strong>{item.plant.stockQuantity||"plant not found"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {showProfileModal && userProfile && (
            <div className='pop-overlay'>
              <div className='pop-content'>
                <button className='modal-close' onClick={() => setShowProfileModal(false)}>X</button>
                <h2>User Profile</h2>
                <br />
                <p><strong>Name:</strong> {userProfile.username}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Phone</strong> {userProfile.mobileNumber}</p>
                {/* <p><strong>Id:</strong>{userProfile.id}</p> */}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
export default OrdersPlaced
