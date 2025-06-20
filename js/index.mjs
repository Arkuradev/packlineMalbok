import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { publicKey, projectId } from "./user/utils/constants.mjs";

const supabase = createClient(projectId, publicKey);

const makeSelect = document.getElementById("make-select");
const modelSelect = document.getElementById("model-select");
const carList = document.getElementById("car-list");

let allCars = [];

async function loadOptions() {
  const { data, error } = await supabase.from("cars").select("make, model");

  if (error) {
    carList.innerHTML = `<p class="text-red-500">Feil ved lasting av bilmerker: ${error.message}</p>`;
    return;
  }

  allCars = data;

  const makes = [...new Set(data.map((car) => car.make))].sort((a, b) =>
  a.localeCompare(b, 'no', { sensitivity: 'base' })
);

  makes.forEach((make) => {
    const option = document.createElement("option");
    option.value = make;
    option.textContent = make;
    makeSelect.appendChild(option);
  });
}

makeSelect.addEventListener("change", () => {
  const selectedMake = makeSelect.value;
  modelSelect.innerHTML = '<option value="">Velg bilmodell</option>';

  const models = [
  ...new Set(
    allCars.filter((c) => c.make === selectedMake).map((car) => car.model)
  ),
].sort((a, b) => a.localeCompare(b, 'no', { sensitivity: 'base' }));

  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });

  carList.innerHTML = "";
});

modelSelect.addEventListener("change", async () => {
  const make = makeSelect.value;
  const model = modelSelect.value;

  const { data, error } = await supabase
    .from("cars")
    .select("id, make, model, year, roofbox, takfeste, cc, cb, front, bak")
    .eq("make", make)
    .eq("model", model);

  carList.innerHTML = "";

  if (error || !data.length) {
    carList.innerHTML = `<p class="text-red-500">Ingen maler funnet for ${make} ${model}</p>`;
    return;
  }

  
  const session = (await supabase.auth.getSession()).data.session;

  data.forEach((car) => {
    const item = document.createElement("div");
    item.className = "relative bg-white p-4 border rounded shadow";

    const infoText = `
${car.make}
${car.model}
${car.roofbox || "N/A"}
${car.cc || "N/A"} / ${car.cb || "N/A"}
Front: ${car.front || "N/A"}
Bak: ${car.bak || "N/A"}
Mal nummer: ${car.id}`.trim();


// Fiks denne, burde ikke bruke innerHTML på data henting.

    item.innerHTML = `
    <a href="measurements.html?id=${car.id}" class="block mb-2 hover:underline">
      <p><strong>${car.make}</strong> ${car.model} (${car.year || ""})</p>
      <p class="text-sm text-gray-600">Takboks: ${car.roofbox || ""}</p>
      <p class="text-sm text-gray-600">Takfeste: ${car.takfeste || "N/A"}</p>
      <p class="text-sm text-gray-600">CC: ${car.cc || "N/A"}</p>
      <p class="text-sm text-gray-600">CB: ${car.cb || "N/A"}</p>
      <p class="text-sm text-gray-600">Front: ${car.front || "N/A"}</p>
      <p class="text-sm text-gray-600">Bak: ${car.bak || "N/A"}</p>
      <p class="text-sm text-gray-600">Mal nummer: ${car.id}</p>
    </a>

    <div class="mt-2">
    <label class="text-sm flex items-center gap-2 py-2">
    <input type="checkbox" class="paint-toggle ">
    Lakkeres?
    </label>
    <input type="text" placeholder="Farge + fargekode" 
    class="paint-code hidden mt-1 p-2 border rounded w-full text-sm" />
    </div>

    <button class="copy-btn absolute bg-gray-600 hover:bg-gray-700 rounded py-2 px-4 text-white top-2 right-2 text-sm" data-info="${infoText.replaceAll(
      '"',
      "&quot;"
    )}">Kopier</button>
 
    ${
      session
        ? `<div class="mt-4 flex gap-4">
             <button class="edit-btn text-yellow-600 hover:underline" data-id="${car.id}">Rediger</button>
             <button class="delete-btn text-red-600 hover:underline" data-id="${car.id}">Slett</button>
           </div>`
        : ""
    }
  `;
  setupEditButtons();

    carList.appendChild(item);

    item.querySelector(".paint-toggle").addEventListener("change", (e) => {
    const input = item.querySelector(".paint-code");
    input.classList.toggle("hidden", !e.target.checked);
  })

  });


  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm(
        "Er du sikker på at du vil slette denne malen?"
      );
      if (!confirmDelete) return;

      const { error } = await supabase.from("cars").delete().eq("id", id);

      if (error) {
        alert(`Feil ved sletting av mal: ${error.message}`);
        return;
      } else {
        alert("Mal slettet!");
        btn.closest("div").remove();
        window.location.reload();
      }
    });
  });

 function setupEditButtons() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const { data, error } = await supabase.from("cars").select("*").eq("id", id).single();

      if (error) {
        alert("Klarte ikke å hente data for redigering");
        return;
      }

      document.getElementById("edit-id").value = data.id;
      document.getElementById("edit-cc").value = data.cc || "";
      document.getElementById("edit-cb").value = data.cb || "";
      document.getElementById("edit-front").value = data.front || "";
      document.getElementById("edit-bak").value = data.bak || "";

      document.getElementById("edit-modal").classList.remove("hidden");
    });
  });
}

document.getElementById("cancel-edit").addEventListener("click", () => {
  document.getElementById("edit-modal").classList.add("hidden");
});

document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const updates = {
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
  setTimeout(() => {
        window.location.reload(); // optional: re-render only updated card
      }, 500);
});

  document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const card = button.closest("div");

    const make = card.querySelector("strong")?.textContent?.trim() || "N/A";
    const details = card.querySelectorAll("p");

    const model = details[0]?.textContent?.replace(`${make} `, "") || "N/A";
    const roofbox = details[1]?.textContent?.split(":")[1]?.trim() || "N/A";
    const cc = details[3]?.textContent?.split(":")[1]?.trim() || "N/A";
    const cb = details[4]?.textContent?.split(":")[1]?.trim() || "N/A";
    const front = details[5]?.textContent?.split(":")[1]?.trim() || "N/A";
    const bak = details[6]?.textContent?.split(":")[1]?.trim() || "N/A";
    const id = details[7]?.textContent?.split(":")[1]?.trim() || "N/A";

    const paintInput = card.querySelector(".paint-code");
    const paintCode =
      paintInput && !paintInput.classList.contains("hidden")
        ? paintInput.value.trim()
        : null;

    let infoText = `
${make}
${model}
${roofbox}
${cc} / ${cb}
Front: ${front}
Bak: ${bak}
Mal nummer: ${id}
`.trim();

    if (paintCode) {
      infoText += `\nFargekode: ${paintCode}`;
    }

    try {
      await navigator.clipboard.writeText(infoText);
      button.textContent = "Kopiert! ✅";
      setTimeout(() => {
        button.textContent = "Kopier";
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      button.textContent = "Feil ved kopiering!";
      setTimeout(() => {
        button.textContent = "Kopier";
      }, 2000);
    }
  });
});
});

loadOptions();
