// import React from 'react'
import "./HomePage.css";
// import backgroundImage from '../assets/images/background.webp';
import AdminNavbar from '../AdminComponents/AdminNavbar';
import { useSelector } from 'react-redux';
import UserNavbar from '../UserComponents/UserNavbar';

function HomePage() {


  let role = useSelector((state) => state.user.role)
  // console.log(JSON.parse(localStorage.getItem('currUser')).role);
  console.log(role);
  if (!role) {
    role = 'User'
  }
  return (
    <>
      {role === "Admin" && <AdminNavbar />}
      {role === "User" && <UserNavbar />}

      <div className='hp-image'>
        <img src="" className='hp-bg-image'></img>
        <h1 className='bg-img-heading'>GreenGarden</h1>
      </div>

      <div className='hp-description'>
        <p className='hp-desc'>
          Welcome to <b>GreenGarden,</b> your one-stop destination for premium plants
          and gardening essentials. Explore a diverse range of indoor and outdoor plants,
          gardening tools, and eco-friendly products. Whether you are a seasoned gardener or a plant enthusiat,
          find everything you need to create your perfect green space. Start shopping today and bring nature closer to your home!</p>
      </div>
      <div className='hp-footer'>
        <div>Contact Us</div>
        <div>Phone: +91 98765 43210</div>
        <div>Email: support@greengarden.com</div>
        <div>Address: 123 Green Street,Eco City,IN</div>
      </div>

    </>

  );
}
export default HomePage
