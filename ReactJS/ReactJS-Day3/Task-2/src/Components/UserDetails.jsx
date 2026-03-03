import {useParams} from "react-router-dom";

function UserDetails(){
    const {id} = useParams();

    return (
        <div>
            <h2>User Detail Page</h2><br />
            <p>User ID: {id}</p>
        </div>
    );
}

export default UserDetails;