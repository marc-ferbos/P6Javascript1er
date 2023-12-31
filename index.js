
let works = []; /* On créer un tableau pour stocker les travaux */
const galleryContainer = document.querySelector('.gallery');
const modalContainer = document.querySelector('.modalcontainer');

fetch("http://localhost:5678/api/works")
.then(reponse => reponse.json()) /* convertion de la réponse en json */
/* data = donnees de la réponse */
/* table à la place de log permet d'afficher un tableau dans la console */
/* Ajout des travaux à la galerie */

.then(data => {

    works = data; /* On stocke les données des travaux dans la variable works */

    /* On parcours les données des travaux et on les ajoutent à la galerie */
    data.forEach(travail => { /* Pour chaque travail on créer un élément de figure */
        createDOM(travail, galleryContainer); /* On ajoute le travail à la galerie */
        createDOM(travail, modalContainer, true); /* On ajoute le travail à la modale */
    });
});
function createDOM(travail, container, modale = false) { /* Fonction pour créer les éléments de la galerie et de la modale */ 
    const figure = document.createElement('figure'); /* On créer un élément de figure pour afficher le travail */


    const image = document.createElement('img'); /* On créer un élément d'image pour afficher l'image et le titre */
    image.src = travail.imageUrl; /* On ajoute l'url de l'image */
    image.alt = travail.title; /* On ajoute le titre de l'image */
    figure.appendChild(image); /* On ajoute l'image à la figure */

    if (modale === true) { /* Si on est dans la modale */
        const trashIcon = document.createElement('i'); /* On créer un élément i pour afficher l'icône de suppression */
        trashIcon.classList.add('fa-solid', 'fa-trash-can'); /* On ajoute les classes à l'icône de suppression */
        trashIcon.addEventListener('click', () => { /* On ajoute un évènement au clic sur l'icône de suppression */

        /*console.log(localStorage.getItem('token'));*/

            fetch(`http://localhost:5678/api/works/${travail.id}`, { /* On envoie une requête de suppression au serveur */
                method: 'DELETE',
                headers: { 'Authorization' : `Bearer ${localStorage.getItem('token')}`} /* On ajoute le token dans le header de la requête */
            })
            .then(data => {
                    figure.remove(); /* On supprime le travail de la modale */
                    const galleryImage = document.querySelector(`[data-id="${travail.id}"]`); /* On récupère le travail dans la galerie */
                    galleryImage.remove(); /* On supprime le travail de la galerie */
            })
        });
        figure.appendChild(trashIcon); /* On ajoute l'icône de suppression à la figure */
    }

    if (modale === false)  { /* Si on est pas dans la modale et qu'on est dans la galerie */
        const caption = document.createElement('figcaption'); /* On créer un élément de légende pour afficher le titre du travail */
        caption.textContent = travail.title; /* On ajoute le titre du travail à la légende */
        figure.appendChild(caption); /* On ajoute la légende à la figure */
        figure.dataset.id = travail.id; /* On ajoute l'id du travail à la figure */
    }

    /* On ajoute la figure à la galerie */
    container.appendChild(figure);
}
    /* Ajout des catégories à la liste */
    const allWorksButton = document.getElementById('Tous');
    const buttons = [] /* On créer un tableau pour stocker les boutons */
    buttons.push(allWorksButton); /* On ajoute le bouton Tous au tableau */


    fetch("http://localhost:5678/api/categories")
    .then(reponse => reponse.json()) /* convertion de la réponse en json */

    .then(data => {
        const container = document.querySelector('.ButtonContainer');

        data.forEach(categorie => {
                
            const button = document.createElement('button');/* Pour chaque élément de la liste on créer un bouton */
            button.textContent = categorie.name; /* On ajoute le nom de la catégorie au bouton */
            button.addEventListener('click', () => {

                galleryContainer.innerHTML = "";/* On vide la galerie */
                works.forEach(travail => { /* On parcours les travaux */
                    if (travail.categoryId === categorie.id) { /* Si le travail correspond à la catégorie */
                        createDOM(travail, galleryContainer); /* On l'ajoute à la galerie */
                    }
                });
            });buttons.push(button); /* On ajoute le bouton au tableau */
            container.appendChild(button);/* On ajoute le bouton à la liste */
        });
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(button => {
                    button.classList.remove('active'); /* On supprime la classe active de tous les boutons */
                });
                button.classList.add('active'); /* On ajoute la classe active au bouton cliqué */
            });
        });
    });

    /* Ajout du filtre Tous */

    allWorksButton.addEventListener('click', () => {
        galleryContainer.innerHTML = "";/* On vide la galerie */
        works.forEach(travail => { /* On parcours les travaux */
            createDOM(travail, galleryContainer); /* On les ajoute à la galerie */
        });
    });

    /* Ajout de la modale */

    let modal = null /* On initialise la variable modale */

    const openModal = function (e) {
        e.preventDefault()
        modal = document.querySelector(e.target.getAttribute('href'))
        modal.style.display = "block" /* On affiche la modale */
        modal.removeAttribute('aria-hidden') /* On supprime l'attribut aria-hidden */
        modal.setAttribute('aria-modal', 'true') /* On ajoute l'attribut aria-modal */
        modal.addEventListener('click', closeModal) /* Fermeture de la modale au clic sur le fond */
        modal.querySelector('.js-modale-close').addEventListener('click', closeModal) /* Fermeture de la modale au clic sur la croix */
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation) /* Fonction pour empêcher la fermeture de la modale au clic sur le contenu de celle-ci */
    }

    const closeModal = function (e = null) {
        if (modal === null) return /* Si la modale est null on arrête la fonction */
        if(e){e.preventDefault()} /* On empêche le comportement par défaut */
        modal.style.display = "none" /* On cache la modale */
        modal.setAttribute('aria-hidden', 'true') /* On ajoute l'attribut aria-hidden */
        modal.removeAttribute('aria-modal') /* On supprime l'attribut aria-modal */
        modal.removeEventListener('click', closeModal) /* Fermeture de la modale au clic sur le fond */
        modal.querySelector('.js-modale-close').removeEventListener('click', closeModal) /* Fermeture de la modale au clic sur la croix */
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation) /* Fonction pour empêcher la fermeture de la modale au clic sur le contenu de celle-ci */
        modal = null /* On réinitialise la variable modale */
    }

    const stopPropagation = function (e) { // Fonction pour empêcher la fermeture de la modale au clic sur le contenu de celle-ci
        e.stopPropagation()
    }

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal)
    })

    window.addEventListener('keydown', function (e) { // Fermeture de la modale avec la touche Echap
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e) 
        }
    })

    // Apparition de la deuxième modale et disparition de la première

    const ajouterPhoto = document.getElementById('ajouterPhoto');
    const premiereModale = document.getElementById('modal1');
    const deuxiemeModale = document.getElementById('ajout');

    ajouterPhoto.addEventListener('click', (e) => {
        e.preventDefault();

        premiereModale.style.display = "none";
        premiereModale.setAttribute('aria-hidden', 'true');

        deuxiemeModale.style.display = "block";
        deuxiemeModale.removeAttribute('aria-hidden');
        deuxiemeModale.setAttribute('aria-modal', 'true');
    }
    );

    // Revenir sur la première modale au click sur la flèche de la 2ème modale

    const flecheReturn = document.querySelector('.js-back-to-modal1');
    flecheReturn.addEventListener('click', (e) => {
        e.preventDefault();

        premiereModale.style.display = "block";
        premiereModale.removeAttribute('aria-hidden');
        premiereModale.setAttribute('aria-modal', 'true');

        deuxiemeModale.style.display = "none";
        deuxiemeModale.setAttribute('aria-hidden', 'true');
    }
    );

    //Affichage du preview de l'image sur la 2ème modale

    const fileInput = document.querySelector('#file');
    const previewImage = document.getElementById('previewImage');
    const Imageprev = document.getElementById('Imageprev');
    const prevarea = document.querySelector('.prevarea');

    fileInput.addEventListener('change', (e) => {
        const selectedFile = e.target.files[0]; // On récupère le fichier sélectionné
        document.querySelector('.banner').style.display = "none"

        if (selectedFile) { 
            const reader = new FileReader(); // On créer un objet FileReader
            reader.readAsDataURL(selectedFile); // On lit le fichier sélectionné
            reader.addEventListener('load', () => {
                previewImage.src = reader.result; //On affiche le preview de l'image
                previewImage.style.display = "block"
            });
        }
        else {
            previewImage.src = ""; //On vide le preview
        }
    }
    );


    // On créer une fonction pour effectuer la requête d'ajout de travail

