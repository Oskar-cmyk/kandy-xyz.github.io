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

    // Add hover functionality for the status popup
    const indicator = document.getElementById("availability-indicator");
    const popup = document.getElementById("status-popup");

    if (indicator && popup) {
      indicator.addEventListener("mouseenter", () => {
        popup.classList.add("visible");
      });

      indicator.addEventListener("mouseleave", () => {
        popup.classList.remove("visible");
      });
    }

    // Initial fetch
    fetchAvailability();
    // Update every minute
    setInterval(fetchAvailability, 60000);
  });
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

  document.addEventListener(
    "touchstart",
    (e) => {
      startY = e.touches[0].clientY;
      if (window.scrollY === 0) {
        statusBar.className = "status-visible";
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

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  const leftSide = document.querySelector(".leftside");
  const rightSide = document.querySelector(".rightside");

  leftSide.addEventListener("click", (event) =>
    expandAndRedirect("Commercial")
  );
  rightSide.addEventListener("click", (event) => expandAndRedirect("mainpage"));

  // Desktop hover functionality
  const indicator = document.getElementById("availability-indicator");
  const popup = document.getElementById("status-popup");
  const calendar = document.getElementById("calendar");

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

  // Mobile setup
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    createMobileStatusBar();
    handleMobileTouch();
  }

  // Start availability checking
  fetchAvailability();
  setInterval(fetchAvailability, 60000);
});
