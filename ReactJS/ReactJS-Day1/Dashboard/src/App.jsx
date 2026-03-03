import Dashboard from './Components/Dashboard';
import './App.css'
function App() {

  const servers =[
    {id :1, name:"Database" ,status:"Online"},
    {id :2, name:"API Server" ,status:"Maintenance"},
    {id :3, name:"Auth Service" ,status:"Online"},
    {id :4, name:"Auth Service" ,status:"online"}
  ];
  return(
    <Dashboard servers ={servers} />              //sending array to dashboard  component using props
  );
}
export default App;