function ajouterTravail(nouveauTravail) {

    const titleValue = nouveauTravail.title;
    const categoryValue = nouveauTravail.category;
    const fileValue = nouveauTravail.file;

    const workData = new FormData(); // On créer un objet data pour envoyer le fichier
    workData.append('title', titleValue); // On ajoute les données du formulaire à l'objet data
    workData.append('category', categoryValue);
    workData.append('image', fileValue);

    fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: workData // On envoie le FormData dans le body de la requête
    })
    .then(reponse => reponse.json())
    .then(data => {
            // Travail ajouté avec succès
            closeModal(); // Fermez la deuxième modal
            createDOM(data, galleryContainer); // On ajoute le travail à la galerie
            createDOM(data, modalContainer, true); // On ajoute le travail à la modale
    })
    .catch(error => {
            alert ('Erreur lors de l\'ajout du travail');
    });
}







const token = localStorage.getItem('token');
const loginLink = document.querySelector('a[href="connexion.html"]'); // Sélectionnez le lien "login"



if (token) {
    
    loginLink.textContent = 'logout';

    loginLink.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'connexion.html';

        // On re actualise la page actuelle pour le changement de texte du lien
        location.reload();
    });
} else {
    loginLink.textContent = 'login';
}


if (token) {

    const BarreBl = document.querySelector('.Barrebl');
    const JsModal = document.querySelector('.modifier');
    const IconModif2 = document.querySelector('.fa-regular.fa-pen-to-square');
    const IconModif1 = document.querySelector('.fa-solid.fa-pen-to-square');

    BarreBl.style.display = 'block';
    JsModal.style.display = 'block';
    IconModif2.style.display = 'block';
    IconModif1.style.display = 'block';
}







