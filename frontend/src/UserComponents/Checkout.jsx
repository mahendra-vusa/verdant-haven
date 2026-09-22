import React, { useEffect, useState } from 'react';
import './Checkout.css';
import UserNavbar from './UserNavbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../apiConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// Define the API URL

function Checkout() {

    const url = API_BASE_URL;
    const token = localStorage.getItem('Token')
    const userId = useSelector((state) => state.user.id);

    const navigate = useNavigate();

    // State for cart, addresses, and total amount
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [err, updateErrs] = useState('')

    // Load cart from localStorage when the component mounts or userId changes
    useEffect(() => {
        if (userId) {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setCart(parsedCart);

                // Calculate the total amount from the cart items
                const total = parsedCart.reduce((sum, item) => {
                    return sum + item.price * (item.quantity || 1);
                }, 0);
                setTotalAmount(total);
            }
        }
    }, []);

    // Function to handle placing the order
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        if (!shippingAddress.trim() || !billingAddress.trim()) {
            updateErrs('Billing Address  and Shipping Address are required');

            return;
        }

        const newOrder = {
            user: userId,
            orderItems: cart.map(itr => ({ plant: itr.plant, quantity: itr.quantity })),
            shippingAddress,
            billingAddress,
        };
        updateErrs('')
        try {
            console.log(newOrder);
            await axios.post(`${url}/orders/add`, newOrder, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(`Order placed successfully!`);

            // Clean up and navigate
            localStorage.removeItem('cartItems');
            setCart([]);
            setTotalAmount(0);
            setTimeout(() => {
                toast.error(`Error while placing the order`);
                navigate('/UserComponents/MyOrders');
            }, 1500);

        } catch (error) {
            navigate('/Components/ErrorPage')
            // console.error("Failed to place order:", error);
            // alert("Failed to place order. Please try again.");

        }
    };

    return (
        <div>
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
            <div className='confirmation-container'>
                <h1 className='order-confirm-heading'>Order Confirmation</h1>

                {/* Invoice Section */}
                <div className='invoice-container'>
                    <h2 className='invoice-heading'>Invoice</h2>
                    {cart.length > 0 ? (
                        cart.map(item => (
                            <div className='invoice-item' key={item.plant}>
                                <span>{item.name} (Qty: {item.quantity})</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                    <hr className='invoice-total-hr' />
                    <p className='total-amount'>Total Amount: ₹{totalAmount}</p>
                </div>

                {/* Shipping Details Section */}
                <div className='invoice-container'>
                    <h2 className='invoice-heading'>Shipping Details</h2>
                    <div className='inputs-div'>
                        <h3>Shipping Address:</h3>
                        <input
                            type='text'
                            className='checkout-input'
                            placeholder='Enter shipping address'
                            value={shippingAddress}
                            onChange={e => setShippingAddress(e.target.value)}
                        />
                        {/* {err&&<span className='error'>{err}</span>} */}
                        <h3>Billing Address:</h3>
                        <input
                            type='text'
                            className='checkout-input'
                            placeholder='Enter billing address'
                            value={billingAddress}
                            onChange={e => setBillingAddress(e.target.value)}
                        />
                        {err && <span className='error'>{err}</span>}
                    </div>
                </div>

                {/* Place Order Button */}
                <div className='place-order-btn-cnt'>
                    <button
                        type='button'
                        className='place-order-btn'
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
