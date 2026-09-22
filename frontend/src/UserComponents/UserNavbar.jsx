import React, { useState, useEffect } from 'react';
import './UserNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../userSlice';

function UserNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, id } = useSelector((state) => state.user);

  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  let storedCart = JSON.parse(localStorage.getItem("cartItems")) || []
  // setCartItems(storedCart);

  useEffect(() => {
    const updateCartItems = () => {
      const storedCart = JSON.parse(localStorage.getItem(`cartItems`)) || [];
      setCartItems(storedCart);
    };
    updateCartItems();
    window.addEventListener('storage', updateCartItems);
    return () => {
      window.removeEventListener('storage', updateCartItems)
    }
  }, [showCart]);

  // useEffect(() => {
  //     storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  //     setCartItems(storedCart);
  // }, [showCart]);

  const handleClearCart = () => {
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new Event('storage'));
    setCartItems([]);
    setShowCart(false);
  };

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/UserComponents/Checkout');
  };

  const goBackToLogin = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <nav className='navbar'>
        <h1 className='navbar-heading'>GreenGarden</h1>
        <div className='navbar-items'>
          <button className='user-button'>{username || "DemoUser"} / User</button>
          <ul className='navbar-list'>
            <li><Link to='/Components/HomePage' className='linkk'>Home</Link></li>
            <li><Link to='/UserComponents/UserViewPlant' className='linkk'>Plant</Link></li>
            <li><Link to='/UserComponents/MyReviews' className='linkk'>Review</Link></li>
            <li><Link to='/UserComponents/MyOrders' className='linkk'>Orders</Link></li>
            <li>
              <span onClick={() => setShowCart(true)} style={{ cursor: 'pointer' }}>&#128722;{cartItems.length === 0 ? "" : <sup style={{ backgroundColor: 'red', padding: '4px', borderRadius: '50%' }}>{cartItems.length}</sup>}
              </span>
            </li>
            <li><button className='logout-btn' onClick={goBackToLogin}>Logout</button></li>
          </ul>
        </div>
      </nav>
      {showCart && (
        <div className="userCart-slide-container">
          <div className="userCart-modal">
            <div className="userCart-header">
              <h3>Your Cart</h3>
              <button className="userCart-close" onClick={() => setShowCart(false)}>X</button>
            </div>

            <div className="userCart-items">
              {cartItems.length === 0 ? (
                <p className="userCart-empty">Your cart is empty.</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="userCart-item">
                    <p><strong>{item.name}</strong> - ₹{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))
              )}
            </div>

            <div className="userCart-actions">
              <button className="userCart-clearBtn" disabled={cartItems.length === 0} onClick={handleClearCart}>
                Clear Cart
              </button>
              <button className="userCart-checkoutBtn" disabled={cartItems.length === 0} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserNavbar;
