function expandAndRedirect(event, url) {
  const leftSide = document.querySelector(".leftside");
  const rightSide = document.querySelector(".rightside");

  if (leftSide.contains(event.target)) {
    rightSide.classList.remove("expanded");
    leftSide.classList.add("expanded");
    leftSide.style.color = "#1C00FF";
  } else if (rightSide.contains(event.target)) {
    leftSide.classList.remove("expanded");
    rightSide.classList.add("expanded");
    rightSide.style.color = "#1C00FF";
  }

  setTimeout(() => {
    window.location.href = url;
  }, 300);
}
function expandAndRedirect(event, url) {
  const leftSide = document.querySelector(".leftside");
  const rightSide = document.querySelector(".rightside");

  if (leftSide.contains(event.target)) {
    rightSide.classList.remove("expanded");
    leftSide.classList.add("expanded");
    leftSide.style.color = "#1C00FF";
  } else if (rightSide.contains(event.target)) {
    leftSide.classList.remove("expanded");
    rightSide.classList.add("expanded");
    rightSide.style.color = "#1C00FF";
  }

  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

const API_KEY = "AIzaSyDB-g91hYIIkbBOk_VnHc4QT3NXEsFEux4";
const CALENDAR_ID =
  "770ae841bdeed81f2de7c79c27f3f4274c7def43b6d8622e28dd5bf4667669fc@group.calendar.google.com";

async function fetchAvailability() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${new Date().toISOString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const events = data.items || [];
    const now = new Date();
    let available = true;

    // Loop through events and check if the current time falls within any event time
    events.forEach((event) => {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      if (now >= start && now < end) {
        available = false;
      }
    });

    // Update the indicator based on availability
    const indicator = document.getElementById("availability-indicator");
    if (indicator) {
      indicator.className = available ? "green" : "red";
      console.log(
        "Availability status:",
        available ? "Available" : "Unavailable"
      );
    }
  } catch (error) {
    console.error("Error fetching availability:", error);
    const indicator = document.getElementById("availability-indicator");
    if (indicator) {
      indicator.className = "red";
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Set up the click handlers for expand and redirect
  const leftSide = document.querySelector(".leftside");
  const rightSide = document.querySelector(".rightside");

  if (leftSide) {
    leftSide.addEventListener("click", function (event) {
      expandAndRedirect(event, "Commercial");
    });
  }

  if (rightSide) {
    rightSide.addEventListener("click", function (event) {
      expandAndRedirect(event, "mainpage");
    });
  }

  // Initial availability check
  fetchAvailability();

  // Update availability every minute
  setInterval(fetchAvailability, 60000);
});
