import React, { ReactNode, useEffect } from 'react';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
    children: ReactNode;
}
const baseUrl = process.env.REACT_APP_BASE_URL;

const axiosApi = axios.create({
    withCredentials: true,
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
    },
    timeout: 5000,
});

function getLocalAccessToken() {
    const accessToken = localStorage.getItem('accessToken');

    return accessToken;
}

axiosApi.interceptors.request.use(
    async (config) => {
        const token = getLocalAccessToken();
        if (token) {
            config.headers['authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export const AxiosInterceptor: React.FC<Props> = ({ children }: Props) => {
    const navigate = useNavigate();
    useEffect(() => {
        const resInterceptor = (response: AxiosResponse) => {
            return response;
        };
        const errInterceptor = (error: AxiosError) => {
            if (
                error.response &&
                (error.response.status === 403 || error.response.status === 401)
            ) {
                localStorage.removeItem('accessToken');
                navigate('/');
            }

            return Promise.reject(error);
        };
        const interceptor = axiosApi.interceptors.response.use(resInterceptor, errInterceptor);

        return () => axiosApi.interceptors.response.eject(interceptor);
    }, []);

    return <>{children}</>;
};

export default axiosApi;
