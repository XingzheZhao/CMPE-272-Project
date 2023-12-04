import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { Button, IconButton, InputAdornment, TextField } from "@mui/material"
import { Search } from '@mui/icons-material'
import axios from 'axios';
import noImage from '../../image/noImage.png'
import Cookies from 'js-cookie';

import "../Homepage/Homepage.css"

const SearchItem = () => {
    const { text } = useParams();
    const navigate = useNavigate();

    const [viewItems, setViewItems] = useState("on sale");
    const [onSaleItems, setOnSaleItems] = useState([]);
    const [inProgressItems, setInProgressItems] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const handleView = (statement) => {
        setViewItems(statement);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleSearchItems = async () => {
        if(search === ""){
            navigate('/');
        }
        else{
            navigate(`/items/search=${search}`);
        }
    }

    const handleViewItem = (itemId, status) => {
        navigate(`/item/${status}/${itemId}`);
    }

    useEffect(() => {
        if(!Cookies.get("username")){
            return navigate("/login");
        }
        const searchText = text.replace("search=","");
        const fetchOnSaleItems = async () => {
            try{
                const result = await axios.get("http://localhost:3001/items/search-on-sale", {params: {search: searchText}});
                setOnSaleItems(result.data);
            }
            catch(err){
                console.log(err);
            }
        };
        const fetchInProgressItems = async () => {
            try{
                const result = await axios.get("http://localhost:3001/items/search-in-progress", {params: {search: searchText, buyer: 1}})
                setInProgressItems(result.data)
            }
            catch(err) {
                console.log(err);
            }
        }
        fetchInProgressItems();
        fetchOnSaleItems();
    }, [text, navigate])

    const getBase64 = (buffer) => {
        return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    };

    const renderItems = (items) => {
        return items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
          <div className="item_container" key={item.item_id}>
            {item.item_image ? (
              <img
                className="image"
                src={`data:image/*;base64,${getBase64(item.item_image.data)}`}
                alt={item.item_name}
                onClick={() => handleViewItem(item.item_id, viewItems === 'on sale' ? 'on sale' : 'progress')}
              />
            ) : (
              <img
                className="image"
                src={noImage}
                alt={item.item_name}
                onClick={() => handleViewItem(item.item_id, viewItems === 'on sale' ? 'on sale' : 'progress')}
              />
            )}
            <ul className="item_info">
              <li className="info item_name" onClick={() => handleViewItem(item.item_id, viewItems === 'on sale' ? 'on sale' : 'progress')}>
                {item.item_name}
              </li>
              <li className="info item_price">{item.is_exchange ? 'Exchange' : <React.Fragment>${item.item_price}</React.Fragment>}</li>
            </ul>
          </div>
        ));
    };

    return (
        <div className='item_page_container'>
            <div className='item_status_container'>
                <ul className='item_status_tab'>
                    <li className={`item_status sale ${viewItems==="on sale"?'active':''}`} onClick={() => handleView("on sale")}>On Sale</li>
                    <li className={`item_status progress ${viewItems==="progress"?'active':''}`} onClick={() => handleView("progress")}>In Progress</li>
                </ul>
            </div>
            <hr/>
            <div className='search_container'>
                <div className='search'>
                    <TextField
                        name='search'
                        type='text'
                        variant='outlined'
                        value={search}
                        onChange={handleSearch}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter'){
                                handleSearchItems();
                            }
                        }}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleSearchItems()}
                                    >
                                        <Search/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}/>
                </div>
            </div>
            {/* {viewItems==="on sale" ? 
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
            </React.Fragment>} */}
                        <div className="items_container">
                <div className="items">{viewItems === 'on sale' ? renderItems(onSaleItems) : renderItems(inProgressItems)}</div>
            </div>
            <div className="pagination">
                <Button
                    disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}
                    variant='contained'>
                    Previous
                </Button>
                <span className='page_number'>Page {currentPage}</span>
                {
                    viewItems === 'on sale' ?
                    <Button 
                        disabled={currentPage * itemsPerPage >= onSaleItems.length} 
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        variant='contained'>
                        Next
                    </Button>:
                    <Button
                        disabled={currentPage * itemsPerPage >= inProgressItems.length}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        variant='contained'>
                        Next
                    </Button>
                }
            </div>
        </div>
    );
}

export default SearchItem;