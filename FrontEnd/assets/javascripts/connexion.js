
document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('#login');

    loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'connexion.html';
    });
});

let form = document.querySelector("form")
let balisemail = document.getElementById("mail")


form.addEventListener("submit", (event) => {
    event.preventDefault()
    let mail = document.getElementById("mail");
    let password = document.getElementById("password")
    console.log(mail.value, password.value)

})