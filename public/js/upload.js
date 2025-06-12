/* upload.js
 * Handles dynamic file list + removal for <input type="file" multiple>
 */

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileUpload");
  const fileListUI = document.getElementById("uploadedFiles");

  // Will hold the File objects currently selected
  let filesArray = [];

  /** Render the visual list and sync the input’s FileList */
  function renderFiles() {
    // 1) Clear UI list
    fileListUI.innerHTML = "";

    // 2) Re-add each file with a “×” button
    filesArray.forEach((file, idx) => {
      const li = document.createElement("li");
      li.className =
        "flex items-center bg-gray-700 text-white rounded px-3 py-1 gap-2";

      li.innerHTML = `
          <span class="truncate max-w-[10rem]">${file.name}</span>
          <button
            type="button"
            data-idx="${idx}"
            class="text-red-400 hover:text-red-600 font-bold text-lg leading-none"
            aria-label="Remove file"
          >
            &times;
          </button>
        `;

      fileListUI.appendChild(li);
    });

    // 3) Re-create a FileList for the <input>
    const dataTransfer = new DataTransfer();
    filesArray.forEach((file) => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
  }

  /** When user picks new files */
  fileInput.addEventListener("change", () => {
    filesArray.push(...Array.from(fileInput.files));
    renderFiles();
  });

  /** Remove file on “×” click (event delegation) */
  fileListUI.addEventListener("click", (e) => {
    if (e.target.matches("button[data-idx]")) {
      const idx = Number(e.target.dataset.idx);
      filesArray.splice(idx, 1);
      renderFiles();
    }
  });
});
