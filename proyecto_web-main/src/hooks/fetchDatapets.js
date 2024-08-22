import { useState, useEffect } from 'react';

const useFetchPets = () => {
  const [data, setData] = useState([]); // Iniciamos con un array vacío para múltiples mascotas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pets/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'getAll' }), // Acción que será manejada en el controlador
        });

        if (!response.ok) {
          throw new Error('Error fetching pets');
        }

        const result = await response.json();
        setData(result || []); // Aseguramos que data siempre sea un array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchPets;
