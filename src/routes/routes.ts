import { lazy } from 'react';

import { type TRoutePageType } from './types';
import { ROUTE_PATHS } from './consts';

const Slot = lazy(() => import('pages/slot/Slot'));
const Error = lazy(() => import('pages/error/Error'));

const routesList: TRoutePageType[] = [
    {
        path: ROUTE_PATHS.SLOT,
        title: 'Slot',
        element: Slot,
        isPrivate: false,
    },
    {
        path: ROUTE_PATHS.ERROR,
        title: 'Error',
        element: Error,
        isPrivate: false,
    },
];

export default routesList;
