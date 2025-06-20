export function setupCopyButtons() {
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
}
