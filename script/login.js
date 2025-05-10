
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('loginButton');
    const errorElement = document.getElementById('errorMessage');

    // Clear previous errors
    errorElement.classList.add('d-none');

    // Disable button during request
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store the JWT token
        if (data.token) {
            // Using localStorage (persists until cleared)
            localStorage.setItem('jwtToken', data.token);

            // window.location.href = '/index.html';
            const userData = await fetch(`http://localhost:8080/api/users/email/${email}`, {
                method: "GET"
            })
            const user = await userData.json();
            console.log(user);
            window.location.href = '/screens/seller/home.html';
            if (user.role === 'USER') {
                window.location.href = '/index.html';
            } else if (user.role === 'ADMIN') {
                window.location.href = '/screens/seller/home.html';
            }
        } else {
            throw new Error('No token received');
        }

    } catch (error) {
        console.error('Login error:', error);
        errorElement.textContent = error.message;
        errorElement.classList.remove('d-none');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});