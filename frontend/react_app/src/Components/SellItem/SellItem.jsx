import { Button, Switch, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import noImage from '../../image/noImage.png'
import axios from "axios";

import "./SellItem.css";

const SellItem = () => {
    const username = Cookies.get("username");
    const id = Cookies.get("id");
    const navigate = useNavigate();

    useEffect(() => {
        if(!username){
            navigate("/login");
        }
    }, [username, navigate])

    const [data, setData] = useState({
        seller_id: id,
        item_name: "",
        item_type: "",
        item_price: 0.0,
        is_exchange: false,
        exchange_demand: null,
        item_image: null,
        item_description: ""
    });
    const [charLimit, setCharLimit] = useState(1000);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];

        if (selectedImage && selectedImage.type.startsWith('image/')) {
          setData({...data, item_image: selectedImage});
        } else {
          console.log('Invalid file selected. Please choose a valid image file.');
        }
        setError("");
    }

    const handleClearImg = () => {
        setData({...data, item_image: null})
        setError("");
    }

    const handleItemChange = (e) =>{
        setData({...data, [e.target.name]: e.target.value})
        setError("");
    }

    const handleDescriptionChange = (e) => {
        if(e.target.value.length <= 1000){
            setData({...data, [e.target.name]: e.target.value})
            setCharLimit(1000 - e.target.value.length)
        }
        setError("");
    }

    const handleIsExchange = () => {
        setData((prevItem) => {
            const status = Boolean(prevItem.is_exchange);
            const updatedItem = {
              ...prevItem,
              is_exchange: !status,
            };

            if (!status) {
              updatedItem.item_price = 0;
            } 
            else {
              updatedItem.exchange_demand = null;
            }
            return updatedItem;
        });
        setError("");
    }

    const handleSell = async (e) => {
        try{
            e.preventDefault();
            if(data.item_name === ""){
                setError("Missing Attribute");
            }
            else if(data.item_description === ""){
                setError("Missing Attribute");
            }
            else if(data.item_type === ""){
                setError("Missing Attribute");
            }
            else if(data.exchange_demand === ""){
                if(data.is_exchange){
                    setError("Missing Attribute");
                }
            }
            else if(data.exchange_demand === null){
                if(data.is_exchange){
                    setError("Missing Attribute")
                }
            }
            else{
                const formData = new FormData();
                formData.append('id', data.seller_id);
                formData.append('item_image', data.item_image);
                formData.append('item_name', data.item_name);
                formData.append('item_type', data.item_type);
                formData.append('item_description', data.item_description);
                formData.append('is_exchange', data.is_exchange);
                formData.append('item_price', data.item_price);
                formData.append('exchange_demand', data.exchange_demand);

                if(data.item_image === null){
                    await axios.post("http://localhost:3001/items/item/create-null-image", formData);
                }
                else{
                    await axios.post("http://localhost:3001/items/item/create", formData, {
                        headers: {
                            'Content-Type': 'multipart/formData',
                        },
                    }); 
                }
                navigate("/");
            }
        }
        catch (err){
            console.log(err);
            setError("Error Occurs");
        }
    }

    return(
        <div className="create_sell_container">
            <div className="edit_image_container">
                {data.item_image ? (
                    <React.Fragment>
                        <label>
                            <img
                                className="edit_item_image"
                                src={URL.createObjectURL(data.item_image)}
                                alt={data.item_name} />
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}/>
                        </label>
                        <div>
                            <Button color="secondary" onClick={handleClearImg}>Clear</Button>
                        </div>
                    </React.Fragment>) :
                    (<label>
                        <img
                            className="edit_item_image"
                            src={noImage}
                            alt={data.item_name}/>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}/>
                    </label>
                )}
            </div>
            <div className="edit_info_container">
                <div className="edit_info_inputs">
                    <TextField
                        name="item_name"
                        label="Item Name"
                        placeholder="Item Name"
                        type="text"
                        variant="outlined"
                        value={data.item_name}
                        onChange={e => handleItemChange(e)}
                        required
                        fullWidth
                    />
                </div>
                <div className="edit_info_inputs">
                    <TextField
                        name="item_type"
                        label="Item Type"
                        placeholder="Item Type"
                        type="text"
                        variant="outlined"
                        value={data.item_type}
                        onChange={e => handleItemChange(e)}
                        required
                        fullWidth
                    />
                </div>
                <div className="edit_info_inputs">
                    <textarea
                        className="area"
                        name="item_description"
                        placeholder="Item Description"
                        type="text"
                        value={data.item_description}
                        onChange={(e) => handleDescriptionChange(e)}
                        required/>
                    <p className="char_warning">Characters remaining: {charLimit}/1000</p>
                </div>
                <div className="edit_info_inputs">
                    <div className="stack">
                        <Typography>Price</Typography>
                        <Switch checked={data.is_exchange} onClick={handleIsExchange}/>
                        <Typography>Exchange</Typography>
                    </div>
                </div>
                <div className="edit_info_inputs">
                        {
                            data.is_exchange ? 
                                <div>
                                    <TextField
                                        name="exchange_demand"
                                        label="Exchange Demand"
                                        placeholder="Exchange Demand"
                                        type="text"
                                        variant="outlined"
                                        value={data.exchange_demand}
                                        onChange={e => handleItemChange(e)}
                                        required
                                        fullWidth
                                    />
                                </div>
                            :
                                <div className="pricing">
                                    <p className="dollor_symbol">$</p>
                                    <TextField
                                        name="item_price"
                                        label="Item Price"
                                        type="number"
                                        variant="outlined"
                                        value={data.item_price}
                                        onChange={e => handleItemChange(e)}
                                        required
                                        fullWidth
                                    />
                                </div>
                        }
                </div>
                {error && <div className="err_msg">{error}</div>}
                <div className="edit_info_inputs flex">  
                    <div className="cancel_btn"><Button onClick={() => navigate("/")} variant="contained" color="warning">Cancel</Button></div>
                    <Button onClick={handleSell} variant="contained" color="primary">Sell</Button>
                </div>
            </div>
        </div>
    );

}

export default SellItem;