// On ajoute un événement de soumission du formulaire dans la deuxième modal

const ButtonValider = document.getElementById('ValidButton');
const titreInput = document.querySelector('#title');
const categorieInput = document.querySelector('#categorie');
const previewImage2 = document.getElementById('previewImage');

ButtonValider.addEventListener('click', (e) => {
    e.preventDefault();

    /* On récupère les valeurs des champs */
    const titreValue = titreInput.value.trim(); /* "trim()" permet de supprimer les espaces avant et après la chaîne de caractères */
    const categorieValue = categorieInput.value.trim();
    const fileValue = fileInput.files[0];

    /* On vérifie que les champs ne sont pas vides */
    if  (!titreValue || !categorieValue || !fileValue) {
            alert ("Veuillez remplir tous les champs");
            return;
        } else {
            /* On créer un objet travail avec les données du formulaire */
            const nouveauTravail = {
                file: fileValue,
                title: titreValue,
                category: categorieValue,
            };

            /* On effectue la requête d'ajout de travail */
            ajouterTravail(nouveauTravail);
        }
    });

    /* Ajout des catégories à la liste déroulante */

fetch('http://localhost:5678/api/categories')
.then(reponse => reponse.json())
.then(categories => {

    categories.forEach(categorie => { /* Pour chaque catégorie on créer un élément option */
        const option = document.createElement('option'); /* On créer un élément button pour afficher la catégorie */
        
        option.value = categorie.id; /* On ajoute l'id de la catégorie à l'option */
        option.textContent = categorie.name; /* On ajoute le nom de la catégorie à l'option */
        categorieInput.appendChild(option); /* On ajoute l'option à la liste */
    })
})

.catch(error => {
    alert('Erreur lors du chargement des catégories');
});
