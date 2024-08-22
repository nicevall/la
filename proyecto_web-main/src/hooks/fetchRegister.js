// fetchRegister.js
const registerUser = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          data: formData,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
  
      const result = await response.json();
      return { success: true, message: 'User registered successfully!', data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  export default registerUser;
  