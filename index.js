
let works = [];
const galleryContainer = document.querySelector('.gallery');
const modalContainer = document.querySelector('.modalcontainer');

fetch("http://localhost:5678/api/works")
.then(reponse => reponse.json()) /* convertion de la réponse en json */
/* data = donnees de la réponse */
/* table à la place de log permet d'afficher un tableau dans la console */
/* Ajout des travaux à la galerie */

.then(data => {

    works = data;

    /* On parcours les données des travaux et on les ajoutent à la galerie */
    data.forEach(travail => {
        createDOM(travail, galleryContainer);
        createDOM(travail, modalContainer, true);
    });
});
function createDOM(travail, container, modale = false) {
    const figure = document.createElement('figure');
        

    /* On créer un élément d'image pour afficher l'image et le titre */
    const image = document.createElement('img');
    image.src = travail.imageUrl;
    image.alt = travail.title;
    figure.appendChild(image);
    /* On créer un élément de légende pour afficher le titre du travail */
    if (modale === false)  {
        const caption = document.createElement('figcaption');
        caption.textContent = travail.title;
        figure.appendChild(caption);
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
                        createDOM(travail); /* On l'ajoute à la galerie */
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
            createDOM(travail); /* On les ajoute à la galerie */
        });
    });



    /* Ajout de la modale de connexion */

    /*const modal = document.getElementById('modal');
    const modalButton = document.getElementById('modal-content');
    const closeButton = document.getElementById('js-modale-close');

    modalButton.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
    });*/

    let modal = null /* On initialise la variable modale */

    const openModal = function (e) {
        e.preventDefault()
        const target = document.querySelector(e.target.getAttribute('href'))
        target.style.display = "block"
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal', 'true')
        modal = target /* On stocke la modale dans une variable */
        modal.addEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal) /* Fermeture de la modale au clic sur la croix */
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation) /* Fonction pour empêcher la fermeture de la modale au clic sur le contenu de celle-ci */
    }

    const closeModal = function (e) {
        if (modal === null) return
        e.preventDefault()
        modal.style.display = "none"
        modal.setAttribute('aria-hidden', 'true')
        modal.removeAttribute('aria-modal')
        modal.removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
        modal = null
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