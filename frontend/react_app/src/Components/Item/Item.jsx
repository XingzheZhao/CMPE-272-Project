import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import noImage from '../../image/noImage.png'

import "./Item.css"
import { Button } from "@mui/material";

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState([]);
    const [deleteItem, setDeleteItem] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            const result = await axios.get("http://localhost:3001/items/item", {params: {id: id}});
            setItem(result.data);
        }
        fetchItem();
    }, [id]);

    const formatDateTime = (datetimeString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        return new Date(datetimeString).toLocaleDateString('en-US', options);
    }

    const handleEditItem = () => {
    }

    const handleDelete = () =>{
        setDeleteItem(true);
    }

    const DeleteItem = async () => {
        try{
            await axios.delete("http://localhost:3001/items/item", {
                params: {id: id}
            })
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
                            <Button color="error" variant="contained" fullWidth>Yes</Button>
                        </div>
                        <div className="btns">
                            <Button color="primary" variant="contained" onClick={() => setDeleteItem(false)} fullWidth>No</Button>
                        </div>
                    </div>
                </div> 
            : <span></span>}
            <div className={deleteItem?"blur":""}>
                {item[0]?.username === "test" ? 
                    <div className="buttons_container">
                        <Button variant="outlined" color="primary" onClick={handleEditItem}>Edit</Button>
                        <Button variant="outlined" className="delete_btn" color="error" onClick={handleDelete}>Delete</Button>
                    </div> 
                : 
                    <span></span>}
                <div className="item_information_container">
                    <div className="image_container">
                        {item[0]?.item_image ? <img className='item_image' src={item.item_image} alt={item.item_name}/> : <img className='item_image' src={noImage} alt={item.item_name}/>}
                    </div>
                    <div className="basic_info_container">
                        <ul className="list_info">
                            <li className="info"><h1>{item[0]?.item_name}</h1></li>
                            <li className="info"><strong>Post Date: </strong>{formatDateTime(item[0]?.post_datetime)}</li>
                            <li className="info"><strong>Category: </strong>{item[0]?.item_type}</li>
                            <li className="info"><strong>Description: </strong>{item[0]?.item_description}</li>
                            {item[0]?.is_exchange ? 
                                <React.Fragment>
                                    <li className="info"><strong>Exchange Only</strong></li>
                                    <li className="info"><strong>Item wish from Seller: </strong>{item[0]?.exchange_demand}</li>
                                </React.Fragment> 
                            :
                                <li className="info"><strong>Price: </strong>${item[0]?.item_price}</li>
                            }
                            <li className="info"><strong>Seller: </strong>{item[0]?.username}</li>
                            <li className="info"><strong>Seller Email: </strong>{item[0]?.email}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Item;