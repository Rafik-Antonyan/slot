import { onCLS, onFID, onLCP, onFCP, onINP, type Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
    if (onPerfEntry && typeof onPerfEntry === 'function') {
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onINP(onPerfEntry);
    }
};

export default reportWebVitals;
