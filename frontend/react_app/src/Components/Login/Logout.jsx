import './Login.css'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/")
    }

    return(
    <div>
        <form className="login-form" onSubmit={handleLogout}>
            <h3>Log Out</h3>
            <label>Wish to log out?</label>
            <button type='submit'>Log out</button>
        </form>
        <a className="form-swap-button" href='/'>Don't wish to logout? Go to homepage!</a>
    </div>
    )
}

export default Logout;