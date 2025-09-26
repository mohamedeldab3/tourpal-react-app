import React, { Suspense } from 'react';

type LoadableProps = {
  [key: string]: any;
};

const Loadable = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
  return (props: LoadableProps): JSX.Element => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      }>
        <Component {...props} />
      </Suspense>
    );
  };
};

export default Loadable;