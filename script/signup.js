document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;

    const signupButton = document.getElementById('signup-button');
    signupButton.disabled = true;
    signupButton.textContent = 'Signing up...';

    try {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phoneNumber,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Success - redirect to another page
            window.location.href = '/screens/auth/signin.html';
            alert('Signup successful');
        } else {
            // Show error message
            document.getElementById('error-message').textContent = data.message || 'Signup failed';
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('error-message').textContent = 'Network error. Please try again.' + error.message;
        document.getElementById('error-message').style.display = 'block';
    } finally {
        signupButton.disabled = false;
        signupButton.textContent = 'Sign Up';
    }
});