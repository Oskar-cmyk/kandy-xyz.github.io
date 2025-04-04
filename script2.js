function expandAndRedirect(event, url) {
  event.preventDefault();
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
    window.location.replace(url);
  }, 300);
}

// Remove the first DOMContentLoaded listener and keep only one initialization block
document.addEventListener("DOMContentLoaded", function () {
  const leftSide = document.querySelector(".leftside");
  const rightSide = document.querySelector(".rightside");
  const indicator = document.getElementById("availability-indicator");
  const popup = document.getElementById("status-popup");
  const calendar = document.getElementById("calendar");

  // Click handlers for navigation
  leftSide.addEventListener("click", (event) =>
    expandAndRedirect(event, "Commercial")
  );
  rightSide.addEventListener("click", (event) =>
    expandAndRedirect(event, "mainpage")
  );

  // Handle desktop/mobile functionality
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile setup
    createMobileStatusBar();
    handleMobileTouch();
  } else {
    // Desktop hover functionality
    if (indicator && popup) {
      indicator.addEventListener("mouseenter", () => {
        if (calendar.classList.contains("hidden")) {
          popup.classList.remove("hidden");
        }
      });

      indicator.addEventListener("mouseleave", () => {
        popup.classList.add("hidden");
      });
    }
  }

  // Start availability checking
  fetchAvailability();
  setInterval(fetchAvailability, 60000);
});
const API_KEY = "AIzaSyDB-g91hYIIkbBOk_VnHc4QT3NXEsFEux4";
const CALENDAR_ID =
  "770ae841bdeed81f2de7c79c27f3f4274c7def43b6d8622e28dd5bf4667669fc@group.calendar.google.com";

// Mobile status variables
let statusBar = null;
let isStatusVisible = false;

function createMobileStatusBar() {
  if (!statusBar) {
    statusBar = document.createElement("div");
    statusBar.id = "mobile-status";
    statusBar.className = "status-hidden";
    document.body.appendChild(statusBar);
  }
}

// Main functionality remains the same

function toggleCalendar() {
  const calendar = document.getElementById("calendar");
  const statusPopup = document.getElementById("status-popup");

  calendar.classList.toggle("hidden");

  if (statusPopup) {
    statusPopup.classList.add("hidden");
  }
}

function formatTime(date) {
  return date.toLocaleString("en-UK", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}

async function fetchAvailability() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${new Date().toISOString()}&orderBy=startTime&singleEvents=true`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const events = data.items || [];
    const now = new Date();
    let available = true;
    let statusMessage = "";

    for (const event of events) {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);

      if (now >= start && now < end) {
        available = false;
        statusMessage = `Available again at ${formatTime(end)}`;
        break;
      } else if (now < start) {
        statusMessage = `Unavailable starting at ${formatTime(start)}`;
        break;
      }
    }

    updateStatus(available, statusMessage);
  } catch (error) {
    console.error("Error fetching availability:", error);
    updateStatus(false, "Error checking availability");
  }
}

function updateStatus(available, message) {
  const indicator = document.getElementById("availability-indicator");
  const statusText = document.getElementById("next-status-change");

  if (indicator) {
    indicator.className = available ? "green" : "red";
  }

  if (statusText) {
    statusText.textContent = message;
  }

  // Update mobile status
  if (statusBar) {
    statusBar.textContent = message;
  }
}

// Mobile-specific touch handling
function handleMobileTouch() {
  let startY;
  const scrollThreshold = 10; // Increase this number to require more scrolling

  document.addEventListener(
    "touchstart",
    (e) => {
      startY = e.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (window.scrollY === 0) {
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;

        if (pullDistance > scrollThreshold) {
          statusBar.className = "status-visible";
        }
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    () => {
      if (statusBar.className === "status-visible") {
        setTimeout(() => {
          statusBar.className = "status-hidden";
        }, 3000);
      }
    },
    { passive: true }
  );
}
