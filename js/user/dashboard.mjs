import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const supabaseUrl = "https://alkvfgmwmqhopldavjxq.supabase.co";
const supabaseKey =   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa3ZmZ213bXFob3BsZGF2anhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjYwNzMsImV4cCI6MjA2NTMwMjA3M30.uObwWtuo2Wb-ytRja43SrElnDX-qk3urkQeC2jHToss'
;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Redirect if not logged in
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.href = "/auth/login.html";
}

// Elements
const form = document.getElementById("car-form");
const message = document.getElementById("form-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const roofbox = document.getElementById("roofboxes").value.trim();
  const make = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year = parseInt(document.getElementById("year").value, 10);
  const takfeste = document.getElementById("takfeste").value.trim();
  const takstativ = document.getElementById("takstativ").value.trim();
  const cc = document.getElementById("cc").value.trim();
  const cb = document.getElementById("cb").value.trim();
  const front = document.getElementById("front").value.trim();
  const bak = document.getElementById("bak").value.trim();


  const userId = session.user.id;

  const { error } = await supabase.from("cars").insert([
    {
      roofbox,
      make,
      model,
      year,
      takfeste,
      cc,
      cb,
      front,
      bak,
      takstativ,
      updated_by: userId,
    },
  ]);

  if (error) {
    message.textContent = "❌ Error: " + error.message;
    message.className = "text-red-500 mt-4";
  } else {
    message.textContent = "✅ Car measurement added successfully!";
    message.className = "text-green-600 mt-4";
    form.reset();
    
  }
});
