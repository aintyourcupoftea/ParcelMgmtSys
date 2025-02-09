// JavaScript source code
document.addEventListener('DOMContentLoaded', function () {
	// Get username from localStorage
	const username = localStorage.getItem('officerUsername') || 'Officer';
	document.getElementById('username').textContent = username;

	// Load initial data
	loadPackages();

	// Add search functionality
	const searchInput = document.getElementById('search');
	searchInput.addEventListener('input', debounce(function () {
		filterPackages(this.value);
	}, 300));
});

// Sample package data - replace with actual API call
const packages = [
	{
		customerId: 'C001', bookingId: 'B001', status: 'Shipped', lastUpdated: '2025-01-04'
	},
	{
		customerId: 'C001', bookingId: 'B001', status: 'Shipped', lastUpdated: '2025-05-04'
	},

	{
		customerId: 'C001', bookingId: 'B001', status: 'Shipped', lastUpdated: '2025-02-04'
	},
	{
		customerId: 'C001', bookingId: 'B001', status: 'Shipped', lastUpdated: '2025-03-04'
	},

	{
		customerId: 'C001', bookingId: 'B001', status: 'Shipped', lastUpdated: '2025-04-04'
	}

];

function loadPackages() {
	const tableBody = document.getElementById('packageList');

	if (packages.length === 0) {
		tableBody.innerHTML = `
			<tr>
				<td colspan="5" class="no-results">
					<i class="material-icons-round">inventory_2</i>
					<p>No packages found</p>
				</td>
			</tr>
		`;
		return;
	}

	tableBody.innerHTML = packages.map(pkg => `
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
				<button class="icon-button" onclick="updateStatus('${pkg.bookingId}')" title="Update Status">
					<i class="material-icons-round">edit</i>
				</button>
			</td>
		</tr>
	`).join('');
}

function filterPackages(searchTerm) {
	const filteredPackages = packages.filter(pkg =>
		pkg.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
		pkg.customerId.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const tableBody = document.getElementById('packageList');

	if (filteredPackages.length === 0) {
		tableBody.innerHTML = `
			<tr>
				<td colspan="5" class="no-results">
					<i class="material-icons-round">search_off</i>
					<p>No matching packages found</p>
				</td>
			</tr>
		`;
		return;
	}

	tableBody.innerHTML = filteredPackages.map(pkg => `
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
				<button class="icon-button" onclick="updateStatus('${pkg.bookingId}')" title="Update Status">
					<i class="material-icons-round">edit</i>
				</button>
			</td>
		</tr>
	`).join('');
}

function viewDetails(bookingId) {
	// Implement view details functionality
	console.log(`Viewing details for booking: ${bookingId}`);
}

function updateStatus(bookingId) {
	// Implement status update functionality
	console.log(`Updating status for booking: ${bookingId}`);
}

// Utility functions
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
	const options = { year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateString).toLocaleDateString('en-US', options);
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

