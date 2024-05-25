import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import CreateUserButton from '../buttons/CreateUserButton';
import Table from '../pages/tables/DefaultTable';
import DynamicForm from '../pages/Form/DynamicForm';
import Skeleton from 'react-loading-skeleton';

function Utilisateur() {
  const storedToken = localStorage.getItem('token');
  const token = useSelector((state) => state.token) || storedToken;

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const [userData, setUserData] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiIsOnline, setApiIsOnline] = useState(true);
  const [columns, setColumns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Nouvel utilisateur');
  const [alertMessage, setAlertMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const socket = io('http://127.0.0.1:3000');
  const apiURL= 'http://127.0.0.1:8000';
  console.log(apiURL)

  useEffect(() => {
    // Check API endpoint health using Socket.io
    socket.on('api_status', ({ online }) => {
      setApiIsOnline(online);
    });

    // Listen for database updates
    socket.on('database_update', ({ newData }) => {
      setUserData(newData.results);
    });

    // Initial check when the component mounts
    socket.emit('check_api_status');

    const userUrl = "http://127.0.0.1:8000/userlist/"
    socket.emit('check_database_changes', { url: userUrl, token }); // Pass the URL and token to the socket

    // Periodic check every 30 seconds (adjust as needed)
    const checkInterval = setInterval(() => {
      socket.emit('check_api_status');
      socket.emit('check_database_changes', { url: userUrl, token }); // Pass the URL and token to the socket
    }, 30000);

    return () => {
      clearInterval(checkInterval);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    axiosInstance.get('/userlist/')
      .then((response) => {
        setUserData(response.data.results);
        if (response.data.results.length > 0) {
          console.log(response.data.results)
        
          const userObject = response.data.results[0];
          const columns = Object.keys(userObject)
            .filter(key => key !== 'groups' && key !== 'user_permissions' && key !== 'password' && key !== 'is_staff')
            .map(key => ({
              name: key,
              selector: row => {
                const value = row[key];
                if (typeof value === 'boolean') {
                  return value ? 'Yes' : 'No';
                }
                return value;
              },
              sortable: true,
              cell: (row) => {
                const value = row[key];
                if (typeof value === 'boolean') {
                  return value ? 'Yes' : 'No';
                }
                return value || <Skeleton count={1} />;
              }
            }));
          setColumns(columns);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const toggleFormVisibility = () => {
    setShowForm(prevShowForm => !prevShowForm);
    setButtonLabel(prevLabel => (prevLabel === 'Nouvel utilisateur' ? 'Liste des utilisateurs' : 'Nouvel utilisateur'));
  };

  // Function to handle successful form submission
  const handleFormSubmitSuccess = (message) => {
    // After successful form submission, show the table
    setShowForm(false);
    setButtonLabel('Nouvel utilisateur');
    if(message.success){     
    setAlertMessage(message.success);
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
    }else{
      setErrorMessage(message.error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    }
  };

  return (
    
    <div className="jumbotron jumbotron-fluid contentmain">
      
      {alertMessage && (
      <div className='alert-container'>
      <div className="alert alert-success" role="alert">{alertMessage}</div>
      </div>
      )}
      {errorMessage && (
      <div className='alert-container'>
      <div className="alert alert-danger" role="alert">{errorMessage}</div>
      </div>
      )}
      <div className='container contentinfo'>
      
        <h1>Utilisateurs</h1>
        
        
        <CreateUserButton onClick={toggleFormVisibility} label={buttonLabel}/>
        {showForm ? (
          <DynamicForm onFormSubmitSuccess={handleFormSubmitSuccess} />
        ) : (
          <Table
            isOnline={isOnline}
            apiIsOnline={apiIsOnline}
            columns={columns}
            data={userData}
          />
        )}
      </div>
    </div>
  );
}


export default Utilisateur;
