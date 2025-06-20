import { projectId } from "./user/utils/constants.mjs";
import { setupCopyButtons } from "./user/utils/copyHandler.mjs";
import { setupEditButtons } from "./user/utils/editHandler.mjs";

export function renderCarList(data, session, container) {
  container.innerHTML = "";

  data.forEach((car) => {
    const item = document.createElement("div");
    item.className =
      "relative p-4 border bg-gray-200 rounded shadow hover:shadow-xl";

    const makeSlug = car.make.toLowerCase().replaceAll(" ", "-");
    const modelSlug = car.model.toLowerCase().replaceAll(" ", "-");
    const fileName = `${makeSlug}-${modelSlug}.jpg`;
    const imageUrl = `${projectId}/storage/v1/object/public/car-images/${fileName}`;

    const infoText = `
${car.make}
${car.model}
${car.roofbox || "N/A"}
${car.cc || "N/A"} / ${car.cb || "N/A"}
Front: ${car.front || "N/A"}
Bak: ${car.bak || "N/A"}
Mal nummer: ${car.id}`.trim();

    item.innerHTML = `
      <a href="measurements.html?id=${
        car.id
      }" class="block mb-2 hover:underline">
        <p><strong>${car.make}</strong> ${car.model} (${car.year || ""})</p>
        <p class="text-sm text-gray-700">Takboks: ${car.roofbox || ""}</p>
        <p class="text-sm text-gray-700">Takfeste: ${car.takfeste || "N/A"}</p>
        <p class="text-sm text-gray-700">CC: ${car.cc || "N/A"}</p>
        <p class="text-sm text-gray-700">CB: ${car.cb || "N/A"}</p>
        <p class="text-sm text-gray-700">Front: ${car.front || "N/A"}</p>
        <p class="text-sm text-gray-700">Bak: ${car.bak || "N/A"}</p>
        <p class="text-sm text-gray-700">Mal nummer: ${car.id}</p>
      </a>

      <div class="mt-2">
        <label class="text-sm flex items-center gap-2 py-2">
          <input type="checkbox" class="paint-toggle accent-green-600">
          Lakkeres?
        </label>
        <input type="text" placeholder="Farge + fargekode" class="paint-code hidden mt-1 p-2 border rounded text-sm" />
      </div>

      <img src="${imageUrl}" alt="Bilde av ${car.make} ${car.model}" 
        class="absolute bottom-2 right-2 w-40 h-auto object-contain opacity-80"
        onerror="this.style.display='none';"
      />

      <button class="copy-btn absolute bg-gray-600 hover:bg-gray-700 rounded py-2 px-4 text-white top-2 right-2 text-sm" 
        data-info="${infoText.replaceAll('"', "&quot;")}">Kopier</button>

      ${
        session
          ? `<div class="mt-4 flex gap-4">
            <button class="edit-btn text-yellow-600 hover:underline" data-id="${car.id}">Rediger</button>
            <button class="delete-btn text-red-600 hover:underline" data-id="${car.id}">Slett</button>
           </div>`
          : ""
      }
    `;

    container.appendChild(item);

    item.querySelector(".paint-toggle").addEventListener("change", (e) => {
      const input = item.querySelector(".paint-code");
      input.classList.toggle("hidden", !e.target.checked);
    });
  });

  setupEditButtons(); // Assuming this handles both edit & delete buttons
  setupCopyButtons();
}
