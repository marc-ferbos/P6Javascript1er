async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const result = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (result.ok) {
    const data = await result.json();
    console.log(data);
        localStorage.setItem("token", data.token);
        /*window.location.href = "http://localhost:5500/";*/
    } else {
        alert(data.error);
    }
}

const loginform = document.getElementById("Loginform");

loginform.addEventListener("submit", (e) => {
    e.preventDefault();
login();
});

