import React, { useState } from 'react';
import registerUser from '../hooks/fetchRegister';

const Register = () => {
  const [userType, setUserType] = useState('usuario');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    address: '',
    birth_date: '',
    cellular_phone: '',
    role: 'client',
    status: 'active',
    license: '',
    vet_specialty: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserTypeChange = (e) => {
    const userType = e.target.value;
    setUserType(userType);
    setFormData({
      ...formData,
      role: userType === 'veterinario' ? 'veterinario' : 'client',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = await registerUser(formData);

    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 shadow-lg rounded-lg px-8 py-6">
          <h2 className="text-2xl font-bold text-center mb-6">Crea una nueva cuenta</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
              <select
                name="userType"
                value={userType}
                onChange={handleUserTypeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="usuario">Usuario</option>
                <option value="veterinario">Veterinario</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombres</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Ingrese sus nombres"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Ingrese sus apellidos"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Ingrese su email"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                name="cellular_phone"
                value={formData.cellular_phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Ingrese su teléfono"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            {userType === 'veterinario' && (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Licencia</label>
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Ingrese su licencia"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Especialidad Veterinaria</label>
                  <input
                    type="text"
                    name="vet_specialty"
                    value={formData.vet_specialty}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Ingrese su especialidad"
                    required
                  />
                </div>
              </>
            )}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
