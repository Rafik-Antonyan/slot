import type { FC } from 'react';

export type TRoutePageType = {
    sitebarVisible?: boolean;
    isPrivate?: boolean;
    title: string;
    icon?: string;
    hasLayout?: boolean;
    path: string;
    element: FC;
};
