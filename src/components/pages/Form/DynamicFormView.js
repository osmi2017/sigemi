import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { apiUrl } from '../../../config';

const DynamicFormView = ({ isOnline, apiIsOnline, id, onFormSubmitSuccess, content, goBackToTable }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const [fields, setFields] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (isOnline && apiIsOnline) {
            const fetchData = async () => {
                try {
                    const headers = {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };

                    const metadataResponse = await axios.get(apiUrl + content.metadataUrl, { headers });
                    setFields(metadataResponse.data.fields);

                    const userResponse = await axios.get(apiUrl + content.detailUrl + id + '/', { headers });
                    setFormData(userResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [id, isOnline, apiIsOnline, token, content.metadataUrl, content.detailUrl]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(apiUrl + content.detailUrl + id + '/', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log('User updated successfully:', response.data);
            const res = { 'success': t("module.user.name") + ' ' + t("msg.updated") };
            onFormSubmitSuccess(res);
            goBackToTable();
        })
        .catch(error => {
            console.error('Error updating user:', error);
            const res = { 'error': t("module.user.name1") + ' ' + t("msg.not") + ' ' + t("msg.updated") };
            onFormSubmitSuccess(res);
        });
    };

    if (!isOnline) {
        return <div>{t('You are offline. Please check your internet connection.')}</div>;
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
                            {field.label}:
                            {field.type === 'checkbox' ? (
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    checked={formData[field.name] || false}
                                    onChange={handleChange}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
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
            <button type="submit" className="button">{t('button.update')}</button>
        </form>
    );
};

export default DynamicFormView;
