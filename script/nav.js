// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Function to get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookie('token') || localStorage.getItem('jwtToken');
    const guestButtons = document.getElementById('guestButtons');
    const userSection = document.getElementById('userSection');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');

    if (token) {
        // User is logged in
        guestButtons.classList.add('d-none');
        userSection.classList.remove('d-none');

        // You might want to fetch user data from your backend if not stored
        // For now, we'll check localStorage for user data
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.name || user.username) {
                    usernameDisplay.textContent = user.name || user.username;
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    } else {
        // User is not logged in
        guestButtons.classList.remove('d-none');
        userSection.classList.add('d-none');
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Clear token from cookie and localStorage
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
            window.location.href = '/index.html'; // Redirect to home after logout
        });
    }
});