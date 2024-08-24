
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function displayGallery(pictures) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; 

    pictures.forEach(picture => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = picture.imageUrl; 
        img.alt = picture.description || ''; 
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = picture.title || ''; 
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

function createFilterButtons(categories) {
    const filtersContainer = document.getElementById('filters'); 
    const buttons = [];
    categories.forEach(filter => {
        const button = document.createElement('button'); 
        button.id = filter.id; 
        button.className = 'filter-button'; 
        const span = document.createElement('span'); 
        span.textContent = filter.name; 
        button.appendChild(span); 
        filtersContainer.appendChild(button);
        buttons.push(button); 
    });

    return buttons; 
}

function createGalleryMyProjects(works,destination,figcaption_value) {
    const galleryContainer = document.querySelector(destination);
    const images = [];
    galleryContainer.innerHTML = '';
    works.forEach(filter => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = filter.imageUrl;
        image.alt = filter.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = filter.title;
        figure.appendChild(image);
        if (figcaption_value === true) {
            figure.appendChild(figcaption); 
        }
        else {
            const delete_button = document.createElement('i');
            delete_button.className = 'fa-solid fa-trash-can';
            figure.appendChild(delete_button);
        }
        galleryContainer.appendChild(figure);
        return figure;
    })
    return images;
}

async function filterEvent(buttons, list_images) {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.id;
            console.log('Category ID:', categoryId);

            let picturesToDisplay;
            if (categoryId === 'all') {
                picturesToDisplay = list_images;
            } else {
                picturesToDisplay = list_images.filter(image => image.categoryId.toString() === categoryId);
            }
            console.log('Pictures to Display:', picturesToDisplay);

            displayGallery(picturesToDisplay);
        });
    });
}

function adminMode() {
    const token = localStorage.getItem('authToken');
    const adminElements = document.querySelectorAll('.admin');
    const notLog = document.querySelectorAll('.notLog');

    adminElements.forEach(element => {
        if (token) {
            element.classList.add('visible');
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
            element.classList.remove('visible');
        }
    });

    notLog.forEach(element => {
        if (token) {
            element.classList.add('hidden');
            element.classList.remove('visible');
        } else {
            element.classList.add('visible');
            element.classList.remove('hidden');
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

function toggleModalVisibility(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('visible');
        modal.classList.toggle('hidden');
    }
}


function toggleModalGallery(pictures) {
    toggleModalVisibility("modalGallery");
    createGalleryMyProjects(pictures,'.gallery-modal',false);
    removePictureModal(pictures);
}

function toggleModalAddPicture() {
    toggleModalVisibility("modalAddPicture");
}
function removePictureModal(list_images) {
    const trashButtons = document.querySelectorAll('.fa-trash-can');
    
    trashButtons.forEach((trashButton, index) => {
        trashButton.addEventListener('click', async function(event) {
            event.preventDefault();
            const imageId = list_images[index].id;
            const figure = trashButton.closest('figure')
            try {
                const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression de l\'image');
                }
                if (figure) {
                    figure.remove();
                }
                list_images.splice(index, 1);
                displayGallery(list_images);

            } catch (error) {
                alert('Une erreur est survenue lors de la suppression de l\'image.');
            }
        });

    });
}

function addPictureInModale() {
    const buttonAddPicture = document.getElementById("buttonAddPicture");
    const fileInput = document.getElementById("fileInput");
    const imagePreview = document.getElementById("ImagePreview");
    const addPictureDiv = document.querySelector(".addPicture");

    buttonAddPicture.addEventListener("click", handleButtonClick);
    fileInput.addEventListener("change", handleFileChange);

    function handleButtonClick(event) {
        event.preventDefault();
        fileInput.click();
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            imagePreview.src = event.target.result;
            imagePreview.classList.remove('hidden');
            addPictureDiv.querySelectorAll('i, button, span').forEach(el => {
                el.classList.add('hidden'); 
            });
        };
        reader.readAsDataURL(file);
    }
}




function toggleCategoryList(toggleText) {
    const isHidden = toggleText.classList.contains('hidden');
    toggleText.classList.toggle('hidden', !isHidden);
    toggleText.classList.toggle('visible', isHidden);
}

