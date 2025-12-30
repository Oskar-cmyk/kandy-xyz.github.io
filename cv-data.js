const PROJECT_ID = "z3noo8fe";
const DATASET = "production";

// Fetch all CV events from Sanity
const query = `*[_type=="cvEvent"]{title,description,location,link,date}`;
const url = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(
  query
)}`;

fetch(url)
  .then((res) => res.json())
  .then((res) => renderCV(res.result))
  .catch((err) => console.error(err));

function renderCV(events) {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const now = new Date();

  // Automatically separate upcoming vs past
  const upcoming = [];
  const past = [];

  events.forEach((ev) => {
    const eventDate = new Date(ev.date);
    if (eventDate >= now) {
      upcoming.push(ev);
    } else {
      past.push(ev);
    }
  });

  // Sort events: newest first
  upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)); // ascending
  past.sort((a, b) => new Date(b.date) - new Date(a.date)); // descending

  function renderEventList(title, list) {
    if (!list.length) return;

    const ul = document.createElement("ul");
    ul.innerHTML = `<li><h2>${title}</h2></li>`;

    let currentYear = null;

    list.forEach((ev) => {
      const eventDate = new Date(ev.date);
      const year = eventDate.getFullYear();

      // Insert year header if it changed
      if (year !== currentYear) {
        const yearLi = document.createElement("li");
        yearLi.innerHTML = `<h3 style="margin-top:20px;">${year}</h3>`;
        ul.appendChild(yearLi);
        currentYear = year;
      }

      const dateStr = eventDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const li = document.createElement("li");
      li.innerHTML = `
        <p><strong>${ev.title}</strong> – ${dateStr}${
        ev.location ? ", " + ev.location : ""
      }${ev.description ? " – " + ev.description : ""}${
        ev.link ? ` (<a href="${ev.link}" target="_blank">link</a>)` : ""
      }</p>
      `;
      ul.appendChild(li);
    });

    main.appendChild(ul);
  }

  renderEventList("Upcoming Exhibitions / Performances", upcoming);
  renderEventList("Past Exhibitions / Performances", past);
}
