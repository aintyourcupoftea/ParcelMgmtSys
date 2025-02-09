let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('officerUsername') || 'Officer';
    document.getElementById('username').textContent = username;
    loadBookings();
});

function searchBookings() {
    const customerId = document.getElementById('searchCustomerId').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Reset to first page when searching
    currentPage = 1;
    loadBookings(customerId, startDate, endDate);
}

function loadBookings(customerId = '', startDate = '', endDate = '') {
    // Show loading state
    const tableBody = document.getElementById('booking-data');
    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="loading-state">
                <i class="material-icons-round rotating">refresh</i>
                Loading bookings...
            </td>
        </tr>
    `;

    // Simulate API call
    setTimeout(() => {
        // Sample data - replace with actual API call
        const bookings = [
            {
                customerId: '123',
                bookingId: 'BK001',
                date: '2024-02-20',
                receiver: 'John Doe',
                address: '123 Main St, City',
                amount: '$50',
                status: 'Delivered'
            },
            // Add more sample data as needed
        ];

        displayBookings(bookings);
        updatePagination(bookings.length);
    }, 1000);
}

function displayBookings(bookings) {
    const tableBody = document.getElementById('booking-data');
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="material-icons-round">search_off</i>
                    No bookings found
                </td>
            </tr>
        `;
        return;
    }

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.customerId}</td>
            <td>${booking.bookingId}</td>
            <td>${booking.date}</td>
            <td>${booking.receiver}</td>
            <td>${booking.address}</td>
            <td>${booking.amount}</td>
            <td>
                <span class="status-badge ${booking.status.toLowerCase()}">
                    ${booking.status}
                </span>
            </td>
            <td>
                <button class="icon-button" onclick="viewDetails('${booking.bookingId}')">
                    <i class="material-icons-round">visibility</i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    document.getElementById('currentPage').textContent = currentPage;

    // Disable/enable pagination buttons
    document.querySelector('button[onclick="prevPage()"]').disabled = currentPage === 1;
    document.querySelector('button[onclick="nextPage()"]').disabled = currentPage === totalPages;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadBookings();
    }
}

function nextPage() {
    currentPage++;
    loadBookings();
}

function viewDetails(bookingId) {
    // Implement view details functionality
    console.log(`Viewing details for booking: ${bookingId}`);
} 