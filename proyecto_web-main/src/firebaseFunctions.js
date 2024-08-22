import { db, auth } from './firebase'; // Importar configuraciones de Firebase
import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import { sendEmailReminder } from './utils/emailService'; // Si necesitas enviar correos, implementa esta función en tu frontend

// Crear un usuario
export async function createUser(email, password, role) {
  try {
    const saltRounds = 10;
    const passwordSaltHash = await bcrypt.hash(password, saltRounds);

    const userRecord = await auth.createUserWithEmailAndPassword(email, passwordSaltHash);

    await addDoc(collection(db, 'users'), {
      email,
      role,
      createdAt: Timestamp.now(),
    });

    console.log("Usuario creado exitosamente");
  } catch (error) {
    console.error("Error al crear el usuario:", error);
  }
}

// Obtener usuarios
export async function getUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map((doc) => doc.data());
    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}

// Crear un slot disponible
export async function createAvailableSlot(date, time, duration) {
  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = await addDoc(collection(db, 'availableSlots'), {
        vetId: user.uid,
        date,
        time,
        duration,
        isBooked: false,
        createdAt: Timestamp.now(),
      });
      console.log("Slot disponible creado exitosamente con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al crear el slot disponible:", error);
    }
  } else {
    console.error("Usuario no autenticado");
  }
}

// Obtener slots disponibles
export async function getAvailableSlots(vetId, date) {
  try {
    const q = query(
      collection(db, 'availableSlots'),
      where('vetId', '==', vetId),
      where('date', '==', Timestamp.fromDate(new Date(date))),
      where('isBooked', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const slots = querySnapshot.docs.map((doc) => doc.data());
    return slots;
  } catch (error) {
    console.error("Error al obtener los slots disponibles:", error);
  }
}

// Reservar una cita
export async function bookAppointment(slotId, petId) {
  const user = auth.currentUser;
  if (user) {
    try {
      const slotRef = doc(db, 'availableSlots', slotId);
      const slotDoc = await getDoc(slotRef);

      if (!slotDoc.exists() || slotDoc.data().isBooked) {
        console.error("Slot no disponible");
        return;
      }

      await updateDoc(slotRef, { isBooked: true });

      await addDoc(collection(db, 'appointments'), {
        slotId,
        clientId: user.uid,
        petId,
        createdAt: Timestamp.now(),
      });

      console.log("Cita reservada exitosamente");
    } catch (error) {
      console.error("Error al reservar la cita:", error);
    }
  } else {
    console.error("Usuario no autenticado");
  }
}

// Programar recordatorios de citas
export async function scheduleAppointmentReminders() {
  const now = Timestamp.now();
  const oneHourLater = new Date(now.toDate().getTime() + 60 * 60 * 1000);

  const appointmentsSnapshot = await getDocs(
    query(
      collection(db, 'appointments'),
      where("date", "<=", Timestamp.fromDate(oneHourLater)),
      where("reminderSent", "==", false)
    )
  );

  const emailPromises = [];

  appointmentsSnapshot.forEach((doc) => {
    const appointmentData = doc.data();
    const email = appointmentData.clientEmail;
    const date = appointmentData.date.toDate().toLocaleString();

    const mailOptions = {
      from: "your-email@example.com", // Cambia esto por la configuración adecuada
      to: email,
      subject: "Recordatorio de Cita Veterinaria",
      text: `Hola, este es un recordatorio para tu cita el día ${date} en nuestra clínica veterinaria.`,
    };

    emailPromises.push(
      sendEmailReminder(mailOptions).then(() => {
        console.log("Recordatorio de cita enviado a", email);
        return updateDoc(doc.ref, { reminderSent: true });
      }).catch((error) => {
        console.error("Error al enviar el correo:", error);
      })
    );
  });

  await Promise.all(emailPromises);
  console.log("Proceso de recordatorios completado");
}
