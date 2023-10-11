
let works = [];
const galleryContainer = document.querySelector('.gallery');
const modalContainer = document.querySelector('.modalcontainer');
const buttons = document.querySelectorAll('.ButtonContainer button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

fetch("http://localhost:5678/api/works")
.then(reponse => reponse.json()) /* convertion de la réponse en json */
/* data = donnees de la réponse */
/* table à la place de log permet d'afficher un tableau dans la console */
/* Ajout des travaux à la galerie */

.then(data => {

    works = data;

    /* On parcours les données des travaux et on les ajoutent à la galerie */
    data.forEach(travail => { /* Pour chaque travail on créer un élément de figure */
        createDOM(travail, galleryContainer); /* On ajoute le travail à la galerie */
        createDOM(travail, modalContainer, true); /* On ajoute le travail à la modale */
    });
});
function createDOM(travail, container, modale = false) { /* Fonction pour créer les éléments de la galerie et de la modale */ 
    const figure = document.createElement('figure'); /* On créer un élément de figure pour afficher le travail */

    /* On créer un élément d'image pour afficher l'image et le titre */
    const image = document.createElement('img'); /* On créer un élément d'image pour afficher l'image et le titre */
    image.src = travail.imageUrl; /* On ajoute l'url de l'image */
    image.alt = travail.title; /* On ajoute le titre de l'image */
    figure.appendChild(image); /* On ajoute l'image à la figure */

    if (modale === true) { /* Si on est dans la modale */
        const trashIcon = document.createElement('i'); /* On créer un élément i pour afficher l'icône de suppression */
        trashIcon.classList.add('fa-solid', 'fa-trash-can'); /* On ajoute les classes à l'icône de suppression */
        trashIcon.addEventListener('click', () => { /* On ajoute un évènement au clic sur l'icône de suppression */

        console.log(localStorage.getItem('token'));

            fetch(`http://localhost:5678/api/works/${travail.id}`, { /* On envoie une requête de suppression au serveur */
                method: 'DELETE',
                headers: { 'Authorization' : `Bearer ${localStorage.getItem('token')}`} /* On ajoute le token dans le header de la requête */
            })
            .then(reponse => reponse.json()) /* convertion de la réponse en json */
            .then(data => {
                if (data.status === 200) { /* Si la suppression est un succès */
                    figure.remove(); /* On supprime le travail de la modale */
                    const galleryImage = document.querySelector(`[data-id="${travail.id}"]`); /* On récupère le travail dans la galerie */
                    galleryImage.remove(); /* On supprime le travail de la galerie */
                }
            }
            );
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
            });
            container.appendChild(button);/* On ajoute le bouton à la liste */
        });
    });

    /* Ajout du filtre Tous */

    const allWorksButton = document.getElementById('Tous');
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

    const closeModal = function (e) {
        if (modal === null) return /* Si la modale est null on arrête la fonction */
        e.preventDefault() /* On empêche le comportement par défaut */
        modal.style.display = "none" /* On cache la modale */
        modal.setAttribute('aria-hidden', 'true') /* On ajoute l'attribut aria-hidden */
        modal.removeAttribute('aria-modal') /* On supprime l'attribut aria-modal */
        modal.removeEventListener('click', closeModal) /* Fermeture de la modale au clic sur le fond */
        modal.querySelector('.js-modale-close').removeEventListener('click', closeModal) /* Fermeture de la modale au clic sur la croix */
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation) /* Fonction pour empêcher la fermeture de la modale au clic sur le contenu de celle-ci */
        modal = null /* On réinitialise la variable modale */
    }

    const stopPropagation = function (e) { /* Fonction pour empêcher la fermeture de la modale au clic sur le contenu de celle-ci */
        e.stopPropagation()
    }

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal)
    })

    window.addEventListener('keydown', function (e) { /* Fermeture de la modale avec la touche Echap */
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e) 
        }
    })

    /* Apparition de la deuxième modale et disparition de la première */

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

