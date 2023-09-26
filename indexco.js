async function login() { /*On crée une fonction asynchrone pour envoyer la requête au serveur*/
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const emailerror = document.getElementById("emailerror");
    const passworderror = document.getElementById("passworderror");

    emailerror.textContent = "Email incorrect";
    passworderror.textContent = "Mot de passe incorrect";

    if (email === "" || password === "") {/*On vérifie que les champs email et password ne sont pas vides*/
        alert("Veuillez remplir tous les champs");
        return; /*On arrête la fonction si l'un des deux est vide*/
    }

    if (!email.includes("@")) { /* On vérifie que l'email est bien un email*/
        alert("Veuillez entrer un email valide");
        return;
    }

    if (!email || !password) { /*On vérifie que les champs email et password ne sont pas videsou undéfinisavec le "!"*/
        if (!email) {
            emailerror.textContent = "Veuillez entrer un email valide";
        }
        if (!password) {
            passworderror.textContent = "Mot de passe incorrect";
        }
        return;
    }

    /* Si tous les champs sont remplis, on envoie la requête au serveur */
    const result = await fetch("http://localhost:5678/api/users/login", {/*await équivaut à .then()*/
        method: "POST",
        headers: { /*On précise le type de données envoyées au serveur*/
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (result.ok) { /*Si la requête est ok, on récupère le token*/
    const data = await result.json();
    console.log(data);
        localStorage.setItem("token", data.token);
        /*window.location.href = "http://localhost:5500/";*/
    } else {
        alert("Identifiant ou mot de passe incorrect. Veuillez réessayer.");
    }
}

const loginform = document.getElementById("Loginform");

loginform.addEventListener("submit", (e) => { /*On écoute l'évènement submit du formulaire*/
    e.preventDefault(); /*On empêche le comportement par défaut du formulaire*/
login();
});
