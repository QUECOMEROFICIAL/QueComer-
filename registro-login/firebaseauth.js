import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBUftZPcB5ByYTQXymHh2j2KP653XiAp7k",
    authDomain: "que-comer-original.firebaseapp.com",
    projectId: "que-comer-original",
    storageBucket: "que-comer-original.firebasestorage.app",
    messagingSenderId: "830996540548",
    appId: "1:830996540548:web:4293371333ca3ef83666d1",
    measurementId: "G-X3JRRTGGFF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función de registro de usuario
async function signUpUser(name, email, password) {
    try {
        // Validaciones básicas
        if (!name || name.trim() === '') {
            throw new Error('El nombre es obligatorio');
        }

        if (!email.includes('@')) {
            throw new Error('Introduce un email válido');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar información adicional en Firestore
        await setDoc(doc(db, "clients-users", user.uid), {
            name: name.trim(),
            email: email,
            createdAt: new Date(),
            role: 'user' // Puedes añadir roles si lo necesitas
        });

        // Mostrar mensaje de éxito
        alert('Registro exitoso. Ahora puedes iniciar sesión.');

        // Opcionalmente, redirigir al login
        window.location.href = 'index.html';

        return true;
    } catch (error) {
        // Manejar errores específicos de Firebase
        let errorMessage = 'Ocurrió un error al registrar';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este correo ya está registrado';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Correo electrónico inválido';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es muy débil';
                break;
            default:
                errorMessage = error.message;
        }

        alert(errorMessage);
        console.error('Error de registro:', error);
        return false;
    }
}

// Función de inicio de sesión
async function signInUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'paginauser.html';
    } catch (error) {
        let errorMessage = 'Error al iniciar sesión';
        
        switch(error.code) {
            case 'auth/wrong-password':
                errorMessage = 'Contraseña incorrecta';
                break;
            case 'auth/user-not-found':
                errorMessage = 'Usuario no encontrado';
                break;
            default:
                errorMessage = error.message;
        }

        alert(errorMessage);
        console.error('Error de inicio de sesión:', error);
    }
}

// Función de cierre de sesión
async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        alert('No se pudo cerrar sesión');
        console.error('Error de cierre de sesión:', error);
    }
}

// Configuración de eventos del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Formulario de inicio de sesión
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            signInUser(email, password);
        });
    }

    // Formulario de registro
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            signUpUser(name, email, password);
        });
    }

    // Botón de cierre de sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
});

// Exportar funciones globalmente
window.signUpUser = signUpUser;
window.signInUser = signInUser;
window.logoutUser = logoutUser;

// Listener de estado de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario autenticado
        console.log('Usuario autenticado:', user.email);
        
        // Si está en index.html, redirigir a paginauser.html
        if (window.location.pathname.includes('index.html')) {
            window.location.href = 'paginauser.html';
        }
    } else {
        // No hay usuario autenticado
        console.log('No hay usuario autenticado');
        
        // Si está en paginauser.html, redirigir a index.html
        if (window.location.pathname.includes('paginauser.html')) {
            window.location.href = 'index.html';
        }
    }
});