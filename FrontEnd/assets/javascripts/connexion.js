document.addEventListener('DOMContentLoaded', main);


function main() {
    checkForm();
    removeTokenForLogout();
}

function checkForm() {
    let form = document.querySelector("form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        let mail = document.getElementById("mail").value;
        let password = document.getElementById("password").value;
        const formatMail = /^[a-z0-9-_.]+@[a-z0-9]+\.[a-z]{2,}$/;

        console.log(mail, password); 

        if (formatMail.test(mail) && password !== '') {
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
                console.log(result);
                
                if (response.ok) {
                    console.log("Login successful");
                    localStorage.setItem('authToken', result.token);
                    console.log("Token stored in local storage");
                    window.location.href = 'index_admin.html';

                    
                } else {
                    console.log("Login failed", result);
                }
            } catch (error) {
                console.error("Error during fetch", error);
            }
        } else {
            console.log("Invalid email or empty password");
        }
    });
}

function removeTokenForLogout() {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            localStorage.removeItem('authToken');
            window.location.href = 'index.html'; 
        });
    }
}
