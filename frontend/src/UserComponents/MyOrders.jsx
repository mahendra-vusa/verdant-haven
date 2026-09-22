import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import API_BASE_URL from '../apiConfig';
import './MyOrders.css';
import 'react-toastify/dist/ReactToastify.css';

const DELIVERY_STEPS = [
  'Pending',
  'Order Placed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

function MyOrders() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.id);
  const token = localStorage.getItem('Token');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [itemsOrder, setItemsOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/getByUserId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Unable to load orders:', error);
      setOrders([]);
      toast.error('Unable to load your orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    // Schedule the request after this render; the callback updates state only
    // when the request has started or finished.
    const requestId = setTimeout(fetchOrders, 0);
    return () => clearTimeout(requestId);
  }, [fetchOrders]);

  console.log(itemsOrder);

  const handleCancel = async (orderId) => {
    try {
      await axios.delete(`${API_BASE_URL}/orders/delete/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Order cancelled successfully.');
      fetchOrders();
    } catch (error) {
      console.error('Unable to cancel order:', error);
      toast.error('Unable to cancel this order. Please try again.');
    }
  };

  const getStepIndex = (status) => {
    const index = DELIVERY_STEPS.findIndex(
      (step) => step.toLowerCase() === String(status || '').toLowerCase(),
    );
    return index === -1 ? 0 : index;
  };

  const handleWriteReview = (plant) => {
    if (!plant?._id) {
      toast.error('Plant details are unavailable for this item.');
      return;
    }

    navigate(`/UserComponents/AddReview/${plant._id}/${encodeURIComponent(plant.plantName || 'plant')}`);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} style={{ top: '70px' }} />
      <UserNavbar />

      <div className="orderspage">
        <h1>My Orders</h1>

        {isLoading && <div className="initial-loading"><p>Loading orders…</p></div>}

        {!isLoading && orders.length === 0 && (
          <p style={{ textAlign: 'center' }}>No orders found.</p>
        )}

        {!isLoading && orders.map((order) => {
          const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];
          const status = order.orderStatus || 'Pending';

          return (
            <div className="ordercard" key={order._id}>
              <h3>Order ID: {order.orderNumber || order._id}</h3>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount ?? 0}</p>
              <p><strong>Billing:</strong> {order.billingAddress || 'Not available'}</p>
              <p><strong>Shipping:</strong> {order.shippingAddress || 'Not available'}</p>
              <p><strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Not available'}</p>

              <div className="items-list">
                {orderItems.length > 0 ? orderItems.map((item, index) => (
                  <div key={item._id || `${order._id}-${index}`}>
                    {item.plant?.plantName || 'Plant unavailable'} (Qty: {item.quantity ?? 0})
                  </div>
                )) : <div>No items available.</div>}
              </div>
              <div className="order-actions">
              <button className="btn-track" onClick={() => setTrackedOrder(order)}>Track Order</button>
              <button className="btn-view" onClick={() => setItemsOrder(order)}>View Items</button>
              <button
                className="btn-cancel"
                onClick={() => handleCancel(order._id)}
                disabled={status.toLowerCase() !== 'pending'}
              >
                Cancel Order
              </button>
              </div>
            </div>
          );
        })}

        {trackedOrder && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button className="modal-close" onClick={() => setTrackedOrder(null)}>&times;</button>
              <h2>Tracking Order</h2>
              <p><strong>Order ID:</strong> {trackedOrder.orderNumber || trackedOrder._id}</p>
              <div className="tracking-container">
                {DELIVERY_STEPS.slice(0, getStepIndex(trackedOrder.orderStatus) + 1).map((step) => (
                  <div className="tracking-step" key={step}>{step}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {itemsOrder && (
          <div className="pop-overlay">
            <div className="pop-content">
              <button className="modal-close" onClick={() => setItemsOrder(null)}>X</button>
              <h2>Order Items</h2>
              <br />
              {(Array.isArray(itemsOrder.orderItems) ? itemsOrder.orderItems : []).map((item, index) => {
                const plant = item.plant;
                return (
                  <div key={item._id || index} className="item-card">
                    <div className="item-image">
                      {plant?.coverImage ? (
                        <img src={plant.coverImage} alt={plant.plantName || 'Plant'} className="plantt-image" />
                      ) : <div className="image-placeholder">Image Not Available</div>}
                    </div>
                    <div className="item-details">
                      <h3>{plant?.plantName || 'Plant unavailable'}</h3>
                      <p><strong>Category:</strong> {plant?.category || 'Not available'}</p>
                      <p><strong>Price:</strong> ₹{item.price ?? 0}</p>
                      <p><strong>Description:</strong> {plant?.description || 'Not available'}</p>
                      <p><strong>Quantity:</strong> {item.quantity ?? 0}</p>
                      {itemsOrder.orderStatus?.toLowerCase() == "delivered" && (
                        <button
                          className="btn-review"
                          onClick={() => handleWriteReview(plant)}
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyOrders;
