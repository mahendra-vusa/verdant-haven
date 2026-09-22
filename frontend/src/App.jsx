import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './AdminComponents/Dashboard';
import HomePage from './Components/HomePage';
import AddPlant from './AdminComponents/AddPlant';
import Login from './Components/Login';
import ViewPlant from './AdminComponents/ViewPlant';
import Checkout from './UserComponents/Checkout';
import AddReview from './UserComponents/AddReview';
import UserViewPlant from './UserComponents/UserViewPlant';
import ErrorPage from './Components/ErrorPage';
import ForgotPassword from './Components/ForgotPassword';
import Signup from './Components/Signup';
import PrivateRoute from './Components/PrivateRoute';
import OrdersPlaced from './AdminComponents/OrdersPlaced';
import MyOrders from './UserComponents/MyOrders';
import MyReviews from './UserComponents/MyReviews';
import ViewReviews from './AdminComponents/ViewReviews';


function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* PublicRoutes */}
        <Route path='/' element={<Login />} />
        <Route path='/Components/ErrorPage' element={<ErrorPage />} />
        <Route path='/Components/ForgotPage' element={<ForgotPassword />} />
        <Route path='/Components/Signup' element={<Signup />} />
        <Route path='/Components/*' element={<ErrorPage/>}/>


        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>

          <Route path='/Components/HomePage' element={<HomePage />} />

          {/* Admin Routes */}
          <Route path='/AdminComponents/Dashboard' element={<Dashboard />} />
          <Route path='/AdminComponents/AddPlant' element={<AddPlant />} />
          <Route path='/AdminComponents/AddPlant/:id' element={<AddPlant />} />
          <Route path='/AdminComponents/OrdersPlaced' element={<OrdersPlaced />} />
          <Route path='/AdminComponents/ViewPlant' element={<ViewPlant />} />
          <Route path='/AdminComponents/ViewReviews' element={<ViewReviews />} />
          <Route path='/AdminComponents/*' element={<ErrorPage />} />

          {/* User Routes */}
          <Route path='/UserComponents/AddReview/:plantId/:plantName' element={<AddReview />} />
          <Route path='/UserComponents/Checkout' element={<Checkout />} />
          <Route path='/UserComponents/MyOrders' element={<MyOrders />} />
          <Route path='/UserComponents/MyReviews' element={<MyReviews />} />
          <Route path='/UserComponents/UserViewPlant' element={<UserViewPlant />} />
          <Route path='/UserComponents/*' element={<ErrorPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
