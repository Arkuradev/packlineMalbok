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

  const makes = [...new Set(data.map((car) => car.make))];

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
  ];

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
    carList.innerHTML = `<p class="text-red-500">Ingen maler funners for ${make} ${model}</p>`;
    return;
  }

  data.forEach((car) => {
    const item = document.createElement("div");
    // item.href = `measurements.html?id=${car.id}`;
    item.className = "relative bg-white p-4 border rounded shadow";

    const infoText = `
    Bilmerke: ${car.make}
    Modell: ${car.model}
    Takboks: ${car.roofbox || "N/A"}
    Takfeste: ${car.takfeste || "N/A"}
    CC: ${car.cc || "N/A"}
    CB: ${car.cb || "N/A"}
    Front: ${car.front || "N/A"}
    Bak: ${car.bak || "N/A"}
    Mal nummer: ${car.id}`.trim();

    item.innerHTML = `
    <a href="measurements.html?id=${car.id}" class="block mb-2 hover:underline">
    <p><strong>${car.make}</strong> ${car.model} (${car.year || ""}</p>
    <p class="text-sm text-gray-600">Takboks: ${car.roofbox || ""}</p>
    <p class="text-sm text-gray-600">Takfeste: ${car.takfeste || "N/A"}</p>
    <p class="text-sm text-gray-600">CC: ${car.cc || "N/A"}</p>
    <p class="text-sm text-gray-600">CB: ${car.cb || "N/A"}</p>
    <p class="text-sm text-gray-600">Front: ${car.front || "N/A"}</p>
    <p class="text-sm text-gray-600">Bak: ${car.bak || "N/A"}</p>
    <p class="text-sm text-gray-600">Mal nummer: ${car.id}</p></a>
    <button class="copy-btn absolute bg-gray-600 hover:bg-gray-700 rounded py-2 px-4 text-white top-2 right-2 text-sm" data-info="${infoText.replaceAll(
      '"',
      "&quot;"
    )}">Kopier</button>
  `;

    carList.appendChild(item);
  });

  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const info = button.getAttribute("data-info");

      try {
        await navigator.clipboard.writeText(info);
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
