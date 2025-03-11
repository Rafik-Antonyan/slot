import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { RoutesWrapper } from 'routes';

import { AxiosInterceptor } from 'config/axiosApi';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AxiosInterceptor>
                <RoutesWrapper />
            </AxiosInterceptor>
        </BrowserRouter>
    );
};

export default App;
