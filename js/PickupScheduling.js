function searchBooking() {
    let bookingId = document.getElementById("booking-id").value.trim();
    let errorMessage = document.getElementById("error-message");
    let pickupForm = document.getElementById("pickup-form");

    if (bookingId.length !== 12 || isNaN(bookingId)) {
        errorMessage.style.display = "block";
        pickupForm.style.display = "none";
        return;
    }

    errorMessage.style.display = "none";
    pickupForm.style.display = "block";

 
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("pickup-date").setAttribute("min", today);
}

function savePickupSchedule() {
    let pickupDate = document.getElementById("pickup-date").value;
    let pickupTime = document.getElementById("pickup-time").value;
    let confirmationMessage = document.getElementById("confirmation-message");

    if (!pickupDate || !pickupTime) {
        alert("Please select both pickup date and time.");
        return;
    }

    confirmationMessage.style.display = "block";
}