document.addEventListener('DOMContentLoaded', function () {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("pickup-date").setAttribute("min", today);

    // Get username from localStorage
    const username = localStorage.getItem('officerUsername') || 'Officer';
    document.getElementById('username').textContent = username;
});

function searchBooking() {
    const bookingId = document.getElementById("booking-id").value.trim();
    const errorMessage = document.getElementById("error-message");
    const pickupForm = document.getElementById("pickup-form");
    const confirmationMessage = document.getElementById("confirmation-message");

    // Reset any previous states
    confirmationMessage.style.display = "none";
    errorMessage.style.display = "none";

    if (bookingId.length !== 12 || isNaN(bookingId)) {
        errorMessage.style.display = "block";
        pickupForm.style.display = "none";
        return;
    }

    // Simulate API call with loading state
    const searchButton = document.querySelector('.icon-button');
    searchButton.disabled = true;
    searchButton.innerHTML = '<i class="material-icons-round">hourglass_empty</i>';

    setTimeout(() => {
        errorMessage.style.display = "none";
        pickupForm.style.display = "block";
        searchButton.disabled = false;
        searchButton.innerHTML = '<i class="material-icons-round">search</i>';
    }, 1000);
}

function savePickupSchedule() {
    const pickupDate = document.getElementById("pickup-date").value;
    const pickupTime = document.getElementById("pickup-time").value;
    const confirmationMessage = document.getElementById("confirmation-message");
    const pickupForm = document.getElementById("pickup-form");

    if (!pickupDate || !pickupTime) {
        alert("Please select both pickup date and time.");
        return;
    }

    // Simulate API call with loading state
    const submitButton = document.querySelector('.primary-btn');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Scheduling...';

    setTimeout(() => {
        pickupForm.style.display = "none";
        confirmationMessage.style.display = "block";
        submitButton.disabled = false;
        submitButton.innerHTML = 'Schedule Pickup';

        // Clear the form
        document.getElementById("booking-id").value = '';
        document.getElementById("pickup-date").value = '';
        document.getElementById("pickup-time").value = '';
    }, 1500);
}

function resetForm() {
    document.getElementById("booking-id").value = '';
    document.getElementById("pickup-date").value = '';
    document.getElementById("pickup-time").value = '';
    document.getElementById("error-message").style.display = "none";
    document.getElementById("confirmation-message").style.display = "none";
    document.getElementById("pickup-form").style.display = "none";
} 