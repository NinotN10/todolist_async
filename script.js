const saisieTache = document.getElementById('taskInput')
const ajouterTache = document.getElementById('addTask')
const saisieRecherche = document.getElementById('searchInput')
const listeTaches = document.getElementById('taskList')
const saisieCategorie = document.getElementById('categoryInput')
const ajouterCategorie = document.getElementById('addCategory')
const categorieDropdown = document.getElementById('categoryDropdown')
const deleteCategoryDropdown = document.getElementById('deleteCategoryDropdown')


/**
 * Sauvegarde les catégories dans le localStorage.
 * @param {Array<string>} categories - Tableau des catégories.
 */
function sauvegarderCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories))
}

/**
 * Sauvegarde les tâches dans le localStorage.
 * @param {Array<Object>} taches - Tableau des tâches.
 */
function sauvegarderTaches(taches) {
  localStorage.setItem('tasks', JSON.stringify(taches))
}

/**
 * Charge les catégories du localStorage.
 * @returns {Array<string>} Tableau des catégories.
 */
function chargerCategories() {
  return JSON.parse(localStorage.getItem('categories')) || []
}

/**
 * Charge les tâches du localStorage.
 * @returns {Array<Object>} Tableau des tâches.
 */
function chargerTaches() {
  return JSON.parse(localStorage.getItem('tasks')) || []
}


/**
 * Affiche les catégories dans les éléments déroulants.
 * @param {Array<string>} categories - Tableau des catégories.
 */
function afficherCategories(categories) {
  categorieDropdown.innerHTML = ''
  filterCategoryDropdown.innerHTML = ''
  deleteCategoryDropdown.innerHTML = '' // Ajoutez cette ligne

  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.innerText = 'Aucune catégorie'
  filterCategoryDropdown.appendChild(defaultOption.cloneNode(true))
  categorieDropdown.appendChild(defaultOption)
  deleteCategoryDropdown.appendChild(defaultOption.cloneNode(true)) // Ajoutez cette ligne

  categories.forEach((categorie, index) => {
    const option = document.createElement('option')
    option.value = categorie
    option.innerText = categorie
    filterCategoryDropdown.appendChild(option.cloneNode(true))
    categorieDropdown.appendChild(option)
    deleteCategoryDropdown.appendChild(option.cloneNode(true)) // Ajoutez cette ligne
  })
}


/**
 * Crée et renvoie un élément HTML représentant une tâche.
 * @param {Object} tache - Objet représentant une tâche.
 * @param {number} index - Index de la tâche dans le tableau des tâches.
 * @returns {HTMLElement} Elément HTML représentant une tâche.
 */
function afficherTache(tache, index) {
  const divTache = document.createElement('div')
  divTache.id = `task-${index}`
  divTache.classList.add('bg-light', 'border', 'rounded', 'p-2', 'mb-3', 'd-flex', 'justify-content-between', 'align-items-center')

  const checkboxTache = document.createElement('input')
  checkboxTache.type = 'checkbox'
  checkboxTache.id = `task-checkbox-${index}`
  checkboxTache.classList.add('form-check-input', 'me-2')

  const etiquetteTache = document.createElement('label')
  etiquetteTache.htmlFor = `task-checkbox-${index}`
  etiquetteTache.classList.add('d-flex', 'align-items-center', 'gap-2', 'w-100')

  const titreTache = document.createElement('h2')
  titreTache.innerText = tache.text;
  titreTache.id = `task-title-${index}`
  titreTache.classList.add('me-auto')

  const editerTache = document.createElement('button')
  editerTache.innerText = 'Éditer'
  editerTache.id = `edit-${index}`
  editerTache.classList.add('btn', 'btn-primary')

  const supprimerTache = document.createElement('button')
  supprimerTache.innerText = 'Supprimer'
  supprimerTache.id = `delete-${index}`
  supprimerTache.classList.add('btn', 'btn-danger')

  etiquetteTache.appendChild(checkboxTache)
  etiquetteTache.appendChild(titreTache)
  etiquetteTache.appendChild(editerTache)
  etiquetteTache.appendChild(supprimerTache)

  divTache.appendChild(etiquetteTache);

  editerTache.addEventListener('click', () => {
    const nouveauTexte = prompt('Modifier la tâche', tache.text)
    if (nouveauTexte) {
      tache.text = nouveauTexte
      sauvegarderTaches(taches)
      afficherTaches(taches)
    }
  })

  supprimerTache.addEventListener('click', () => {
    taches = taches.filter(t => t !== tache)
    sauvegarderTaches(taches)
    afficherTaches(taches)
  })
  return divTache
}

