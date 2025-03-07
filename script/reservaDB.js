// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, setDoc, doc,collection } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUftZPcB5ByYTQXymHh2j2KP653XiAp7k",
    authDomain: "que-comer-original.firebaseapp.com",
    projectId: "que-comer-original",
    storageBucket: "que-comer-original.firebasestorage.app",
    messagingSenderId: "830996540548",
    appId: "1:830996540548:web:4293371333ca3ef83666d1",
    measurementId: "G-X3JRRTGGFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

document.getElementById('reservaForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const restaurante = document.getElementById('restaurante').value;
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const personas = document.getElementById('personas').value;

    const reservaID = Date.now().toString();

    const reservaData = {
        id: reservaID,
        restaurante,
        nombre,
        email,
        telefono,
        fecha,
        hora,
        personas,
        status: "pendiente",
        createdAt: new Date()
    };

    try {
        const docRef = doc(collection(db, "reservas"), reservaID);
        await setDoc(docRef, reservaData);
        showMessage('Reserva realizada con éxito', 'reservaMessage');
    } catch (error) {
        console.error("Error al guardar la reserva", error);
        showMessage('Error al realizar la reserva', 'reservaMessage');
    }
});
