import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface IPath {
  path: string
}

const LoadingToRedirect = ({ path }: IPath) => {
  const [count, setCount] = useState(3);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);

    count === 0 && history.push(path);

    return () => clearInterval(interval);
  }, [count, history, path]);

  return (
    <div className="container p-5 text-center">
      <p>Redirecionando em {count} segundos...</p>
    </div>
  );
};

export default LoadingToRedirect;
