let currentPage = 1;
function logout() {
    alert("Logged out successfully");
    window.location.href = "login.html";
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
function loadBookings() {
    document.getElementById("booking-data").innerHTML = `<tr><td>123</td><td>456</td><td>2025-02-05</td><td>John Doe</td><td>123 Street</td><td>$50</td><td>Delivered</td></tr>`;
}
document.addEventListener("DOMContentLoaded", loadBookings);