/**
 * Supprime la catégorie sélectionnée et toutes les tâches associées.
 * Sauvegarde les catégories et les tâches mises à jour, puis affiche les listes mises à jour.
 */
function supprimerCategorie() {
  const categorieASupprimer = document.getElementById('deleteCategoryDropdown').value; // Utilisez 'deleteCategoryDropdown' ici

  if (categorieASupprimer) {
    // Supprimer la catégorie
    categories = categories.filter(categorie => categorie !== categorieASupprimer);
    sauvegarderCategories(categories);
    afficherCategories(categories);

    // Supprimer les tâches associées à la catégorie
    taches = taches.filter(tache => tache.categorie !== categorieASupprimer);
    sauvegarderTaches(taches);
    afficherTaches(taches);
  }
}


/**
 * Affiche les tâches dans la liste des tâches.
 * @param {Array<Object>} taches - Tableau des tâches.
 */
function afficherTaches(taches) {
  listeTaches.innerHTML = ''
  taches.forEach((tache, index) => {
    listeTaches.appendChild(afficherTache(tache, index))
  })
}

/**
 * Filtre les tâches en fonction du texte de recherche et de la catégorie sélectionnée,
 * puis affiche les tâches filtrées.
 */
function filtrerTaches() {
  const texteRecherche = saisieRecherche.value.trim().toLowerCase()
  const categorieRecherche = filterCategoryDropdown.value.toLowerCase()
  const tachesFiltrees = taches.filter(tache =>
    tache.text.toLowerCase().includes(texteRecherche) &&
    (!tache.categorie || tache.categorie.toLowerCase().includes(categorieRecherche))
  )
  afficherTaches(tachesFiltrees)
}


/**
 * Ajoute une nouvelle catégorie à la liste des catégories si elle n'existe pas déjà.
 * Sauvegarde les catégories et affiche la liste des catégories mise à jour.
 * Réinitialise la valeur de saisieCategorie.
 */
function ajoutCategorie() {
  const texteCategorie = saisieCategorie.value.trim()
  if (texteCategorie && !categories.includes(texteCategorie)) {
    categories.push(texteCategorie)
    sauvegarderCategories(categories)
    afficherCategories(categories)
    saisieCategorie.value = ''
  }
}

/**
 * Ajoute une nouvelle tâche à la liste des tâches.
 * Sauvegarde les tâches et affiche la liste des tâches mise à jour.
 * Réinitialise la valeur de saisieTache.
 */
function ajoutTache() {
  const texteTache = saisieTache.value.trim()
  const categorieTache = document.querySelector('#categoryDropdown').value
  if (texteTache) {
    taches.push({ text: texteTache, categorie: categorieTache || ''})
    sauvegarderTaches(taches)
    afficherTaches(taches)
    saisieTache.value = ''
  }
}

ajouterCategorie.addEventListener('click', ajoutCategorie)
ajouterTache.addEventListener('click', ajoutTache)


let taches = chargerTaches()
afficherTaches(taches)

let categories = chargerCategories()
afficherCategories(categories)


saisieRecherche.addEventListener('input', filtrerTaches); // écouteur d'évènement pour filtrer les taches
filterCategoryDropdown.addEventListener('change', filtrerTaches); // écouteur d'événement pour filter par catégorie de tache
document.getElementById('deleteCategory').addEventListener('click', supprimerCategorie)


