// import React from 'react'
import './AdminNavbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../userSlice';

function AdminNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usrname = useSelector((state) => state.user.username)

  function goBackToLogin() {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  }
  return (
    <div>
      <nav className='navbar'>
        <h1 className='navbar-heading'>GreenGarden</h1>
        <div className='navbar-items'>
          <button className='admin-button'>{usrname ? usrname : "Demo Admin"}/Admin</button>
          <ul className='navbar-list'>
            <li><Link to='/Components/HomePage' className='linkk'>Home</Link></li>
            <li><Link to='/AdminComponents/Dashboard' className='linkk'>Dashboard</Link></li>
            <li><Link to='/AdminComponents/AddPlant' className='linkk'>Add Plant</Link></li>
            <li><Link to='/AdminComponents/ViewPlant' className='linkk'>Plants</Link></li>
            <li><Link to='/AdminComponents/OrdersPlaced' className='linkk'>Orders</Link></li>
            <li><Link to='/AdminComponents/ViewReviews' className='linkk'>Reviews</Link></li>
            <li><button className='logout-btn' onClick={goBackToLogin}>Logout</button></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default AdminNavbar
