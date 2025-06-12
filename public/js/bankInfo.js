document.addEventListener("DOMContentLoaded", function () {
  const yesRadio = document.getElementById("marriedYes");
  const noRadio = document.getElementById("marriedNo");
  const bankDetails = document.getElementById("bankDetails");
  const declaration = document.getElementById("declarationCheck");
  const submitBtn = document.getElementById("sendBtn");

  function toggleBankDetails() {
    if (yesRadio.checked) {
      bankDetails.classList.remove("hidden");
    } else {
      bankDetails.classList.add("hidden");
    }
  }

  yesRadio.addEventListener("change", toggleBankDetails);
  noRadio.addEventListener("change", toggleBankDetails);

  function toggleSubmit() {
    const disabled = !declaration.checked;
    submitBtn.disabled = disabled;

    submitBtn.classList.toggle("opacity-50", disabled);
    submitBtn.classList.toggle("cursor-not-allowed", disabled);
  }
  toggleSubmit();
  declaration.addEventListener("change", toggleSubmit);
});
