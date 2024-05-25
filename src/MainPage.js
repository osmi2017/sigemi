import React , { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header'; // Import the Header component
import MainSidebar from './Sidebar';
import Utilisateur from './components/mainpage/Utilisateur';
import MesMissions from './components/mainpage/MesMissions';
import Entites from './components/mainpage/Entites';
import Missionstraitement from './components/mainpage/Missionstraitement';
import Services from './components/mainpage/Services';



function MainPage() {
  const storedToken = localStorage.getItem('token');
  const token = useSelector((state) => state.token) || storedToken;
  const [mainview, setMainView] = useState('');

  const MainPageState = (newState) => {
    setMainView(newState);
  };
  //alert(mainview)
  //console.log("hhhh" + mainview);
  //<Skeleton count={3} />

  return (
    <div className='container-fluid main-container'>
      {/* Render the Header component */}
      <Header />
      <MainSidebar MainPageState={MainPageState } />
      
      {mainview === 'Utilisateurs' ? (
        <Utilisateur />
      ) : mainview === 'Mes Missions' ? (
        <MesMissions />
      )  : mainview === 'Missions traitement' ? (
          <Missionstraitement />
      ) : mainview === 'Entités' ? (
        <Entites />
      ) : mainview === 'Services' ? (
        <Services />
      ) :  (
        <div>
          <h1>Token Display</h1>
          <p>Your token: {token}</p>
        </div>
      )}
    </div>
  );
}

export default MainPage;
