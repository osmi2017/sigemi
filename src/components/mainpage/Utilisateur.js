import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CreateUserButton from '../buttons/CreateUserButton';
import Table from '../pages/tables/DefaultTable';
import DynamicFormCreate from '../pages/Form/DynamicFormCreate';
import DynamicFormView from '../pages/Form/DynamicFormView';
import Skeleton from 'react-loading-skeleton';
import { apiUrl } from './../../config';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/dateFormatter';
import useSocket from './socket/useSocket';

function Utilisateur({ content }) {
  const { t, i18n } = useTranslation();
  const storedToken = localStorage.getItem('token');
  const token = useSelector((state) => state.token) || storedToken;

  const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const { isOnline, apiIsOnline } = useSocket(token, content);

  const [columns, setColumns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [buttonLabel, setButtonLabel] = useState('Nouvel ' + content.name);
  const [alertMessage, setAlertMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (apiUrl) {
      axiosInstance
        .get(content.listUrl)
        .then((response) => {
          setUserData(response.data);
          if (response.data.length > 0) {
            console.log(JSON.stringify(response.data));
            
            const userObject = response.data[0];
            const columns = Object.keys(userObject)
              .filter((key) => key !== 'groups' && key !== 'user_permissions' && key !== 'password' && key !== 'is_staff')
              .map((key) => ({
                name: t(key),
                selector: (row) => {
                  const value = row[key];
                  if (key === 'photo') {
                    return value || 'http://127.0.0.1:8000/photos/user.png';
                  }
                  if (typeof value === 'boolean') {
                    return value ? t('Yes') : t('No');
                  }
                  if (key === 'date_joined') {
                    return formatDate(value, i18n.language);
                  }
                  return value;
                },
                sortable: true,
                grow: key === 'name' ? 2 : 1,
                cell: (row) => {
                  const value = row[key];
                  if (key === 'photo') {
                    const imgUrl = value || 'http://127.0.0.1:8000/photos/user.png';
                    return <img src={imgUrl} alt="User" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />;
                  }
                  if (typeof value === 'boolean') {
                    return value ? t('Yes') : t('No');
                  }
                  if (key === 'date_joined' || key === 'last_login') {
                    if (!value) {
                      return 'Aucunes activitées';
                    }
                    return formatDate(value, i18n.language);
                  }
                  return value || <Skeleton count={1} />;
                },
              }));

            columns.push({
              name: t('Action'),
              cell: (row) => (
                <div>
                  <button onClick={() => handleView(row.id)}>{t('Voir')}</button>
                  <button onClick={() => handleDelete(row.id)}>{t('Delete')}</button>
                </div>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              button: true,
              right: true,
              style: { position: 'sticky', right: 0, backgroundColor: '#fff', zIndex: 1 },
            });

            setColumns(columns);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          if (error.response.status === 401) {
            setErrorMessage('Unauthorized access. Please check your credentials.');
          }
        });
    }
  }, [apiUrl, t, i18n.language]);

  useEffect(() => {
    if (showForm || viewId) {
      setButtonLabel(t('Liste des ' + content.name + 's'));
    } else {
      setButtonLabel(t('Nouvel ' + content.name));
    }
  }, [showForm, viewId, content.name, t]);

  const toggleFormVisibility = () => {
    if (viewId) {
      setViewId(null);
    } else {
      setShowForm((prevShowForm) => !prevShowForm);
    }
  };

  const handleFormSubmitSuccess = (message) => {
    setShowForm(false);
    setViewId(null);
    setButtonLabel(t('Nouvel ' + content.name));
    if (message.success) {
      setAlertMessage(message.success);
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      // Refresh user data after successful form submission
      fetchUserData();
    } else {
      setErrorMessage(message.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleView = (id) => {
    setViewId(id);
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/userdetail/${id}/`)
      .then((response) => {
        setAlertMessage('User deleted successfully.');
        setTimeout(() => {
          setAlertMessage(null);
        }, 5000);
        setUserData((prevData) => prevData.filter((user) => user.id !== id));
      })
      .catch((error) => {
        setErrorMessage('Error deleting user.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const fetchUserData = () => {
    axiosInstance
      .get(content.listUrl)
      .then((response) => {
        setUserData(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post('/userlist/', formData)
      .then((response) => {
        handleFormSubmitSuccess({ success: 'User created successfully.' });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        handleFormSubmitSuccess({ error: 'Error creating user.' });
        if (error.response && error.response.status === 401) {
          setErrorMessage('Unauthorized access. Please check your credentials.');
        }
      });
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
        <h1>{t('Utilisateurs')}</h1>
        <CreateUserButton onClick={toggleFormVisibility} label={buttonLabel} />
        {showForm ? (
         < DynamicFormCreate
         isOnline={isOnline}
         apiIsOnline={apiIsOnline}
         content={content}
         onFormSubmitSuccess={handleFormSubmitSuccess}
         
         />
        ) : viewId ? (
          <DynamicFormView
            isOnline={isOnline}
            apiIsOnline={apiIsOnline}
            id={viewId}
            content={content}
            onFormSubmitSuccess={handleFormSubmitSuccess}
            goBackToTable={() => setViewId(null)}
          />
        ) : (
          <Table
            isOnline={isOnline}
            apiIsOnline={apiIsOnline}
            columns={columns}
            data={userData}
            fixedHeader
            fixedHeaderScrollHeight="300px"
            persistTableHead
          />
        )}
      </div>
    </div>
  );
}

export default Utilisateur;
