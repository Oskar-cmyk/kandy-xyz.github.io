// Your existing expand and redirect code
function expandAndRedirect(url) {
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
let colorMap = {}; // Store event color mappings

// Fetch and store calendar colors
async function fetchCalendarColors() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/colors?key=${API_KEY}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const colorData = await response.json();
    colorMap = colorData.event; // Store event color mappings
  } catch (error) {
    console.error("Error fetching calendar colors:", error);
  }
}

// Fetch and update availability
async function fetchAvailability() {
  try {
    if (Object.keys(colorMap).length === 0) {
      // Ensure colors are loaded first
      await fetchCalendarColors();
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const now = new Date();
    let currentEvent = null;

    for (const event of data.items || []) {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      if (now >= start && now < end) {
        currentEvent = event;
        break;
      }
    }

    // Set indicator color based on event colorId or default yellow
    const eventColor = currentEvent?.colorId
      ? colorMap[currentEvent.colorId]?.background
      : "#F6BF26"; // Default color

    const indicator = document.getElementById("availability-indicator");
    if (indicator) {
      indicator.style.backgroundColor = eventColor;
      indicator.style.boxShadow = `0 0 10px ${eventColor}`;
    }
  } catch (error) {
    console.error("Error fetching availability:", error);
  }
}

// Initialize script when DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
  await fetchCalendarColors(); // Fetch colors first
  await fetchAvailability(); // Fetch events after colors are loaded

  const indicator = document.getElementById("availability-indicator");
  if (indicator) {
    indicator.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleCalendar();
    });
  }

  setInterval(fetchAvailability, 60000);
});
