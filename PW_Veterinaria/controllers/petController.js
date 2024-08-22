import firebase from '../firebase.js';
import Pet from '../models/petModel.js';
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

export const petController = async (req, res, next) => {
  try {
    const { action } = req.body;

    switch (action) {
      case 'create':
        await createPet(req, res);
        break;
      case 'getAll':
        await getPets(req, res);
        break;
      case 'getOne':
        await getPet(req, res);
        break;
      case 'update':
        await updatePet(req, res);
        break;
      case 'delete':
        await deletePet(req, res);
        break;
      case 'getByOwner':
        await getPetsByOwner(req, res);
        break;
      default:
        res.status(400).send('Invalid action');
    }
  } catch (error) {
    res.status(500).send(`Error processing request: ${error.message}`);
  }
};

const createPet = async (req, res) => {
  const { id, ...petData } = req.body.data;
  try {
    // Añadimos un timestamp de creación si es necesario
    const petWithTimestamp = {
      ...petData,
      createdAt: serverTimestamp()
    };

    // Usamos setDoc para especificar manualmente el ID del documento
    await setDoc(doc(db, 'pet', id), petWithTimestamp);

    res.status(200).send({ message: 'Pet created successfully', id });
  } catch (error) {
    res.status(400).send(`Error creating pet: ${error.message}`);
  }
};

const getPets = async (req, res) => {
  try {
    const petsSnapshot = await getDocs(collection(db, 'pet'));
    const petsArray = petsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).send(petsArray);
  } catch (error) {
    res.status(400).send(`Error fetching pets: ${error.message}`);
  }
};

const getPet = async (req, res) => {
  const { id } = req.body;
  try {
    const petDoc = await getDoc(doc(db, 'pet', id));
    if (!petDoc.exists()) {
      res.status(404).send('Pet not found');
    } else {
      res.status(200).send({ id: petDoc.id, ...petDoc.data() });
    }
  } catch (error) {
    res.status(400).send(`Error fetching pet: ${error.message}`);
  }
};

const updatePet = async (req, res) => {
  const { id, data } = req.body;
  try {
    await updateDoc(doc(db, 'pet', id), data);
    res.status(200).send({ message: 'Pet updated successfully', id });
  } catch (error) {
    res.status(400).send(`Error updating pet: ${error.message}`);
  }
};

const deletePet = async (req, res) => {
  const { id } = req.body;
  try {
    await deleteDoc(doc(db, 'pet', id));
    res.status(200).send({ message: 'Pet deleted successfully', id });
  } catch (error) {
    res.status(400).send(`Error deleting pet: ${error.message}`);
  }
};

const getPetsByOwner = async (req, res) => {
  const { ownerId } = req.body;
  try {
    const petsRef = collection(db, 'pet');
    const q = query(petsRef, where("id_owner", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const petArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).send(petArray);
  } catch (error) {
    res.status(400).send(`Error fetching pets: ${error.message}`);
  }
};