/**
 * Executes the main function once the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', main);

/**
 * Main function called when the page loads.
 * Initializes form validation.
 */
function main() {
    checkForm();
}

/**
 * Handles form validation and submission.
 * Displays an error message if the email or password is incorrect.
 */
function checkForm() {
    let form = document.querySelector("form");
    let errorMessageElement = document.createElement('div');
    errorMessageElement.classList.add('error-message');
    form.appendChild(errorMessageElement);

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        let mail = document.getElementById("mail").value;
        let password = document.getElementById("password").value;
        const formatMail = /^[a-z0-9-_.]+@[a-z0-9]+\.[a-z]{2,}$/;
        errorMessageElement.textContent = '';
        if (!formatMail.test(mail) || password === '') {
            errorMessageElement.textContent = "Email or password is incorrect";
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: mail,
                    password: password
                })
            });
        
            const result = await response.json();
        
            if (response.ok) {
                localStorage.setItem('authToken', result.token);
                window.location.href = 'index.html';
            } else {
                errorMessageElement.textContent = "Email or password is incorrect";
            }
        } catch (error) {
            errorMessageElement.textContent = "An error occurred. Please try again.";
        }
    });
}
