let allArrivals = []; // Store all arrivals data for filtering
let currentLine = 'bakerloo'; // Default line

// Function to fetch arrivals data for the selected line
async function fetchArrivals() {
  let apiUrl;

  // Set the API URL based on the selected line
  switch (currentLine) {
    case 'bakerloo':
      apiUrl = 'https://api.tfl.gov.uk/Line/bakerloo/Arrivals';
      break;
    case 'central':
      apiUrl = 'https://api.tfl.gov.uk/Line/central/Arrivals';
      break;
    case 'circle':
      apiUrl = 'https://api.tfl.gov.uk/Line/circle/Arrivals';
      break;
    case 'district':
      apiUrl = 'https://api.tfl.gov.uk/Line/district/Arrivals';
      break;
    case 'jubilee':
      apiUrl = 'https://api.tfl.gov.uk/Line/jubilee/Arrivals';
      break;
    case 'metropolitan':
      apiUrl = 'https://api.tfl.gov.uk/Line/metropolitan/Arrivals';
      break;
    case 'northern':
      apiUrl = 'https://api.tfl.gov.uk/Line/northern/Arrivals';
      break;
    case 'piccadilly':
      apiUrl = 'https://api.tfl.gov.uk/Line/piccadilly/Arrivals';
      break;
    case 'victoria':
      apiUrl = 'https://api.tfl.gov.uk/Line/victoria/Arrivals';
      break;
    case 'waterlooandcity':
      apiUrl = 'https://api.tfl.gov.uk/Line/waterloo-city/Arrivals'; // Updated link
      break;
    case 'overground':
      apiUrl = 'https://api.tfl.gov.uk/Line/london-overground/Arrivals'; // Updated link
      break;
    case 'elizabeth':
      apiUrl = 'https://api.tfl.gov.uk/Line/elizabeth/Arrivals';
      break;
    case 'dlr':
      apiUrl = 'https://api.tfl.gov.uk/Line/dlr/Arrivals';
      break;
    case 'tram':
      apiUrl = 'https://api.tfl.gov.uk/Line/tram/Arrivals'; // For London Trams
      break;
    case 'hammersmithcity':
      apiUrl = 'https://api.tfl.gov.uk/Line/hammersmith-city/Arrivals'; // Added Hammersmith & City link
      break;
    default:
      console.error('Invalid line selected');
      return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`${currentLine} Arrivals data fetched:`, data);
      allArrivals = data; // Store data for filtering
      displayArrivals(allArrivals); // Display all data initially
      populateStationDropdown(allArrivals); // Populate dropdown with stations
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    console.error(`Error fetching ${currentLine} Arrivals:`, err);
    document.getElementById('arrivals-tbody').innerHTML = '<tr><td colspan="4">Error fetching data. Please try again later.</td></tr>';
  }
}

// Function to display the fetched arrival data in the table
function displayArrivals(arrivals) {
  const arrivalsTbody = document.getElementById('arrivals-tbody');
  arrivalsTbody.innerHTML = '';

  if (arrivals.length === 0) {
    arrivalsTbody.innerHTML = '<tr><td colspan="4">No arrivals data available at the moment.</td></tr>';
    return;
  }

  arrivals.forEach(arrival => {
    const row = document.createElement('tr');

    const stationCell = document.createElement('td');
    stationCell.textContent = arrival.stationName;

    const destinationCell = document.createElement('td');
    destinationCell.textContent = arrival.destinationName;

    const expectedArrivalCell = document.createElement('td');
    expectedArrivalCell.textContent = new Date(arrival.expectedArrival).toLocaleTimeString('en-GB', {
      hour: '2-digit', 
      minute: '2-digit'
    });

    const platformCell = document.createElement('td');
    platformCell.textContent = arrival.platformName || 'N/A';

    row.appendChild(stationCell);
    row.appendChild(destinationCell);
    row.appendChild(expectedArrivalCell);
    row.appendChild(platformCell);

    arrivalsTbody.appendChild(row);
  });
}

// Function to populate the station dropdown
function populateStationDropdown(arrivals) {
  const stationSelect = document.getElementById('station-select');
  stationSelect.innerHTML = '<option value="all">All Stations</option>'; // Reset options
  
  // Get unique station names and sort them alphabetically
  const stations = [...new Set(arrivals.map(arrival => arrival.stationName))].sort(); 

  // Populate the dropdown with sorted station names
  stations.forEach(station => {
    const option = document.createElement('option');
    option.value = station;
    option.textContent = station;
    stationSelect.appendChild(option);
  });
}

// Event listener for line selection
document.getElementById('line-select').addEventListener('change', (event) => {
  currentLine = event.target.value; // Update the current line
  fetchArrivals(); // Fetch arrivals for the selected line
});

// Event listener for filter button
document.getElementById('filter-button').addEventListener('click', () => {
  const selectedStation = document.getElementById('station-select').value;
  
  // Filter arrivals based on selected station
  const filteredArrivals = selectedStation === 'all'
    ? allArrivals
    : allArrivals.filter(arrival => arrival.stationName === selectedStation);

  displayArrivals(filteredArrivals); // Display filtered arrivals
});

// Fetch and display data on page load
window.onload = fetchArrivals;
