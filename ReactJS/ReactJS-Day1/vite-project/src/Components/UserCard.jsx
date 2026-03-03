import "./UserCard.css";

function UserCard(props){
    return (
        <div className="card">
            <h2> Name: {props.name}</h2>
            <p>  Role: {props.role}</p>

            {props.isAvailable ? (
                <span className="available">
                    <i className ="bi bi-circle-fill"></i> Available
                </span>
            ):(
                <span className="notAvailable">
                    <i className ="bi bi-circle-fill"></i>  Not Available
                </span>
            )}
        </div>
    );
}

export default UserCard;