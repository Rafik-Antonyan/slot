declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.svg' {

    import * as React from 'react';
  
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  
    const src: string;
  
    export default src;
  
}

declare module '*.png' {

    const value: string;
  
    export default value;
  
}

declare module "*.mp4" {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const value: string;
  
    export default value;
  
}

declare module '*.mov' {
    const value: string;
  
    export default value;
  
}

declare module '*.webm' {
    const value: string;
  
    export default value;
  
}