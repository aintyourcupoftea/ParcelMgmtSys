document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let valid = true;
    const userId = document.getElementById('userId');
    const password = document.getElementById('password');
    const userIdError = document.getElementById('userIdError');
    const passwordError = document.getElementById('passwordError');

    // Reset errors
    userIdError.textContent = '';
    passwordError.textContent = '';

    // Validate User ID
    if (userId.value.length < 5 || userId.value.length > 20) {
        userIdError.textContent = 'User ID must be between 5 and 20 characters';
        valid = false;
    }

    // Validate Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{1,30}$/;
    if (!passwordRegex.test(password.value)) {
        passwordError.textContent = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character';
        valid = false;
    }

    if (valid) {
        // Show success screen
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('successScreen').style.display = 'block';

        // Display user details
        document.getElementById('displayUsername').textContent = userId.value;
        document.getElementById('displayEmail').textContent = document.getElementById('email').value;
    }
});