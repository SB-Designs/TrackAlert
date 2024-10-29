// Fetch line status from TfL API
async function fetchTflStatus() {
  try {
    const response = await fetch(
      "https://api.tfl.gov.uk/line/mode/tube,overground,dlr,elizabeth-line,tram/status"
    );
    const data = await response.json();

    displayStatus(data);
  } catch (error) {
    console.error("Error fetching data from TfL API:", error);
    document.getElementById("status-container").innerHTML =
      "<p>Error fetching data. Please try again later.</p>";
  }
}

// Function to display the status of each line
function displayStatus(lines) {
  const statusContainer = document.getElementById("status-container");
  statusContainer.innerHTML = ""; // Clear any previous data

  lines.forEach((line) => {
    const statusItem = document.createElement("div");
    statusItem.classList.add("status-item");

    const lineName = document.createElement("h3");
    lineName.textContent = line.name;

    const lineStatus = document.createElement("p");
    lineStatus.textContent = line.lineStatuses[0].statusSeverityDescription;

    statusItem.appendChild(lineName);
    statusItem.appendChild(lineStatus);

    // Check if there is a disruption reason
    if (line.lineStatuses[0].reason) {
      statusItem.style.cursor = "pointer"; // Show clickable cursor

      // Click event to show reason in the modal
      statusItem.addEventListener("click", () => {
        showReasonModal(line.lineStatuses[0].reason);
      });
    }

    statusContainer.appendChild(statusItem);
  });
}

// Function to display modal with the disruption reason
function showReasonModal(reason) {
  const modal = document.getElementById("reasonModal");
  const reasonText = document.getElementById("reasonText");
  const closeBtn = document.querySelector(".close");

  // Set reason text in the modal
  reasonText.textContent = reason;

  // Show the modal
  modal.style.display = "block";

  // Close the modal when the user clicks on the close button
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal when the user clicks anywhere outside the modal content
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Fetch and display data on page load
window.onload = fetchTflStatus;
// TfL Line colors
const lineColors = {
  Bakerloo: "#B36305",
  Central: "#E32017",
  Circle: "#FFD300",
  District: "#00782A",
  "Hammersmith & City": "#F3A9BB",
  Jubilee: "#A0A5A9",
  Metropolitan: "#9B0056",
  Northern: "#000000",
  Piccadilly: "#003688",
  Victoria: "#0098D4",
  "Waterloo & City": "#95CDBA",
  "London Overground": "#EE7C0E",
  DLR: "#00A4A7",
  Tram: "#84B817",
  "Elizabeth line": "#9364CC",
};

// Function to display the status of each line
function displayStatus(lines) {
  const statusContainer = document.getElementById("status-container");
  statusContainer.innerHTML = ""; // Clear any previous data

  lines.forEach((line) => {
    const statusItem = document.createElement("div");
    statusItem.classList.add("status-item");

    // Set background color according to the line
    const lineColor = lineColors[line.name] || "#003688"; // Default TfL color if not found
    statusItem.style.backgroundColor = lineColor;

    const lineName = document.createElement("h3");
    lineName.textContent = line.name;

    const lineStatus = document.createElement("p");
    lineStatus.textContent = line.lineStatuses[0].statusSeverityDescription;

    statusItem.appendChild(lineName);
    statusItem.appendChild(lineStatus);

    // Check if there is a disruption reason
    if (line.lineStatuses[0].reason) {
      statusItem.style.cursor = "pointer"; // Show clickable cursor

      // Click event to show reason in the modal
      statusItem.addEventListener("click", () => {
        showReasonModal(line.lineStatuses[0].reason);
      });
    }

    statusContainer.appendChild(statusItem);
  });
}
