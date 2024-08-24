document.addEventListener('DOMContentLoaded', main);


function main() {
    checkForm();
}

function checkForm() {
    let form = document.querySelector("form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        let mail = document.getElementById("mail").value;
        let password = document.getElementById("password").value;
        const formatMail = /^[a-z0-9-_.]+@[a-z0-9]+\.[a-z]{2,}$/;

        console.log(mail, password); 
        if (!formatMail.test(mail) || password === '') {
            console.log("Invalid email or empty password");
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
                console.error("Login failed", result);  
            }
        } catch (error) {
            console.error("Error during fetch", error);
        }
    });
}


