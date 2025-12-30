const PROJECT_ID = "z3noo8fe";
const DATASET = "production";

const query = `*[_type=="contact"][0]{name,title,location,phone,email}`;

const url = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(
  query
)}`;

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    const data = res.result;
    if (!data) return;

    // Populate HTML fields
    const nameEl = document.getElementById("contact-name");
    const titleEl = document.getElementById("contact-title");
    const locationEl = document.getElementById("contact-location");
    const phoneEl = document.getElementById("contact-phone");
    const emailEl = document.getElementById("contact-email");

    if (nameEl) nameEl.textContent = data.name;
    if (titleEl) titleEl.textContent = data.title;
    if (locationEl) locationEl.textContent = data.location;
    if (phoneEl) {
      phoneEl.href = `tel:${data.phone}`;
      phoneEl.textContent = data.phone;
    }
    if (emailEl) {
      emailEl.href = `mailto:${data.email}`;
      emailEl.textContent = data.email;
    }
  })
  .catch((err) => console.error("Sanity fetch error:", err));
