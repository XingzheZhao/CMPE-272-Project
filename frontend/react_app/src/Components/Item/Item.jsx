import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import noImage from '../../image/noImage.png';
import Cookies from "js-cookie";
import { Button } from "@mui/material";

import "./Item.css"

const Item = () => {
    const { status, id } = useParams();
    const [item, setItem] = useState([]);
    const [deleteItem, setDeleteItem] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!Cookies.get("username")){
            return navigate("/login");
        }
        const fetchItem = async () => {
            const result = await axios.get("http://localhost:3001/items/item", {params: {id: id}});
            const data = result.data[0];
            setItem(data)
        }
        fetchItem();
    }, [id, navigate]);

    const getBase64 = (buffer) => {
        return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    };

    const formatDateTime = (datetimeString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        return new Date(datetimeString).toLocaleDateString('en-US', options);
    }

    const handleEditItem = () => {
        navigate("edit");
    }

    const handleDelete = () =>{
        setDeleteItem(true);
    }

    const DeleteItem = async () => {
        try{
            await axios.delete("http://localhost:3001/items/item", {
                params: {id: id}
            })
            navigate("/");
        }
        catch(err){
            console.log(err);
        }
    }

    const handleInterested = async () => {
        try{
            await axios.post("http://localhost:3001/items/interested-item",
            {seller: item.username, seller_email: item.email, buyer: Cookies.get("username"), item: item.item_name, id: Cookies.get("id"), item_id: id});
            navigate("/");
        }
        catch(error){
            console.log(error);
        }
    }

    const handleReport = (e) => {
        e.preventDefault();
        navigate("report");
    }

    const handleNotInterest = async () => {
        try{
            const resp = window.confirm("Are you sure your are not interested?")
            if(resp){
                await axios.post("http://localhost:3001/items/not-interest", {item_id: id});
                navigate("/");
            }
        }
        catch(error){
            console.log(error)
        }
    }

    const handleTranscationComplete = async () => {
        try{
            const resp = window.confirm("Warning: Once transcation is complete, you cannot undo this process!")
            if(resp){
                await axios.post("http://localhost:3001/items/transcation-complete", {item_id: id})
                navigate("/");
            }
        }
        catch(error){
            console.log(error)
        }
    }

    const handleTranscationFailed = async () => {
        try{
            const resp = window.confirm("Are you sure you don't want to sell this item to this buyer?")
            if(resp){
                await axios.post("http://localhost:3001/items/not-interest", {item_id: id});
                navigate("/");
            }
        }
        catch(error){
            console.log(error)
        }
    }

    return(
        <div className="item_page_container">
            {deleteItem ? 
                <div className="warning_container">
                    <div className="warning_header">
                        <h2>Warning</h2>
                    </div>
                    <div className="warning_msg">
                        <p>Do you want to <strong>Delete</strong> this item? Once you delete it, you cannot undo the deletion.</p>
                        <div className="btns">
                            <Button color="error" variant="contained" onClick={DeleteItem} fullWidth>Yes</Button>
                        </div>
                        <div className="btns">
                            <Button color="primary" variant="contained" onClick={() => setDeleteItem(false)} fullWidth>No</Button>
                        </div>
                    </div>
                </div> 
            : <span></span>}
            <div className={deleteItem?"blur":""}>
                {
                    status === "progress" ? 
                        <></>
                    :
                    <React.Fragment>
                    {
                        item.username === Cookies.get("username") ? 
                        <div className="buttons_container">
                            <Button variant="outlined" color="primary" onClick={handleEditItem}>Edit</Button>
                            <Button variant="outlined" className="delete_btn" color="error" onClick={handleDelete}>Delete</Button>
                        </div> 
                            : 
                        <></>
                    }
                    </React.Fragment>
                }
                <div className="item_information_container">
                    <div className="image_container">
                        <img className='item_image' src={item.item_image ? `data:image/*;base64,${getBase64(item.item_image.data)}` : noImage} alt={item.item_name}/>
                    </div>
                    <div className="basic_info_container">
                        <ul className="list_info">
                            <li className="detail_info"><h1 className="item_header">{item.item_name}</h1></li>
                            <li className="detail_info"><strong>Post Date: </strong>{formatDateTime(item.post_datetime)}</li>
                            <li className="detail_info"><strong>Category: </strong>{item.item_type}</li>
                            <li className="detail_info"><strong>Description: </strong>{item.item_description}</li>
                            {item.is_exchange ? 
                                <React.Fragment>
                                    <li className="detail_info"><strong>Exchange Only</strong></li>
                                    <li className="detail_info"><strong>Item wish from Seller: </strong>{item.exchange_demand}</li>
                                </React.Fragment> 
                            :
                                <li className="detail_info"><strong>Price: </strong>${item.item_price}</li>
                            }
                            <li className="detail_info"><strong>Seller: </strong>{item.username}</li>
                            <li className="detail_info"><strong>Seller Email: </strong>{item.email}</li>
                        </ul>
                    </div>
                </div>
                <div className="interested_container">
                    {
                        status === "progress" ? 
                        <React.Fragment>
                            {
                                item.username === Cookies.get("username") ?
                                <div className="progress_btns">
                                    <Button variant="contained" color="error" onClick={handleTranscationFailed}>Transcation Failed</Button>
                                    <Button variant="contained" color="success" onClick={handleTranscationComplete}>Transcation Complete</Button>
                                </div>
                                :
                                <div>
                                    <Button variant="contained" color="warning" onClick={handleNotInterest}>Not Interested Anymore?</Button>
                                    <br></br>
                                    <br></br>
                                    <Button className="rep-but" variant="contained" size="large" onClick={handleReport}>File a report</Button>
                                </div>
                            }
                        </React.Fragment>
                        :
                        <React.Fragment>
                            {
                                item.username !== Cookies.get("username") ?
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleInterested}>
                                    I am interested in this item
                                </Button> :
                                <p>Seller cannot be interested on their own item</p>
                                
                            }
                            <br></br>
                            <br></br>
                            {
                                item.username !== Cookies.get("username") ?
                                <Button
                                    className="rep-but"
                                    variant="contained"
                                    size="large"
                                    onClick={handleReport}>
                                    File a report
                                </Button> :
                                <p>Seller cannot file a report their your own item</p>
                                
                            }
                        </React.Fragment>
                    }
                </div>
            </div>
        </div>
    );
}

export default Item;