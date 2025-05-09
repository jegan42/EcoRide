import { useEffect, useState } from 'react';
import axiosInstance from '../services/axios';

const HomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance.get('/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Data from API</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default HomePage;