function createCategoryElements(categories, toggleText, inputCategory) {
    toggleText.innerHTML = '';
    categories.forEach(category => {
        const div = document.createElement('div');
        div.textContent = category.name;

        div.addEventListener('click', () => {
            inputCategory.value = category.name;
            toggleCategoryList(toggleText);
        });

        toggleText.appendChild(div);
    });
}

async function displayCategoryInModale() {
    const chevronCategory = document.querySelector(".categoryInput i");
    const toggleText = document.querySelector(".categoryInput .toggleText");
    const inputCategory = document.querySelector(".categoryInput input");

    if (chevronCategory && toggleText && inputCategory) {
        chevronCategory.addEventListener('click', async (event) => {
            event.preventDefault();

            if (toggleText.className.includes('hidden')) {
                const categories = await fetchData('http://localhost:5678/api/categories');
                createCategoryElements(categories, toggleText, inputCategory);
            }
            toggleCategoryList(toggleText);
        });
    }
}

async function getCategoryIdByName(categoryName) {
    try {
        const categories = await fetchData('http://localhost:5678/api/categories');
        for (let category of categories) {
            if (category.name.toLowerCase() === categoryName.toLowerCase()) {
                return category.id;
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return null;
    }
}
async function handleAddPicture() {
    const fileInput = document.getElementById("fileInput");
    const titleInput = document.getElementById("titleInput");
    const categoryInput = document.getElementById("categoryInput");
    const output = document.getElementById("output");

    const formData = new FormData();
    formData.append('title', titleInput.value);
    const categoryId = await getCategoryIdByName(categoryInput.value);
    if (!categoryId) {
        output.innerHTML = "Veuillez entrer une catégorie valide.";
        return;
    }
    formData.append('category', categoryId);

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 0 && file.type.startsWith('image/')) {
            formData.append('image', file);
        } else {
            output.innerHTML = "Le fichier sélectionné n'est pas une image valide.";
            return;
        }
    } else {
        output.innerHTML = "Veuillez sélectionner une image.";
        return;
    }

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`  
            },
            body: formData
        });

        if (response.ok) {
            output.innerHTML = "Fichier téléversé avec succès !";
            fileInput.value = '';
            titleInput.value = '';
            categoryInput.value = '';
            toggleModalVisibility('modalAddPicture');
            const pictures = await fetchData('http://localhost:5678/api/works');
            displayGallery(pictures);
        } else {
            const error = await response.json();
            output.innerHTML = `Erreur lors de l'ajout de la photo: ${error.message}`;
        }
    } catch (error) {
        output.innerHTML = `Une erreur est survenue lors de l'ajout de la photo: ${error.message}`;
    }
}

function setupSubmitButton() {
    const submitButton = document.querySelector(".buttonValid");
    if (submitButton) {
        submitButton.addEventListener('click', handleAddPicture);
    } else {
        console.error('Le bouton de validation est manquant.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    main();
    setupSubmitButton();
});

async function main() {
    const [categories, list_images] = await Promise.all([
        fetchData('http://localhost:5678/api/categories'),
        fetchData('http://localhost:5678/api/works')
    ]);

    categories.unshift({ id: 'all', name: 'Tous' });

    // Initial setup
    createGalleryMyProjects(list_images, '.gallery', true);
    removeTokenForLogout();
    adminMode();
    addPictureInModale();
    displayCategoryInModale();
    const buttons = createFilterButtons(categories);
    filterEvent(buttons, list_images);

    // Event listeners
    const setupClickListener = (selector, callback) => {
        const element = document.querySelector(selector);
        if (element) element.addEventListener('click', callback);
    };

    setupClickListener(".titleMyProjects i", () => toggleModalGallery(list_images));
    setupClickListener(".titleMyProjects p", () => toggleModalGallery(list_images));

    setupClickListener(".add-photo-btn", toggleModalAddPicture);
    setupClickListener("#modalGallery .close", () => toggleModalVisibility("modalGallery"));
    setupClickListener("#modalAddPicture .close", () => {
        toggleModalVisibility("modalAddPicture");
        toggleModalVisibility("modalGallery");
    });
    setupClickListener(".headerModale i", () => toggleModalVisibility("modalAddPicture"));


    window.onclick = (event) => {
        const modals = document.querySelectorAll(".modal");
        modals.forEach(modal => {
            if (event.target === modal) {
                toggleModalVisibility(modal.id);
            }
        });
    };
}


