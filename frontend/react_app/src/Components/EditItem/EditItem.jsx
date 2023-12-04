import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import noImage from '../../image/noImage.png';
import { Button, Switch, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";

import "./EditItem.css"

const EditItem = () => {
    const { status, id } = useParams();
    const [item, setItem] = useState({});
    const [imageFromSQL, setImageFromSQL] = useState(true);
    const [charLimit, setCharLimit] = useState(1000);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    
    useEffect(() => {
        if(!Cookies.get("username")){
            return navigate("/login");
        }
        const fetchItem = async () => {
            const result = await axios.get("http://localhost:3001/items/item", {params: {id: id}});
            setItem(result.data[0]);
            setCharLimit(1000 - result.data[0].item_description.length);
        }
        fetchItem();
    }, [id, navigate]);

    const getBase64 = (buffer) => {
        return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];

        if (selectedImage && selectedImage.type.startsWith('image/')) {
          setItem({...item, item_image: selectedImage});
          setImageFromSQL(false);
        } else {
          console.log('Invalid file selected. Please choose a valid image file.');
        }
    }

    const handleClearImg = () => {
        setItem({...item, item_image: null})
        setImageFromSQL(false);
    }

    const handleItemChange = (e) =>{
        setItem({...item, [e.target.name]: e.target.value})
    }

    const handleDescriptionChange = (e) => {
        if(e.target.value.length <= 1000){
            setItem({...item, [e.target.name]: e.target.value})
            setCharLimit(1000 - e.target.value.length)
        }
    }

    const handleIsExchange = () => {
        setItem((prevItem) => {
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
    }

    const handleSave = async (e) => {
        try {
            e.preventDefault();

            if(item.item_name === "" 
                || item.item_description === "" 
                || item.item_type === "" 
                || (item.is_exchange && item.exchange_demand === "")
                || (item.is_exchange && item.exchange_demand === null)){
                setError("Missing Attribute");
            }
            else{
                const formData = new FormData();
                formData.append('id', id);
                formData.append('item_image', item.item_image);
                formData.append('item_name', item.item_name);
                formData.append('item_type', item.item_type);
                formData.append('item_description', item.item_description);
                formData.append('is_exchange', item.is_exchange);
                formData.append('item_price', item.item_price);
                formData.append('exchange_demand', item.exchange_demand);
      
                if(imageFromSQL){
                  await axios.post("http://localhost:3001/items/item/edit-no-image", formData);
                }
                else if(item.item_image !== null){
                  await axios.post("http://localhost:3001/items/item/edit", formData, {
                      headers: {
                          'Content-Type': 'multipart/formData',
                      },
                  });
                }
                else{
                  await axios.post("http://localhost:3001/items/item/edit-null-image", formData);
                }
                navigate(`/item/${status}/${id}`);
            }
        } catch (err) {
          console.log(err);
          setError(err.message);
        }
    }

    return (
        <div className="edit_container">
            <div className="edit_image_container">
                {item.item_image ? (
                    <React.Fragment>
                        <label>
                            <img
                                className="edit_item_image"
                                src={!imageFromSQL ? URL.createObjectURL(item.item_image) : `data:image/*;base64,${getBase64(item.item_image.data)}`}
                                alt={item.item_name} />
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
                            alt={item.item_name}/>
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
                        type="text"
                        variant="outlined"
                        value={item.item_name}
                        onChange={e => handleItemChange(e)}
                        required
                        fullWidth
                    />
                </div>
                <div className="edit_info_inputs">
                    <TextField
                        name="item_type"
                        type="text"
                        variant="outlined"
                        value={item.item_type}
                        onChange={e => handleItemChange(e)}
                        required
                        fullWidth
                    />
                </div>
                <div className="edit_info_inputs">
                    <textarea
                        className="area"
                        name="item_description"
                        type="text"
                        value={item.item_description}
                        onChange={(e) => handleDescriptionChange(e)}
                        required/>
                    <p className="char_warning">Characters remaining: {charLimit}/1000</p>
                </div>
                <div className="edit_info_inputs">
                    <div className="stack">
                        <Typography>Price</Typography>
                        <Switch checked={item.is_exchange} onClick={handleIsExchange}/>
                        <Typography>Exchange</Typography>
                    </div>
                </div>
                <div className="edit_info_inputs">
                        {
                            item.is_exchange ? 
                                <div>
                                    <TextField
                                        name="exchange_demand"
                                        type="text"
                                        variant="outlined"
                                        value={item.exchange_demand}
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
                                        type="number"
                                        variant="outlined"
                                        value={item.item_price}
                                        onChange={e => handleItemChange(e)}
                                        required
                                        fullWidth
                                    />
                                </div>
                        }
                </div>
                {error && <div className="err_msg">{error}</div>}
                <div className="edit_info_inputs flex">  
                    <div className="cancel_btn"><Button onClick={() => navigate(`/item/${status}/${id}`)} variant="contained" color="warning">Cancel</Button></div>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </div>
            </div>
        </div>
    )
}

export default EditItem;