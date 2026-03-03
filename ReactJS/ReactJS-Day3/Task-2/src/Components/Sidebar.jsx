import {Link} from  "react-router-dom";

function Sidebar(){
    return (
        <aside className="sidebar">
            <h3> Users</h3> <br />
            <ul>
                <li><Link to="/user/1">User 1</Link></li>
                <li><Link to="/user/2">User 2</Link></li>
                <li><Link to="/user/3">User 3</Link></li>
            </ul>
        </aside>
    );
}

export default Sidebar;