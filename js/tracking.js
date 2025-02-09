// Global variables
let currentFilter = 'all';
let packages = [];

document.addEventListener('DOMContentLoaded', function () {
	// Get username from localStorage
	const username = localStorage.getItem('officerUsername') || 'Officer';
	document.getElementById('username').textContent = username;

	// Initialize event listeners
	document.getElementById('search').addEventListener('input', debounce(filterPackages, 300));
	document.getElementById('dateFilter').addEventListener('change', filterPackages);
	document.getElementById('updateForm').addEventListener('submit', handleUpdateSubmit);

	// Initialize modal close button
	const modal = document.getElementById('updateModal');
	const closeBtn = modal.querySelector('.close-button');
	closeBtn.onclick = () => modal.style.display = 'none';
	window.onclick = (event) => {
		if (event.target === modal) modal.style.display = 'none';
	};

	// Set today as max date for date filter
	const today = new Date().toISOString().split('T')[0];
	document.getElementById('dateFilter').setAttribute('max', today);

	// Load initial data
	loadPackages();
});

// Sample package data - replace with actual API call
const samplePackages = [
	{
		id: 'TRK001',
		bookingId: 'BK240320001',
		customerId: 'CUST001',
		status: 'in-transit',
		lastUpdated: '2024-03-20T10:30:00',
		location: 'London Distribution Center',
		estimatedDelivery: '2024-03-22',
		receiverName: 'John Smith',
		receiverAddress: '123 Oxford Street, London, W1D 1DF',
		updates: [
			{ time: '2024-03-20T10:30:00', status: 'Package in transit', location: 'London Distribution Center' },
			{ time: '2024-03-20T08:15:00', status: 'Package picked up', location: 'Manchester Warehouse' }
		]
	},
	{
		id: 'TRK002',
		bookingId: 'BK240319002',
		customerId: 'CUST002',
		status: 'delivered',
		lastUpdated: '2024-03-19T15:45:00',
		location: 'Birmingham',
		estimatedDelivery: '2024-03-19',
		receiverName: 'Emma Wilson',
		receiverAddress: '45 High Street, Birmingham, B2 4BQ',
		updates: [
			{ time: '2024-03-19T15:45:00', status: 'Package delivered', location: 'Birmingham' },
			{ time: '2024-03-19T10:20:00', status: 'Out for delivery', location: 'Birmingham Hub' }
		]
	},
	{
		id: 'TRK003',
		bookingId: 'BK240318003',
		customerId: 'CUST003',
		status: 'pending',
		lastUpdated: '2024-03-18T14:30:00',
		location: 'Manchester Warehouse',
		estimatedDelivery: '2024-03-21',
		receiverName: 'David Brown',
		receiverAddress: '78 Queen Street, Manchester, M2 4XX',
		updates: [
			{ time: '2024-03-18T14:30:00', status: 'Package received at warehouse', location: 'Manchester Warehouse' }
		]
	}
];

async function loadPackages() {
	showLoadingState();

	try {
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 800));
		packages = samplePackages;
		filterPackages();
	} catch (error) {
		showError('Failed to load packages. Please try again.');
	}
}

function filterPackages() {
	const searchTerm = document.getElementById('search').value.toLowerCase();
	const dateFilter = document.getElementById('dateFilter').value;

	let filtered = packages;

	// Apply status filter
	if (currentFilter !== 'all') {
		filtered = filtered.filter(pkg => pkg.status === currentFilter);
	}

	// Apply search filter
	if (searchTerm) {
		filtered = filtered.filter(pkg =>
			pkg.bookingId.toLowerCase().includes(searchTerm) ||
			pkg.customerId.toLowerCase().includes(searchTerm) ||
			pkg.location.toLowerCase().includes(searchTerm) ||
			pkg.receiverName.toLowerCase().includes(searchTerm)
		);
	}

	// Apply date filter
	if (dateFilter) {
		const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
		filtered = filtered.filter(pkg => {
			const packageDate = new Date(pkg.lastUpdated).setHours(0, 0, 0, 0);
			return packageDate === filterDate;
		});
	}

	displayPackages(filtered);
}

function filterByStatus(status) {
	// Update selected status chip
	document.querySelectorAll('.status-chip').forEach(chip => {
		chip.classList.remove('selected');
	});
	document.querySelector(`.status-chip.${status}`).classList.add('selected');

	currentFilter = status;
	filterPackages();
}

