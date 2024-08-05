document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('#login');

    loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'connexion.html';
    });
});

