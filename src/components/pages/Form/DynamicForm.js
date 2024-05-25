import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import '../../../scss/main.scss';

const DynamicForm = (props) => { // Receive onSuccess function from parent component
    const [fields, setFields] = useState([]); // Initialize fields state with an empty array
    const [formData, setFormData] = useState({}); // State to hold form data
    const storedToken = localStorage.getItem('token');
    const token = useSelector((state) => state.token) || storedToken;

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/user-metadata/', {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            // Check if response data is valid before updating state
            if (response.data && Array.isArray(response.data.fields)) {
                setFields(response.data.fields);
                // Initialize formData state with the field names
                const initialFormData = response.data.fields.reduce((acc, field) => {
                    acc[field.name] = field.value || '';
                    return acc;
                }, {});
                setFormData(initialFormData);
            } else {
                console.error('Invalid response data:', response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching metadata:', error);
        });
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(process.env.BASE_API_URL+'/userlist/', formData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log('User created successfully:', response.data);
            
            console.log('User created successfully:', response.data);
            const res ={'success':'Utilisateur créé avec success!'}
            props.onFormSubmitSuccess(res); // Pass the success message
    // Optionally reset form fields or provide feedback to the user
           
        })
        .catch(error => {
            console.error('Error creating user:', error);
            const res ={'error':"l'Utilisateur n'a pas été crée"}
    props.onFormSubmitSuccess(res); // Pass the error message
        });
    };

    return (
        <form className="dynamic-form" onSubmit={handleSubmit}>
            {fields.map(field => (
                <div key={field.name}>
                    <label>
                        {field.label}:
                        {field.type === 'image' ? (
                            <img src={field.value} alt={field.label} />
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            />
                        )}
                    </label>
                </div>
            ))}
            <button type="submit" className="button">Valider</button>
        </form>
    );
};

export default DynamicForm;
