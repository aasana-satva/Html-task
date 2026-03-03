import {NavLink} from "react-router-dom";

function Navbar(){
    return (
        <header className="navbar">
            <h2>My Website</h2> <br/>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/user/101">User</NavLink>
            </nav>
        </header>
    );
}

export default Navbar;