
let works = [];
const galleryContainer = document.querySelector('.gallery');

fetch("http://localhost:5678/api/works")
.then(reponse => reponse.json()) /* convertion de la réponse en json */
/* data = donnees de la réponse */
/* table à la place de log permet d'afficher un tableau dans la console */
/* Ajout des travaux à la galerie */

.then(data => {

    works = data;

    /* On parcours les données des travaux et on les ajoutent à la galerie */
    data.forEach(travail => {
        createDOM(travail);
    });
    });
    function createDOM(travail) {
        const figure = document.createElement('figure');

      /* On créer un élément d'image pour afficher l'image et le titre */
      const image = document.createElement('img');
      image.src = travail.imageUrl;
      image.alt = travail.title;

      /* On créer un élément de légende pour afficher le titre du travail */
      const caption = document.createElement('figcaption');
      caption.textContent = travail.title;

      /* On ajoute l'image et la légende à la figure */
      figure.appendChild(image);
      figure.appendChild(caption);

      /* On ajoute la figure à la galerie */
      galleryContainer.appendChild(figure);
    }
    /* Ajout des catégories à la liste */

    fetch("http://localhost:5678/api/categories")
    .then(reponse => reponse.json()) /* convertion de la réponse en json */

    .then(data => {
        const container = document.querySelector('.ButtonContainer');

        data.forEach(categorie => {
                
            const button = document.createElement('button');
            button.textContent = categorie.name;
            button.addEventListener('click', () => {

                galleryContainer.innerHTML = "";
                works.forEach(travail => {
                    if (travail.categoryId === categorie.id) {
                        createDOM(travail);
                    }
                });
            });
            container.appendChild(button);
        });
    });
