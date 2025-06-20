// searchCars.mjs
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { publicKey, projectId } from "./user/utils/constants.mjs";
import { renderCarList } from "./renderCars.mjs"; // optional shared renderer

const supabase = createClient(projectId, publicKey);

export function setupSearch(inputElement, carListElement) {
  let searchTimeout;

  inputElement.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      const query = inputElement.value.trim().toLowerCase();

      if (!query) {
        carListElement.innerHTML = "";
        return;
      }

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .or(
          `make.ilike.%${query}%,model.ilike.%${query}%,roofbox.ilike.%${query}%,takfeste.ilike.%${query}%,cc.ilike.%${query}%,cb.ilike.%${query}%,front.ilike.%${query}%,bak.ilike.%${query}%`
        );

      if (error) {
        carListElement.innerHTML = `<p class="text-red-500">Feil ved søk: ${error.message}</p>`;
        return;
      }

      renderCarList(data);
    }, 400);
  });
}