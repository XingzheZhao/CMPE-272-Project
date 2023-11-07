import { Link } from "react-router-dom";

import "./Navbar.css"

const Navbar = () => {
    return(
        <header>
            <div className="nav_container">
                <nav className="nav">
                    <div className="nav_title">
                        <Link className='title_link' to='/'>Spartan Market</Link>
                    </div>
                    <div className="nav_items">
                        <ul className="nav_list">
                            <li className="list_item"><Link className='item_link' to='/items'>Items</Link></li>
                            <li className="list_item"><Link className='item_link' to='/services'>services</Link></li>
                            <li className="list_item"><Link className='item_link' to='/login'>login</Link></li>
                        </ul>
                    </div>
                </nav>

            </div>
        </header>
    );
};

export default Navbar;