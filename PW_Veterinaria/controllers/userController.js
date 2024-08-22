import firebase from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';



const db = getFirestore(firebase);

export const userController = async (req, res, next) => {
  try {
    const { action } = req.body;

    switch (action) {
      case 'create':
        await createUser(req, res);
        break;
      case 'getAll':
        await getUsers(req, res);
        break;
      case 'getOne':
        await getUser(req, res);
        break;
      case 'update':
        await updateUser(req, res);
        break;
      case 'delete':
        await deleteUser(req, res);
        break;
      case 'getByRole':
        await getUsersByRole(req, res);
        break;
      default:
        res.status(400).send('Invalid action');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Asume que estás utilizando 10 rondas de salt, ajusta según tu preferencia
const createUser = async (req, res) => {
  let { id, password, ...userData } = req.body.data;
  
  try {
    // Genera un ID automáticamente si no se proporciona uno
    if (!id) {
      id = uuidv4(); // Genera un UUID
    }

    // Asegúrate de que la contraseña esté definida
    if (!password) {
      throw new Error('Password is required');
    }

    const saltRounds = 5;
    const password_salt_hash = await bcrypt.hash(password, saltRounds);

    // Crear el objeto del usuario con la contraseña hasheada
    const userToStore = {
      ...userData,
      password_salt_hash,
      signup_date: userData.signup_date ? new Date(userData.signup_date) : serverTimestamp(),
      last_access_date: userData.last_access_date ? new Date(userData.last_access_date) : serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    // Guardar el usuario en Firestore
    await setDoc(doc(db, 'user', id), userToStore);

    res.status(200).send({ message: 'User created successfully', id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send(`Error creating user: ${error.message}`);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getDocs(collection(db, 'user'));
    const userArray = [];
    users.forEach((doc) => {
      const user = new User(
        doc.id,
        doc.data().address,
        doc.data().birth_date,
        doc.data().cellular_phone,
        doc.data().email,
        doc.data().last_access_date,
        doc.data().name,
        doc.data().password_salt_hash,
        doc.data().role,
        doc.data().signup_date,
        doc.data().status,
        doc.data().surname,
        doc.data().license,
        doc.data().vet_specialty,
        doc.data().schedule,
        doc.data().pets
      );
      userArray.push(user);
    });
    res.status(200).send(userArray);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUser = async (req, res) => {
  const id = req.body.id;
  const user = doc(db, 'user', id);
  const data = await getDoc(user);
  if (data.exists()) {
    res.status(200).send(data.data());
  } else {
    res.status(404).send('User not found');
  }
};

const updateUser = async (req, res) => {
  const id = req.body.id;
  const data = req.body.data;
  const user = doc(db, 'user', id);
  await updateDoc(user, data);
  res.status(200).send('User updated successfully');
};

const deleteUser = async (req, res) => {
  const id = req.body.id;
  await deleteDoc(doc(db, 'user', id));
  res.status(200).send('User deleted successfully');
};

const getUsersByRole = async (req, res) => {
  const role = req.body.role;
  try {
    const usersRef = collection(db, 'user');
    const q = query(usersRef, where("role", "==", role));
    const querySnapshot = await getDocs(q);
    const userArray = [];
    querySnapshot.forEach((doc) => {
      const user = new User(
        doc.id,
        doc.data().address,
        doc.data().birth_date,
        doc.data().cellular_phone,
        doc.data().email,
        doc.data().last_access_date,
        doc.data().name,
        doc.data().password_salt_hash,
        doc.data().role,
        doc.data().signup_date,
        doc.data().status,
        doc.data().surname,
        doc.data().license,
        doc.data().vet_specialty,
        doc.data().schedule,
        doc.data().pets
      );
      userArray.push(user);
    });
    res.status(200).send(userArray);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
