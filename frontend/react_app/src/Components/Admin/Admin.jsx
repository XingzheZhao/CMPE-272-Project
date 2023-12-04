import React, { useState, useEffect } from "react";
import "./Admin.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const id = useParams();
  const [activeTab, setActiveTab] = useState("completedSell");
  const [completedSell, setCompletedSell] = useState([]);
  const [reports, setReports] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/accounts/admin", {
        withCredentials: true,
      });

      const recentBuyingSelling = response.data.completedSell;
      const userReports = response.data.report;
      console.log(recentBuyingSelling);
      console.log(userReports);

      setCompletedSell(recentBuyingSelling);
      setReports(userReports);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const renderCompletedSell = () => (
    <div className="table-view">
      <h2>Recent History</h2>
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
          </tr>
        </thead>
        <tbody>
          {reports.map((row, i) => (
            <tr key={i}>
              <td>{row.initiator_username}</td>
              <td>{row.report_reason}</td>
              <td>{row.report_description}</td>
              <td>{row.item_id}</td>
              <td>{row.item_name}</td>
              <td>{row.is_solved === 1 ? "Yes" : "No"}</td>
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
      default:
        return null;
    }
  };

  return (
    <div className="admin">
      <div className="tab">
        <div
          className={`tab ${activeTab === "completedSell" ? "active" : ""}`}
          onClick={() => setActiveTab("completedSell")}
        >
          Recent History
        </div>
        <div
          className={`tab ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          Reports
        </div>
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default Admin;
