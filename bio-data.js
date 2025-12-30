document.addEventListener("DOMContentLoaded", () => {
  const url =
    'https://z3noo8fe.api.sanity.io/v2023-01-01/data/query/production?query=*[_type=="bio"][0]{name,description,"portraitUrl":portrait.asset->url,portraitCredit}';

  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const data = res.result;
      if (!data) return;

      // Set portrait image
      const img = document.getElementById("bio-portrait");
      if (img && data.portraitUrl) {
        img.src = data.portraitUrl;
        img.alt = "Portrait of " + data.name;
      }

      // Set name
      const header = document.getElementById("clickableHeader");
      if (header) header.innerText = data.name;

      // Set description
      const bioText = document.getElementById("bio-text");
      if (bioText) bioText.innerHTML = data.description;

      // Set credit
      const credit = document.getElementById("bio-credit");
      if (credit) credit.innerText = data.portraitCredit ?? "";
    })
    .catch((err) => console.error("Sanity fetch error:", err));
});
