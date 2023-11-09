import React, { useEffect, useState } from 'react'
import "./Homepage.css"
import axios from 'axios';
import noImage from '../../image/noImage.png'

const Homepage = () => {
    const [onSaleItems, setOnSaleItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try{
                const result = await axios.get("http://localhost:3001/items/on-sale-items");
                setOnSaleItems(result.data);
            }
            catch(err){
                console.log(err);
            }
        };
        fetchItems();
    });

    return (
        <div className='items_container'>
            <ul className='items'>
                {
                    onSaleItems.map((item, index) => (
                        <li className='item' key={index}>
                            <div className='item_container'>
                                {item.item_image ? <img className='image' src={item.item_image} alt={item.item_name}/> : <img className='image' src={noImage} alt={item.item_name}/>}
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default Homepage;