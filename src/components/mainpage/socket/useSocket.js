import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { apiUrl, socketURL } from './../../../config';

const useSocket = (token, content) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiIsOnline, setApiIsOnline] = useState(true);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const socket = io(socketURL);

    socket.on('api_status', ({ online }) => {
      setApiIsOnline(online);
    });

    socket.on('database_update', ({ newData }) => {
      setUserData(newData.results);
    });

    socket.emit('check_api_status');

    const userUrl = apiUrl + content.listUrl;
    socket.emit('check_database_changes', { url: userUrl, token });

    const checkInterval = setInterval(() => {
      socket.emit('check_api_status');
      socket.emit('check_database_changes', { url: userUrl, token });
    }, 30000);

    return () => {
      clearInterval(checkInterval);
      socket.disconnect();
    };
  }, [token, content.listUrl]);

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

  return { isOnline, apiIsOnline, userData };
};

export default useSocket;
