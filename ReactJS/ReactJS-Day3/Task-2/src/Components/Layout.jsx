import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "../Layout.css";

function Layout(){
    return(
        <div className="container">
            <Navbar />

            <div className="main">
                <Sidebar />
          
                <div className="content">
                    <Outlet />
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Layout;
