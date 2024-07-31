document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('#login');

    loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        displayLoginForm();
    });
});

function displayLoginForm() {
    const mainContent = document.querySelector('main');
    const body =document.querySelector('body');

    body.classList.add('login-background-color');

    mainContent.innerHTML = `
        <section id="login-section">
            <h2>Log In</h2>
            <div class="login-input">
                <form action="#" method="post">
                    <label for="username">E-mail</label>
                    <input type="text" id="mail" name="mail">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" name="password">
                    <button type="submit">Se connecter</button>
                    <a>Mot de passe oublié</a>
            </div>
                
            </form>
        </section>
    `;
}
