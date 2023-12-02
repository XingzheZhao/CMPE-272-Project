import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import noImage from '../../image/noImage.png'

import "./Item.css"
import { Button } from "@mui/material";

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState([]);
    const [deleteItem, setDeleteItem] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            const result = await axios.get("http://localhost:3001/items/item", {params: {id: id}});
            const data = result.data[0];
            console.log(result.data[0])
            setItem(data)
        }
        fetchItem();
    }, [id]);

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

    return(
        <div className={"item_page_container"}>
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
                {item.username === "test" ? 
                    <div className="buttons_container">
                        <Button variant="outlined" color="primary" onClick={handleEditItem}>Edit</Button>
                        <Button variant="outlined" className="delete_btn" color="error" onClick={handleDelete}>Delete</Button>
                    </div> 
                : 
                    <span></span>}
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
            </div>
        </div>
    );
}

export default Item;