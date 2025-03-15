import React, { ReactNode } from 'react';

interface IRouteControllerProps {
    isPrivate?: boolean;
    children: ReactNode;
    path: string;
    hasLayout?: boolean;
}

export const RouteController: React.FC<IRouteControllerProps> = ({
    children,
    
    // isPrivate,
    // path,
    // hasLayout,
}) => {
    return <>{children}</>;

    // const location = window.location.pathname;
    // if (path === '*' && location !== '/') <>{children}</>;
    // if (isPrivate || location === '/') return <Navigate to={STATUS_ROUTE.notAuthorized} />;

    // if (!isPrivate) return <Navigate to={STATUS_ROUTE.authorized} />;

    // return hasLayout ? <DefaultLayout>{children}</DefaultLayout> : <>{children}</>;
};
