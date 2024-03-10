import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { app, auth } from './firebase-init.js';

window.onload = function() {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            document.getElementById("greeting").innerText = `Hello, ${user.displayName || 'User'}`;
            // ...
        } else {
            // User is signed out
            // ...
        }
    });
};