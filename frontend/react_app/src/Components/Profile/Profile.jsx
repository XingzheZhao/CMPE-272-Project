import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const id = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [userInfo, setUserInfo] = useState({});
  const [sellingItem, setSellingItem] = useState([]);
  const [buyingItem, setBuyingItem] = useState([]);
  const [buyingHistory, setBuyingHistory] = useState([]);
  const [sellingHistory, setSellingHistory] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/accounts/profile`,
        { withCredentials: true }
      );

      const [userProfile] = response.data.userProfile;
      const userSellingItem = response.data.sellingItem;
      const userBuyingItem = response.data.buyingItem;
      const userBuyingHistory = response.data.boughtHistory;
      const userSellingHistory = response.data.soldHistory;
      console.log(userProfile);
      setUserInfo(userProfile);
      setSellingItem(userSellingItem);
      setBuyingItem(userBuyingItem);
      setSellingHistory(userSellingHistory);
      setBuyingHistory(userBuyingHistory);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const renderProfileInfo = () => (
    <div className="profile-info">
      <h2>Profile Info</h2>
      <div>
        <strong>Username:</strong> {userInfo.username}
      </div>
      <br></br>
      <div>
        <strong>First Name:</strong> {userInfo.f_name}
      </div>
      <br></br>
      <div>
        <strong>Last Name:</strong> {userInfo.l_name}
      </div>
      <br></br>
      <div>
        <strong>Email:</strong> {userInfo.email}
      </div>
      <br></br>
      <div>
        <strong>Phone Number:</strong> {userInfo.phone_number}
      </div>
      <br></br>
    </div>
  );

  const renderSellingItems = () => (
    <div className="selling-items">
      <h2>Items That I Am Selling</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Item Price</th>
            <th>Available For Exchange?</th>
            <th>Post Date and Time</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {sellingItem.map((item, i) => (
            <tr key={i}>
              <td>
                <Link to={`/item/progress/${item.item_id}`}>
                  {item.item_name}
                </Link>
              </td>
              <td>{item.item_type}</td>
              <td>{item.item_price}</td>
              <td>{item.is_exchange === 1 ? "Yes" : "No"}</td>
              <td>{item.post_datetime}</td>
              <td>{item.item_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBuyingItems = () => (
    <div className="buying-items">
      <h2>Items That I Am Buying</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Item Price</th>
            <th>Available For Exchange?</th>
            <th>Post Date and Time</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {buyingItem.map((item, i) => (
            <tr key={i}>
              <td>
                <Link to={`/item/progress/${item.item_id}`}>
                  {item.item_name}
                </Link>
              </td>
              <td>{item.item_type}</td>
              <td>{item.item_price}</td>
              <td>{item.is_exchange === 1 ? "Yes" : "No"}</td>
              <td>{item.post_datetime}</td>
              <td>{item.item_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBoughtHistory = () => (
    <div className="history">
      <h2>Items That I Have Purchased</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Item Price</th>
            <th>Post Date and Time</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {buyingHistory.map((item, i) => (
            <tr key={i}>
              <td>{item.item_name}</td>
              <td>{item.item_type}</td>
              <td>{item.item_price}</td>
              <td>{item.post_datetime}</td>
              <td>{item.item_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSoldHistory = () => (
    <div className="history">
      <h2>Items That I Have Sold</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Item Price</th>
            <th>Post Date and Time</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {sellingHistory.map((item, i) => (
            <tr key={i}>
              <td>{item.item_name}</td>
              <td>{item.item_type}</td>
              <td>{item.item_price}</td>
              <td>{item.post_datetime}</td>
              <td>{item.item_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileInfo();
      case "buying":
        return renderBuyingItems();
      case "selling":
        return renderSellingItems();
      case "bought":
        return renderBoughtHistory();
      case "sold":
        return renderSoldHistory();
      default:
        return null;
    }
  };

  return (
    <div className="user-profile">
      <div className="tab">
        <div
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </div>
        <div
          className={`tab ${activeTab === "buying" ? "active" : ""}`}
          onClick={() => setActiveTab("buying")}
        >
          Buying
        </div>
        <div
          className={`tab ${activeTab === "selling" ? "active" : ""}`}
          onClick={() => setActiveTab("selling")}
        >
          Selling
        </div>
        <div
          className={`tab ${activeTab === "bought" ? "active" : ""}`}
          onClick={() => setActiveTab("bought")}
        >
          Items That I Have Bought
        </div>
        <div
          className={`tab ${activeTab === "sold" ? "active" : ""}`}
          onClick={() => setActiveTab("sold")}
        >
          Items That I Have Sold
        </div>
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default Profile;
