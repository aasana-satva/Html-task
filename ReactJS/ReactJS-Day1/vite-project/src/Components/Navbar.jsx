import "./Layout.css";

function Navbar({title}){
    return (
        <nav className="navbar">
            <h2>{title}</h2>
            <img src="" alt="profile" className="logo" ></img>
        </nav>
    );
}
export default Navbar;