import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header'; // Import the Header component
import MainSidebar from './Sidebar';
import Utilisateur from './components/mainpage/Utilisateur';
import MesMissions from './components/mainpage/MesMissions';
import Entites from './components/mainpage/Entites';
import Missionstraitement from './components/mainpage/Missionstraitement';
import Services from './components/mainpage/Services';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './scss/main.scss'
import config from './components/chatbot/config';
import MessageParser from './components/chatbot/MessageParser';
import ActionProvider from './components/chatbot/ActionProvider';

function MainPage() {
  const storedToken = localStorage.getItem('token');
  const token = useSelector((state) => state.token) || storedToken;
  const [mainview, setMainView] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);

  const MainPageState = (newState) => {
    setMainView(newState);
  };

  const [user, setUser] = useState({
    name: 'Utilisateur',
    listUrl: '/userlist/',
    metadataUrl: '/user-metadata/',
    detailUrl: '/api/users/',
  });

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className='container-fluid main-container'>
      {/* Render the Header component */}
      <div className='header-container'>
        <Header />
      </div>
      <div className='sidebar-container'>
        <MainSidebar MainPageState={MainPageState} />
        <div className='content-container'>
          <button onClick={toggleChatbot} className="chatbot-toggle-button">
            {showChatbot ? 'Hide Chatbot' : 'Show Chatbot'}
          </button>
          {showChatbot && (
            <div className="chatbot-container">
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          )}
          {mainview === 'Utilisateurs' ? (
            <Utilisateur content={user} />
          ) : mainview === 'Mes Missions' ? (
            <MesMissions />
          ) : mainview === 'Missions traitement' ? (
            <Missionstraitement />
          ) : mainview === 'Entités' ? (
            <Entites />
          ) : mainview === 'Services' ? (
            <Services />
          ) : (
            <div>
              <h1>Token Display</h1>
              <p>Your token: {token}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
