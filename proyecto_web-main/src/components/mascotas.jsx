import React from 'react';
import useFetchPets from '../hooks/fetchDatapets';

const Mascotas = () => {
  const { data: pets, loading, error } = useFetchPets();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-bold my-4">Registro de Mascotas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map(pet => (
          <div key={pet.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">{pet.name}</h2>
            <p><strong>Tipo:</strong> {pet.type}</p>
            <p><strong>Cantidad en stock:</strong> {pet.stock}</p>
            <p><strong>Unidad:</strong> {pet.unit}</p>
            <p><strong>Proveedor:</strong> {pet.provider}</p>
            <p><strong>Activo:</strong> {pet.active ? 'Sí' : 'No'}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Ver Historial →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mascotas;
