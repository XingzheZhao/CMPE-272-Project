import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import "./Homepage.css"
import axios from 'axios';
import noImage from '../../image/noImage.png'

const Homepage = () => {
    const navigate = useNavigate();

    const [viewItems, setViewItems] = useState("on sale");
    const [onSaleItems, setOnSaleItems] = useState([]);
    const [inProgressItems, setInProgressItems] = useState([]);

    const handleView = (statement) => {
        setViewItems(statement);
    }

    const handleViewItem = (itemId) => {
        navigate(`${itemId}`)
    }

    useEffect(() => {
        const fetchOnSaleItems = async () => {
            try{
                const result = await axios.get("http://localhost:3001/items/on-sale-items");
                setOnSaleItems(result.data);
            }
            catch(err){
                console.log(err);
            }
        };
        const fetchInProgressItems = async () => {
            try{
                const result = await axios.get("http://localhost:3001/items/in-progress-items", {params: {buyer: 1}})
                setInProgressItems(result.data)
            }
            catch(err) {
                console.log(err);
            }
        }
        fetchInProgressItems();
        fetchOnSaleItems();
    },[]);

    return (
        <div className='item_page_container'>
            <div className='item_status_container'>
                <ul className='item_status_tab'>
                    <li className={`item_status sale ${viewItems==="on sale"?'active':''}`} onClick={() => handleView("on sale")}>On Sale</li>
                    <li className={`item_status progress ${viewItems==="progress"?'active':''}`} onClick={() => handleView("progress")}>In Progress</li>
                </ul>
            </div>
            <hr/>
            {viewItems==="on sale" ? 
            <React.Fragment>
                <div className='items_container'>
                    <div className='items'>
                    {
                        onSaleItems.map((item, index) => (
                            <div className='item_container' key={item.item_id}>
                                {item.item_image ? <img className='image' src={item.item_image} alt={item.item_name} onClick={() => handleViewItem(item.item_id)}/> : <img className='image' src={noImage} alt={item.item_name} onClick={() => handleViewItem(item.item_id)}/>}
                                <ul className='item_info'>
                                    <li className='info item_name' onClick={() => handleViewItem(item.item_id)}>{item.item_name}</li>
                                    <li className='info item_price'>{item.is_exchange ? "Exchange" : <React.Fragment>${item.item_price}</React.Fragment>}</li>
                                </ul>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </React.Fragment>
            :
            <React.Fragment>
                <div className='items_container'>
                    <div className='items'>
                    {
                        inProgressItems.map((item, index) => (
                            <div className='item_container' key={item.item_id}>
                                    {item.item_image ? <img className='image' src={item.item_image} alt={item.item_name} onClick={() => handleViewItem(item.item_id)}/> : <img className='image' src={noImage} alt={item.item_name} onClick={() => handleViewItem(item.item_id)}/>}
                                    <ul className='item_info'>
                                        <li className='info item_name' onClick={() => handleViewItem(item.item_id)}>{item.item_name}</li>
                                        <li className='info item_price'>{item.is_exchange ? "Exchange" : <React.Fragment>${item.item_price}</React.Fragment>}</li>
                                    </ul>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </React.Fragment>}
        </div>
    );
};

export default Homepage;