function displayPackages(packagesToShow) {
	const container = document.getElementById('packages-list');

	if (packagesToShow.length === 0) {
		container.innerHTML = `
			<div class="no-results">
				<i class="material-icons-round">inventory_2</i>
				<p>No packages found</p>
			</div>
		`;
		return;
	}

	container.innerHTML = packagesToShow.map(pkg => `
		<div class="package-card">
			<div class="package-header">
				<div class="package-id">${pkg.bookingId}</div>
				<span class="status-badge ${pkg.status}">
					<i class="material-icons-round">${getStatusIcon(pkg.status)}</i>
					${capitalizeFirstLetter(pkg.status)}
				</span>
			</div>
			<div class="package-details">
				<div class="detail-group">
					<h4>Customer ID</h4>
					<p>${pkg.customerId}</p>
				</div>
				<div class="detail-group">
					<h4>Receiver</h4>
					<p>${pkg.receiverName}</p>
				</div>
				<div class="detail-group">
					<h4>Location</h4>
					<p>${pkg.location}</p>
				</div>
				<div class="detail-group">
					<h4>Last Updated</h4>
					<p>${formatDate(pkg.lastUpdated)}</p>
				</div>
			</div>
			<div class="package-actions">
				<button class="action-btn secondary" onclick="viewDetails('${pkg.id}')">
					<i class="material-icons-round">visibility</i>
					View Details
				</button>
				<button class="action-btn primary" onclick="updateStatus('${pkg.id}')">
					<i class="material-icons-round">edit</i>
					Update Status
				</button>
			</div>
		</div>
	`).join('');
}

function viewDetails(packageId) {
	const pkg = packages.find(p => p.id === packageId);
	if (pkg) {
		showModal(`
			<h3>Package Details</h3>
			<div class="package-details">
				<div class="detail-group">
					<h4>Booking ID</h4>
					<p>${pkg.bookingId}</p>
				</div>
				<div class="detail-group">
					<h4>Customer ID</h4>
					<p>${pkg.customerId}</p>
				</div>
				<div class="detail-group">
					<h4>Receiver</h4>
					<p>${pkg.receiverName}</p>
				</div>
				<div class="detail-group">
					<h4>Delivery Address</h4>
					<p>${pkg.receiverAddress}</p>
				</div>
				<div class="detail-group">
					<h4>Estimated Delivery</h4>
					<p>${formatDate(pkg.estimatedDelivery)}</p>
				</div>
			</div>
			<div class="timeline">
				<h4>Tracking History</h4>
				${pkg.updates.map(update => `
					<div class="timeline-item">
						<div class="timeline-time">${formatDate(update.time)}</div>
						<div class="timeline-content">
							${update.status} at ${update.location}
						</div>
					</div>
				`).join('')}
			</div>
		`);
	}
}

function updateStatus(packageId) {
	const pkg = packages.find(p => p.id === packageId);
	if (pkg) {
		const modal = document.getElementById('updateModal');
		const form = document.getElementById('updateForm');

		// Pre-fill form
		form.querySelector('#status').value = pkg.status;
		form.querySelector('#location').value = pkg.location;

		// Store package ID for form submission
		form.dataset.packageId = packageId;

		modal.style.display = 'block';
	}
}

function handleUpdateSubmit(event) {
	event.preventDefault();

	const form = event.target;
	const packageId = form.dataset.packageId;
	const status = form.querySelector('#status').value;
	const location = form.querySelector('#location').value;
	const notes = form.querySelector('#notes').value;

	// Update package data
	const pkg = packages.find(p => p.id === packageId);
	if (pkg) {
		pkg.status = status;
		pkg.location = location;
		pkg.lastUpdated = new Date().toISOString();
		pkg.updates.unshift({
			time: new Date().toISOString(),
			status: `Status updated to ${status}`,
			location: location
		});

		// Close modal and refresh display
		document.getElementById('updateModal').style.display = 'none';
		filterPackages();
		showToast('Package status updated successfully');
	}
}

// Utility functions
function showLoadingState() {
	const container = document.getElementById('packages-list');
	container.innerHTML = `
		<div class="loading-state">
			<i class="material-icons-round rotating">refresh</i>
			<p>Loading packages...</p>
		</div>
	`;
}

function showError(message) {
	const container = document.getElementById('packages-list');
	container.innerHTML = `
		<div class="error-state">
			<i class="material-icons-round">error_outline</i>
			<p>${message}</p>
		</div>
	`;
}

function showModal(content) {
	let modal = document.getElementById('details-modal');
	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'details-modal';
		modal.className = 'modal';
		modal.innerHTML = `
			<div class="modal-content">
				<span class="close-button">&times;</span>
				<div class="modal-body"></div>
			</div>
		`;
		document.body.appendChild(modal);

		modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
		window.onclick = (event) => {
			if (event.target === modal) modal.style.display = 'none';
		};
	}

	modal.querySelector('.modal-body').innerHTML = content;
	modal.style.display = 'block';
}

function showToast(message) {
	let toast = document.createElement('div');
	toast.className = 'toast';
	toast.innerHTML = `
		<i class="material-icons-round">check_circle</i>
		<span>${message}</span>
	`;
	document.body.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('show');
		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => toast.remove(), 300);
		}, 3000);
	}, 100);
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

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
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

