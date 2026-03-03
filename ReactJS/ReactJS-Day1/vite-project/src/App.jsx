// import UserCard  from './components/UserCard';
import Navbar from './components/navbar';
import Footer from './components/footer';
import MainContent from './components/mainContent';
import Sidebar from './components/sidebar';
import './App.css'
function App() {
  return (
    <>
    <Navbar title="My React Site"/>

      <div className='appContainer'>
        <Sidebar />
        <MainContent />

        {/* use of component usercard
        <UserCard name="Aasana" role="Developer" isAvailable ={true} />
        <UserCard name="Meera" role="Designer" isAvailable ={false} />
        <UserCard name="Ayushi" role="Manager" isAvailable ={true} /> */}
        </div>
        <Footer />
    </>
  );
}

export default App
