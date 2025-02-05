document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Always prevent default to handle submission manually

    let valid = true;
    const userId = document.getElementById('userId');
    const password = document.getElementById('password');
    const userIdError = document.getElementById('userIdError');
    const passwordError = document.getElementById('passwordError');

    // Reset errors
    userIdError.textContent = '';
    passwordError.textContent = '';

    // Remove any previous error styles
    userId.style.borderColor = '';
    password.style.borderColor = '';

    // Validate User ID
    if (userId.value.length < 5 || userId.value.length > 20) {
        userIdError.textContent = 'User ID must be between 5 and 20 characters';
        userId.style.borderColor = 'var(--error-color)';
        valid = false;
    }

    // Validate Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{1,30}$/;
    if (!passwordRegex.test(password.value)) {
        passwordError.textContent = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character';
        password.style.borderColor = 'var(--error-color)';
        valid = false;
    }

    if (valid) {
        // Add loading state to button
        const button = event.target.querySelector('button');
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Signing in...';

        // Simulate API call (replace with actual authentication)
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
            // Add your authentication logic here
        }, 1500);
    }
});

// Add input focus effects
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--accent-color)';
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.style.borderColor = 'var(--input-border)';
        }
    });
});