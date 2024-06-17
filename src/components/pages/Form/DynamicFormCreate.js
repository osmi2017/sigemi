import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { apiUrl } from '../../../config';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../../scss/main.scss';
import { useTranslation } from 'react-i18next';

const DynamicFormCreate = ({ isOnline, apiIsOnline, onFormSubmitSuccess, content }) => {
    const { t, i18n } = useTranslation();
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [selectOptions, setSelectOptions] = useState({});
    const storedToken = localStorage.getItem('token');
    const token = useSelector((state) => state.token) || storedToken;

    useEffect(() => {
        if (isOnline && apiIsOnline) {
            axios.get(apiUrl + content.metadataUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (response.data && Array.isArray(response.data.fields)) {
                    setFields(response.data.fields);
                    const initialFormData = response.data.fields.reduce((acc, field) => {
                        acc[field.name] = field.type === 'select' ? '' : (field.value || '');
                        return acc;
                    }, {});
                    setFormData(initialFormData);

                    // Fetch options for select fields
                    response.data.fields.forEach(field => {
                        if (field.type === 'select') {
                            axios.get('http://localhost:8000/groups/', {
                                headers: {
                                    'Authorization': `Token ${token}`,
                                    'Content-Type': 'application/json',
                                }
                            })
                            .then(optionResponse => {
                                setSelectOptions(prevOptions => ({
                                    ...prevOptions,
                                    [field.name]: optionResponse.data.results
                                }));
                                console.log(optionResponse.data.results)
                                
                            })
                            .catch(error => {
                                console.error('Error fetching select options:', error);
                            });
                        }
                    });
                } else {
                    console.error('Invalid response data:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching metadata:', error);
            });
        }
    }, [token, isOnline, apiIsOnline, content.metadataUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(apiUrl + content.listUrl, formData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log('User created successfully:', response.data);
            const res = { 'success': 'Utilisateur créé avec succès!' };
            onFormSubmitSuccess(res);
        })
        .catch(error => {
            console.error('Error creating user:', error);
            const res = { 'error': "L'utilisateur n'a pas été créé" };
            onFormSubmitSuccess(res);
        });
    };

    if (!isOnline) {
        return <div className="offline-message">{t('connexion')}</div>;
    }

    if (!apiIsOnline) {
        return (
            <SkeletonTheme baseColor="" highlightColor="">
                <Skeleton count={10} height={40} width={650} />
            </SkeletonTheme>
        );
    }

    return (
        <form className="dynamic-form" onSubmit={handleSubmit}>
            {fields.length > 0 ? (
                fields.map(field => (
                    <div key={field.name}>
                        <label>
                            {t(field.label)}:
                            {field.type === 'image' ? (
                                <img src={field.value} alt={field.label} />
                            ) : field.type === 'select' ? (
                                <select 
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                >
                                    {selectOptions[field.name] && selectOptions[field.name].length > 0 ? (
                                        selectOptions[field.name].map(option => (
                                            <option key={option.pk} value={option.pk}>
                                                {option.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">{t('No options available')}</option>
                                    )}
                                </select>
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
                ))
            ) : (
                <SkeletonTheme baseColor="" highlightColor="">
                    <Skeleton count={5} height={40} />
                </SkeletonTheme>
            )}
            <button type="submit" className="button">{t('button.submit')}</button>
        </form>
    );
};

export default DynamicFormCreate;
