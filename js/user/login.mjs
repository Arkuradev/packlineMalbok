import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://alkvfgmwmqhopldavjxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa3ZmZ213bXFob3BsZGF2anhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjYwNzMsImV4cCI6MjA2NTMwMjA3M30.uObwWtuo2Wb-ytRja43SrElnDX-qk3urkQeC2jHToss';

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        errorMessage.textContent = error.message;
        console.log(error.message);
    } else {
        localStorage.setItem("supabaseSession", JSON.stringify(data.session));
        alert("You have successfully logged in!")
        window.location.href = "/user/dashboard.html";
    }
});


})



