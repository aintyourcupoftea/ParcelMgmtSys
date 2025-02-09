// Global variables
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 10;
let filteredBookings = [];
let allBookings = [];

document.addEventListener('DOMContentLoaded', function () {
    // Get username from localStorage
    const username = localStorage.getItem('officerUsername') || 'Officer';
    document.getElementById('username').textContent = username;

    // Initialize date inputs with current month range
    initializeDateRange();

    // Add event listeners
    document.getElementById('searchCustomerId').addEventListener('input', debounce(filterBookings, 300));
    document.getElementById('startDate').addEventListener('change', filterBookings);
    document.getElementById('endDate').addEventListener('change', filterBookings);

    // Load initial bookings
    loadBookings();
});

function initializeDateRange() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    document.getElementById('startDate').valueAsDate = firstDay;
    document.getElementById('endDate').valueAsDate = lastDay;
}

async function loadBookings() {
    showLoadingState();

    try {
        // Simulated API call - replace with actual API endpoint
        const response = await simulateAPICall();
        allBookings = response;
        filterBookings();
    } catch (error) {
        showError('Failed to load bookings. Please try again.');
    }
}

function simulateAPICall() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    customerId: 'CUST001',
                    bookingId: 'BK240320001',
                    date: '2024-03-20',
                    receiver: 'John Smith',
                    address: '123 Oxford Street, London, W1D 1DF',
                    amount: 45.99,
                    status: 'delivered'
                },
                {
                    customerId: 'CUST002',
                    bookingId: 'BK240319002',
                    date: '2024-03-19',
                    receiver: 'Emma Wilson',
                    address: '45 High Street, Manchester, M4 1BE',
                    amount: 32.50,
                    status: 'in-transit'
                },
                {
                    customerId: 'CUST003',
                    bookingId: 'BK240318003',
                    date: '2024-03-18',
                    receiver: 'David Brown',
                    address: '78 Queen Street, Edinburgh, EH2 1NE',
                    amount: 28.75,
                    status: 'pending'
                },
                {
                    customerId: 'CUST004',
                    bookingId: 'BK240317004',
                    date: '2024-03-17',
                    receiver: 'Sarah Johnson',
                    address: '92 Castle Road, Cardiff, CF10 1BS',
                    amount: 55.25,
                    status: 'delivered'
                },
                {
                    customerId: 'CUST005',
                    bookingId: 'BK240316005',
                    date: '2024-03-16',
                    receiver: 'Michael Davies',
                    address: '15 Victoria Square, Birmingham, B2 4BQ',
                    amount: 41.99,
                    status: 'delivered'
                }
            ]);
        }, 800);
    });
}

function filterBookings() {
    const searchTerm = document.getElementById('searchCustomerId').value.toLowerCase();
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    // Reset to first page when filtering
    currentPage = 1;

    filteredBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const matchesSearch =
            booking.customerId.toLowerCase().includes(searchTerm) ||
            booking.bookingId.toLowerCase().includes(searchTerm) ||
            booking.receiver.toLowerCase().includes(searchTerm) ||
            booking.address.toLowerCase().includes(searchTerm);
        const matchesDate = bookingDate >= startDate && bookingDate <= endDate;
        const matchesStatus = currentFilter === 'all' || booking.status === currentFilter;

        return matchesSearch && matchesDate && matchesStatus;
    });

    displayBookings();
    updatePagination();
}

function filterByStatus(status) {
    // Update selected status chip
    document.querySelectorAll('.status-chip').forEach(chip => {
        chip.classList.remove('selected');
    });
    document.querySelector(`.status-chip[onclick*="${status}"]`).classList.add('selected');

    currentFilter = status;
    filterBookings();
}

function displayBookings() {
    const container = document.getElementById('booking-data');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedBookings = filteredBookings.slice(start, end);

    if (filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="material-icons-round">search_off</i>
                <p>No bookings found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = paginatedBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-id">${booking.bookingId}</div>
                <span class="status-badge ${booking.status}">
                    <i class="material-icons-round">${getStatusIcon(booking.status)}</i>
                    ${capitalizeFirstLetter(booking.status)}
                </span>
            </div>
            <div class="booking-details">
                <div class="detail-group">
                    <div class="detail-label">Customer ID</div>
                    <div class="detail-value">${booking.customerId}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Receiver</div>
                    <div class="detail-value">${booking.receiver}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Booking Date</div>
                    <div class="detail-value">${formatDate(booking.date)}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">$${booking.amount.toFixed(2)}</div>
                </div>
            </div>
            <div class="detail-group" style="margin-bottom: 16px;">
                <div class="detail-label">Delivery Address</div>
                <div class="detail-value">${booking.address}</div>
            </div>
            <div class="booking-actions">
                <button class="action-btn secondary" onclick="viewDetails('${booking.bookingId}')">
                    <i class="material-icons-round">visibility</i>
                    View Details
                </button>
                <button class="action-btn primary" onclick="downloadInvoice('${booking.bookingId}')">
                    <i class="material-icons-round">receipt</i>
                    Download Invoice
                </button>
            </div>
        </div>
    `).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    document.getElementById('currentPage').textContent = `${currentPage} of ${totalPages}`;

    // Update button states
    document.querySelector('button[onclick="prevPage()"]').disabled = currentPage === 1;
    document.querySelector('button[onclick="nextPage()"]').disabled = currentPage === totalPages;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayBookings();
        updatePagination();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayBookings();
        updatePagination();
    }
}

function viewDetails(bookingId) {
    const booking = allBookings.find(b => b.bookingId === bookingId);
    if (booking) {
        showModal(`
            <h3>Booking Details</h3>
            <div class="booking-details">
                <div class="detail-group">
                    <div class="detail-label">Booking ID</div>
                    <div class="detail-value">${booking.bookingId}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Customer ID</div>
                    <div class="detail-value">${booking.customerId}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Booking Date</div>
                    <div class="detail-value">${formatDate(booking.date)}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="status-badge ${booking.status}">
                            ${capitalizeFirstLetter(booking.status)}
                        </span>
                    </div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Receiver</div>
                    <div class="detail-value">${booking.receiver}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Delivery Address</div>
                    <div class="detail-value">${booking.address}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">$${booking.amount.toFixed(2)}</div>
                </div>
            </div>
        `);
    }
}

function downloadInvoice(bookingId) {
    showToast('Downloading invoice...', 'info');
    setTimeout(() => {
        showToast('Invoice downloaded successfully!', 'success');
    }, 1500);
}

// Utility functions
function showLoadingState() {
    const container = document.getElementById('booking-data');
    container.innerHTML = `
        <div class="loading-state">
            <i class="material-icons-round rotating">refresh</i>
            <p>Loading bookings...</p>
        </div>
    `;
}

function showError(message) {
    const container = document.getElementById('booking-data');
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

function showToast(message, type = 'info') {
    let toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="material-icons-round">${type === 'success' ? 'check_circle' : 'info'}</i>
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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