import { supabase } from "./supabaseClient.mjs";


export function setupEditButtons() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Klarte ikke å hente data for redigering");
        return;
      }

      document.getElementById("edit-id").value = data.id;
      document.getElementById("edit-roofboxes").value = data.roofbox;
      document.getElementById("edit-cc").value = data.cc || "";
      document.getElementById("edit-cb").value = data.cb || "";
      document.getElementById("edit-front").value = data.front || "";
      document.getElementById("edit-bak").value = data.bak || "";

      document.getElementById("edit-modal").classList.remove("hidden");
    });
  });
}

export function setupDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm("Er du sikker på at du vil slette denne malen?");
      if (!confirmDelete) return;

      const { error } = await supabase.from("cars").delete().eq("id", id);

      if (error) {
        alert(`Feil ved sletting av mal: ${error.message}`);
        return;
      }

      alert("Mal slettet!");
      btn.closest("div").remove();
      window.location.reload();
    });
  });
}

export function setupEditFormHandlers() {
  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-modal").classList.add("hidden");
  });

  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const updates = {
      roofbox: document.getElementById("edit-roofboxes").value,
      takstativ: document.getElementById("edit-takstativ").value,
      cc: document.getElementById("edit-cc").value,
      cb: document.getElementById("edit-cb").value,
      front: document.getElementById("edit-front").value,
      bak: document.getElementById("edit-bak").value,
    };

    const { error } = await supabase.from("cars").update(updates).eq("id", id);

    if (error) {
      alert("Kunne ikke oppdatere målinger.");
      return;
    }

    document.getElementById("edit-modal").classList.add("hidden");
    alert("Mal oppdatert!");
    /* setTimeout(() => {
      window.location.reload();
    }, 500); */
  });
}