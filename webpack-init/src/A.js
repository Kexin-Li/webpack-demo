import React from 'react';

const C = React.lazy(() => import('./C'));

const A = () => {
  return (
    <div>
      Component A
      <C />
    </div>
  );
};

export default A;
