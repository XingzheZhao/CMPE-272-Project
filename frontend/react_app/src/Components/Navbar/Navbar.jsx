import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";

import "./Navbar.css"

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = (e)=> {
        e.preventDefault()
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/login')
     }

    return(
        <header>
            <div className="nav_container">
                <nav className="nav">
                    <div className="nav_title">
                        <Link className='title_link' to='/'>Spartan Market</Link>
                    </div>
                    <div className="nav_items">
                        <ul className="nav_list">
                            {
                                Cookies.get("username") ?
                                <React.Fragment>
                                    <li className="list_item"><Link className='item_link' to='/items'>Items</Link></li>
                                    <li className="list_item"><Link className="item_link" to='/sell-item'>Sell Item</Link></li>
                                    <li className="list_item"><Link className='item_link' to='/profile'>Profile</Link></li>
                                    <li className='list_item'><Link className='item_link' onClick={handleLogout}>logout</Link></li>
                                    {/* <li className="list_item"><Link className='item_link' to='/services'>services</Link></li> */}
                                    {Cookies.get("role") === 'admin' ? <li className="list_item"><Link className='item_link' to='/admin'>Admin</Link></li>:<></>}
                                </React.Fragment> :
                                <li className="list_item"><Link className='item_link' to='/login'>login</Link></li>
                            }
                        </ul>
                    </div>
                </nav>

            </div>
        </header>
    );
};

export default Navbar;