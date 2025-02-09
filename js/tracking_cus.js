// JavaScript source code
document.addEventListener('DOMContentLoaded', function () {
	// Get username from localStorage
	const username = localStorage.getItem('username') || 'User';
	document.getElementById('username').textContent = username;

	// Load initial tracking data
	loadTrackingData();

	// Add search functionality
	const searchInput = document.getElementById('search');
	searchInput.addEventListener('input', debounce(function () {
		filterPackages(this.value);
	}, 300));
});

// Sample tracking data - replace with actual API call
const trackingData = [
	{
		id: 'TRK001',
		bookingId: '300056234567',
		customerId: 'C001',
		status: 'in-transit',
		lastUpdated: '2024-03-20T10:30:00',
		location: 'London Distribution Center',
		estimatedDelivery: '2024-03-22',
		updates: [
			{ time: '2024-03-20T10:30:00', status: 'Package in transit', location: 'London' },
			{ time: '2024-03-20T08:15:00', status: 'Package picked up', location: 'Manchester' }
		]
	},
	{
		id: 'TRK002',
		bookingId: '222222444444',
		customerId: 'C002',
		status: 'delivered',
		lastUpdated: '2024-03-19T15:45:00',
		location: 'Birmingham',
		estimatedDelivery: '2024-03-19',
		updates: [
			{ time: '2024-03-19T15:45:00', status: 'Package delivered', location: 'Birmingham' },
			{ time: '2024-03-19T10:20:00', status: 'Out for delivery', location: 'Birmingham' }
		]
	},
	{
		id: 'TRK003',
		bookingId: '111111222222',
		customerId: 'C001',
		status: 'delivered',
		lastUpdated: '2024-03-18T14:30:00',
		location: 'Manchester',
		estimatedDelivery: '2024-03-18',
		updates: [
			{ time: '2024-03-18T14:30:00', status: 'Package delivered', location: 'Manchester' },
			{ time: '2024-03-18T09:15:00', status: 'Out for delivery', location: 'Manchester' }
		]
	}
];

let filteredData = [...trackingData];

function loadTrackingData(data = filteredData) {
	const tableBody = document.getElementById('packageList');

	if (data.length === 0) {
		tableBody.innerHTML = `
			<tr>
				<td colspan="5" class="no-results">
					<i class="material-icons-round">search_off</i>
					<p>No packages found</p>
				</td>
			</tr>
		`;
		return;
	}

	tableBody.innerHTML = data.map(pkg => `
		<tr>
			<td>${pkg.bookingId}</td>
			<td>${pkg.customerId}</td>
			<td>
				<span class="status ${pkg.status.toLowerCase()}">
					${capitalizeFirstLetter(pkg.status)}
				</span>
			</td>
			<td>${formatDate(pkg.lastUpdated)}</td>
			<td>
				<button class="icon-button" onclick="viewDetails('${pkg.bookingId}')" title="View Details">
					<i class="material-icons-round">visibility</i>
				</button>
				<button class="icon-button" onclick="viewUpdates('${pkg.bookingId}')" title="View Updates">
					<i class="material-icons-round">timeline</i>
				</button>
			</td>
		</tr>
	`).join('');
}

function filterPackages(searchTerm) {
	searchTerm = searchTerm.toLowerCase().trim();

	if (searchTerm === '') {
		filteredData = [...trackingData];
		loadTrackingData();
		return;
	}

	filteredData = trackingData.filter(pkg =>
		pkg.bookingId.toLowerCase().includes(searchTerm) ||
		pkg.customerId.toLowerCase().includes(searchTerm) ||
		pkg.location.toLowerCase().includes(searchTerm)
	);

	loadTrackingData(filteredData);
}

function viewDetails(bookingId) {
	const package = trackingData.find(pkg => pkg.bookingId === bookingId);
	if (package) {
		alert(`
Package Details:
---------------
Booking ID: ${package.bookingId}
Customer ID: ${package.customerId}
Status: ${capitalizeFirstLetter(package.status)}
Location: ${package.location}
Last Updated: ${formatDate(package.lastUpdated)}
Estimated Delivery: ${formatDate(package.estimatedDelivery)}
		`);
	}
}

function viewUpdates(bookingId) {
	const package = trackingData.find(pkg => pkg.bookingId === bookingId);
	if (package && package.updates) {
		const updates = package.updates.map(update =>
			`${formatDate(update.time)}: ${update.status} at ${update.location}`
		).join('\n');

		alert(`
Tracking Updates:
----------------
${updates}
		`);
	}
}

// Utility functions
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
	return new Date(dateString).toLocaleString('en-US', options);
}

function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func.apply(this, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

function getStatusIcon(status) {
	switch (status.toLowerCase()) {
		case 'delivered':
			return 'check_circle';
		case 'in-transit':
			return 'local_shipping';
		case 'pending':
			return 'schedule';
		default:
			return 'info';
	}
}

