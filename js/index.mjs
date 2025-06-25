import { supabase } from "./user/utils/supabaseClient.mjs";
import { renderCarList } from "../js/renderCars.mjs";
import {
  setupEditButtons,
  setupDeleteButtons,
  setupEditFormHandlers,
} from "./user/utils/editHandler.mjs";
import { setupSearch } from "./search.mjs";

const makeSelect = document.getElementById("make-select");
const modelSelect = document.getElementById("model-select");
const carList = document.getElementById("car-list");
const searchInput = document.getElementById("search-input");

let allCars = [];

export async function loadOptions() {
  const { data, error } = await supabase.from("cars").select("make, model");

  if (error) {
    carList.innerHTML = `<p class="text-red-500">Feil ved lasting av bilmerker: ${error.message}</p>`;
    return;
  }

  allCars = data;

  const makes = [...new Set(data.map((car) => car.make))].sort((a, b) =>
    a.localeCompare(b, "no", { sensitivity: "base" })
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
  ].sort((a, b) => a.localeCompare(b, "no", { sensitivity: "base" }));

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
    .select("id, make, model, year, roofbox, takfeste, takstativ, cc, cb, front, bak")
    .eq("make", make)
    .eq("model", model);

  carList.innerHTML = "";

  if (error || !data.length) {
    carList.innerHTML = `<p class="text-red-500">Ingen maler funnet for ${make} ${model}</p>`;
    return;
  }

  const session = (await supabase.auth.getSession()).data.session;

  renderCarList(data, session, carList);
  setupEditButtons();
  setupDeleteButtons();
  setupEditFormHandlers();
});

setupSearch(searchInput, carList);
loadOptions();
