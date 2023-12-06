import React, { useState, useEffect } from "react";
import "./Admin.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const id = useParams();
  const [activeTab, setActiveTab] = useState("completedSell");
  const [completedSell, setCompletedSell] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const openConfirmation = (userId) => {
    setUserIdToDelete(userId);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setUserIdToDelete(null);
    setIsConfirmationOpen(false);
  };

  const confirmRemoveUser = async () => {
    if (userIdToDelete) {
      await handleRemoveUser(userIdToDelete);
      closeConfirmation();
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/accounts/admin", {
        withCredentials: true,
      });

      const recentBuyingSelling = response.data.completedSell;
      const userReports = response.data.report;

      setCompletedSell(recentBuyingSelling);
      setReports(userReports);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/accounts/admin/view-users",
        { withCredentials: true }
      );
      const allUsers = response.data.users;
      console.log(allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleMarkAsSolved = async (reportId) => {
    try {
      await axios.put(
        `http://localhost:3001/accounts/reports/${reportId}/solve`,
        null,
        {
          withCredentials: true,
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error marking report as solved: ", error);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:3001/accounts/admin/user/${userId}`,
        { withCredentials: true }
      );
      fetchUserData();
    } catch (error) {
      console.error("Error removing user: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, [id]);

  const renderCompletedSell = () => (
    <div className="table-view">
      <h2>Recent Completed Sales</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Item Price</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Post Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {completedSell.map((row, i) => (
            <tr key={i}>
              <td>{row.item_name}</td>
              <td>{row.item_type}</td>
              <td>{row.item_price}</td>
              <td>{row.seller_username}</td>
              <td>{row.buyer_username}</td>
              <td>{row.post_datetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderReports = () => (
    <div className="table-view">
      <h2>Report</h2>
      <table>
        <thead>
          <tr>
            <th>Initiator</th>
            <th>Report Reason</th>
            <th>Report Description</th>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Is the Problem solved?</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((row, i) => (
            <tr key={i}>
              <td>{row.initiator_username}</td>
              <td>{row.report_reason}</td>
              <td>{row.report_description}</td>
              <td>
                <Link to={`/item/progress/${row.item_id}`}>{row.item_id}</Link>
              </td>
              <td>{row.item_name}</td>
              <td>{row.is_solved === 1 ? "Yes" : "No"}</td>
              <td>
                {!row.is_solved && (
                  <button onClick={() => handleMarkAsSolved(row.report_id)}>
                    Solved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsers = () => (
    <div className="table-view">
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i}>
              <td>{user.username}</td>
              <td>{user.f_name}</td>
              <td>{user.l_name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>
                <button onClick={() => openConfirmation(user.user_id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "completedSell":
        return renderCompletedSell();
      case "report":
        return renderReports();
      case "users":
        return renderUsers();
      default:
        return null;
    }
  };

  return (
    <div className="user-profile">
      <div className="tab">
        <div
          className={`tab ${activeTab === "completedSell" ? "active" : ""}`}
          onClick={() => setActiveTab("completedSell")}
        >
          Recent Completed Sales
        </div>
        <div
          className={`tab ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          Reports
        </div>
        <div
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          All Users
        </div>
      </div>
      <div className="tab-content">{renderContent()}</div>
      {isConfirmationOpen && (
        <div className="overlay" onClick={closeConfirmation}>
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p>Are you sure you want to remove this user?</p>
            <div className="confirmation-buttons">
              <button className="confirm" onClick={confirmRemoveUser}>
                Confirm
              </button>
              <button className="cancel" onClick={closeConfirmation}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
