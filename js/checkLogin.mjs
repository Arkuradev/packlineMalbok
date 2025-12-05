import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const supabaseUrl = "https://alkvfgmwmqhopldavjxq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa3ZmZ213bXFob3BsZGF2anhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjYwNzMsImV4cCI6MjA2NTMwMjA3M30.uObwWtuo2Wb-ytRja43SrElnDX-qk3urkQeC2jHToss";
export const supabase = createClient(supabaseUrl, supabaseKey);

const {
  data: { session },
} = await supabase.auth.getSession();

const loginLink = document.querySelector("#login-link");
const dashboardLink = document.querySelector("#dashboard-link");

if (session) {
  loginLink.textContent = "Logg ut";
  loginLink.href = "#";
  dashboardLink.classList.remove("hidden");

  loginLink.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.reload();
  });
}
