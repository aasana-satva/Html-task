import "./Layout.css";
import UserCard from "./UserCard";                  //use of usercard component in this component

function MainContent(){
    return (
        <main className="main-content">
            <UserCard name="Aasana" role="Developer" isAvailable={true} />
            <UserCard name="Meera" role="Design" isAvailable={false} />
            <UserCard name="Ayushi" role="Manager" isAvailable={true} />
        </main>
    );
}

export default MainContent;