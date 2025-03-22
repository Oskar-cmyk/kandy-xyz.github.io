function expandAndRedirect(url) {
  const leftSide = document.querySelector(".leftside");
  const rightSide = document.querySelector(".rightside");

  if (leftSide.contains(event.target)) {
    rightSide.classList.remove("expanded");
    leftSide.classList.add("expanded");
    leftSide.style.color = "#1C00FF"; // Change text color to #1C00FF
  } else if (rightSide.contains(event.target)) {
    leftSide.classList.remove("expanded");
    rightSide.classList.add("expanded");
    rightSide.style.color = "#1C00FF"; // Change text color to #1C00FF
  }

  setTimeout(() => {
    window.location.href = url;
  }, 300); // Adjust the delay time as needed
}

document.addEventListener("DOMContentLoaded", function () {
  const leftSide = document.querySelector(".leftside");
  const rightSide = document.querySelector(".rightside");

  leftSide.addEventListener("click", function (event) {
    expandAndRedirect("Commercial");
  });

  rightSide.addEventListener("click", function (event) {
    expandAndRedirect("mainpage");
  });

  // Start checking availability
  fetchAvailability();
  // Update availability every minute
  setInterval(fetchAvailability, 60000);
});

const API_KEY = "AIzaSyDB-g91hYIIkbBOk_VnHc4QT3NXEsFEux4";
const CALENDAR_ID =
  "770ae841bdeed81f2de7c79c27f3f4274c7def43b6d8622e28dd5bf4667669fc@group.calendar.google.com";

function toggleCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.classList.toggle("hidden");
}

async function fetchAvailability() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const events = data.items || [];
    const now = new Date();
    let isAvailable = true;

    // Check if there's any ongoing event
    events.forEach((event) => {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      if (now >= start && now < end) {
        isAvailable = false;
      }
    });

    const indicator = document.getElementById("availability-indicator");
    if (isAvailable) {
      indicator.className = "green";
    } else {
      indicator.className = "red";
    }
  } catch (error) {
    console.error("Error fetching availability:", error);
    // Default to red if there's an error
    const indicator = document.getElementById("availability-indicator");
    indicator.className = "red";
  }
}

// Add click event listener to indicator
document
  .getElementById("availability-indicator")
  .addEventListener("click", toggleCalendar);
