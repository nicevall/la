import { useState, useEffect } from 'react';

const useFetchUsers = (action = 'getAll', id = null, role = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action,
            id,  // Se usará solo para acciones específicas como 'getOne' o 'update'
            role, // Se usará solo si necesitas filtrar por rol con 'getByRole'
          }),
        });

        if (!response.ok) {
          throw new Error('Error fetching users');
        }

        const result = await response.json();
        setData(result || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [action, id, role]);

  return { data, loading, error };
};

export default useFetchUsers;
