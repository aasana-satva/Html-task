import StatusItem from "./StatusItem";

function Dashboard({servers}){
     return (
   <div className="dashboard">
    <h1>Status Dashboard</h1>

    <div className="status-container">
    {
      servers.map((server)=>(                                   //for each object create statusitem
        <StatusItem key={server.id} data={server} />            //key , data prop to the statusitem
      ))
    }
    </div>
   </div>
  );
}

export default Dashboard;