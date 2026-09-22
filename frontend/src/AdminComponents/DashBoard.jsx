import { useEffect, useState } from "react";
import "./DashBoard.css";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import { FaUser, FaLeaf, FaShoppingBag, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("Token");

  const [countUser, setCountUser] = useState(0);
  const [countPlants, setCountPlants] = useState(0);
  const [countOrders, setCountOrders] = useState(0);
  const [countReviews, setCountReviews] = useState(0);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/getAllDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setUsers(data.users || []);
        setCountUser(data.users?.length || 0);
        setCountPlants(data.plants || 0);
        setCountOrders(data.orders || 0);
        setCountReviews(data.reviews || 0);

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/Components/ErrorPage");
      });
  }, [navigate, token]);

  return (
    <>
      <AdminNavbar />

      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>

        <div className="admin-data">

          {/* Users */}
          <div className="admin-data-box admin-data-box-1">
            <div className="admin-data-box-title">
              <FaUser size={50} color="#fff" />
              <p>Total Users</p>
            </div>

            <div className="admin-box-data-count">{countUser}</div>
          </div>

          {/* Plants */}
          <div
            className="admin-data-box admin-data-box-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/AdminComponents/ViewPlant")}
          >
            <div className="admin-data-box-title">
              <FaLeaf size={50} color="#fff" />
              <p>Total Plants</p>
            </div>

            <div className="admin-box-data-count">{countPlants}</div>
          </div>

          {/* Orders */}
          <div
            className="admin-data-box admin-data-box-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/AdminComponents/OrdersPlaced")}
          >
            <div className="admin-data-box-title">
              <FaShoppingBag size={50} color="#fff" />
              <p>Total Orders</p>
            </div>

            <div className="admin-box-data-count">{countOrders}</div>
          </div>

          {/* Reviews */}
          <div
            className="admin-data-box admin-data-box-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/AdminComponents/ViewReviews")}
          >
            <div className="admin-data-box-title">
              <FaStar size={50} color="#fff" />
              <p>Total Reviews</p>
            </div>

            <div className="admin-box-data-count">{countReviews}</div>
          </div>
        </div>

        <div className="user-data-container">
          <div className="user-list-title">Users List</div>

          {isLoading && (
            <div className="initial-loading">
              <p>Loading... Please wait</p>
            </div>
          )}

          {!isLoading && (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;