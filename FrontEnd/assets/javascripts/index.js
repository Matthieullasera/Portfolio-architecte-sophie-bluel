/**
 * Fetches data from the given URL and returns it as JSON.
 * If there's an error during the fetch process, it catches the error, logs it, and returns an empty array.
 * 
 * @param {string} url - The API endpoint to fetch data from.
 * @returns {Promise<Array|Object>} - The fetched data in JSON format or an empty array if there's an error.
 */
async function fetchJSONData(url) {
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

/**
 * Creates filter buttons based on the provided categories and appends them to the filter container.
 * 
 * @param {Array} categories - The list of categories to create filter buttons for.
 * @returns {Array} - An array of created button elements.
 */
function generateCategoryFilterButtons(categories) {
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

/**
 * Displays a list of works (images) in a specified gallery container.
 * Depending on the destination, it either adds a caption or a delete button to each image.
 * 
 * @param {Array} works - The list of works (images) to display in the gallery.
 * @param {string} destination - The CSS selector for the gallery container.
 * @returns {undefined}
 */
function displayWorksInGallery(works, destination) {
    const galleryContainer = document.querySelector(destination);
    galleryContainer.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.title;
        figure.appendChild(image);
        if (destination === ".gallery") {
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title;
            figure.appendChild(figcaption); 
        } else {
            const delete_button = document.createElement('i');
            delete_button.className = 'fa-solid fa-trash-can';
            figure.appendChild(delete_button);
        }
        galleryContainer.appendChild(figure);
    });
}

/**
 * Adds event listeners to filter buttons to filter displayed images based on the selected category.
 * 
 * @param {Array} buttons - The array of filter button elements.
 * @param {Array} list_images - The array of images to be filtered.
 * @returns {undefined}
 */
async function addCategoryFilterListeners(buttons, list_images) {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.id;

            let picturesToDisplay;
            if (categoryId === 'all') {
                picturesToDisplay = list_images;
            } else {
                picturesToDisplay = list_images.filter(image => image.categoryId.toString() === categoryId);
            }

            displayWorksInGallery(picturesToDisplay, ".gallery");
        });
    });
}

/**
 * Toggles the visibility of admin-specific elements based on the presence of an authentication token.
 * 
 * @returns {undefined}
 */
function toggleAdminMode() {
    const token = localStorage.getItem('authToken');
    const adminElements = document.querySelectorAll('.admin');
    const notLog = document.querySelectorAll('.notLog');

    adminElements.forEach(element => {
        if (token) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    notLog.forEach(element => {
        if (token) {
            element.classList.add('hidden');
        } else {
            element.classList.remove('hidden');
        }
    });
}

/**
 * Sets up the logout button to remove the authentication token from local storage 
 * and redirect the user to the homepage upon clicking.
 * 
 * @returns {undefined}
 */
function setupLogoutButton() {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            localStorage.removeItem('authToken');
            window.location.href = 'index.html'; 
        });
    }
}

/**
 * Toggles the visibility of a modal identified by its ID.
 * 
 * @param {string} modalId - The ID of the modal to toggle.
 * @returns {undefined}
 */
function toggleModalDisplay(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

/**
 * Adds event listeners to delete buttons within a modal to allow image deletion from both the gallery and the modal.
 * 
 * @param {Array} list_images - The list of images available for deletion.
 * @returns {undefined}
 */
function setupImageDeletion(list_images) {
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
                displayWorksInGallery(list_images,".gallery");
                displayWorksInGallery(list_images,".gallery-modal");

            } catch (error) {
                alert('Une erreur est survenue lors de la suppression de l\'image.');
            }
        });

    });
}

/**
 * Handles the image file input and preview in the add picture modal. 
 * When a file is selected, it displays a preview of the image and hides other UI elements.
 * 
 * @returns {undefined}
 */
function setupImagePreviewInModal() {
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

/**
 * Toggles the visibility of a list of categories (e.g., a dropdown).
 * 
 * @param {HTMLElement} toggleText - The element containing the list of categories to toggle.
 * @returns {undefined}
 */
function toggleCategoryDropdown(toggleText) {
    const isHidden = toggleText.classList.contains('hidden');
    toggleText.classList.toggle('hidden', !isHidden);
    toggleText.classList.toggle('visible', isHidden);
}

/**
 * Creates elements for each category in a dropdown list, allowing the user to select a category.
 * 
 * @param {Array} categories - The list of categories to display in the dropdown.
 * @param {HTMLElement} toggleText - The element containing the dropdown list.
 * @param {HTMLElement} inputCategory - The input field where the selected category is displayed.
 * @returns {undefined}
 */
function populateCategoryDropdown(categories, toggleText, inputCategory) {
    toggleText.innerHTML = '';
    categories.forEach(category => {
        const div = document.createElement('div');
        div.textContent = category.name;

        div.addEventListener('click', () => {
            inputCategory.value = category.name;
            toggleCategoryDropdown(toggleText);
            const event = new Event('input', { bubbles: true });
            inputCategory.dispatchEvent(event);
        });

        toggleText.appendChild(div);
    });
}

/**
 * Displays categories in a modal, allowing the user to select one from a dropdown list.
 * 
 * @returns {undefined}
 */
async function initializeCategoryDropdownInModal() {
    const chevronCategory = document.querySelector(".categoryInput i");
    const toggleText = document.querySelector(".categoryInput .toggleText");
    const inputCategory = document.querySelector(".categoryInput input");

    if (chevronCategory && toggleText && inputCategory) {
        chevronCategory.addEventListener('click', async (event) => {
            event.preventDefault();

            if (toggleText.className.includes('hidden')) {
                const categories = await fetchJSONData('http://localhost:5678/api/categories');
                populateCategoryDropdown(categories, toggleText, inputCategory);
            }
            toggleCategoryDropdown(toggleText);
        });
    }
}

/**
 * Handles the addition of a new picture, including uploading the image and updating the gallery.
 * 
 * @param {Array} categories - The list of available categories to match against the selected category.
 * @param {Array} works - The current list of works (images) to be updated with the new image.
 * @returns {undefined}
 */
async function processImageUpload(categories, works) {
    const fileInput = document.getElementById("fileInput");
    const titleInput = document.getElementById("titleInput");
    const categoryInput = document.getElementById("categoryInput");
    const category = categories.find(category => category.name.toLowerCase() === categoryInput.value.toLowerCase());
    const categoryId = category?.id;
    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('category', categoryId);
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 0 && file.type.startsWith('image/')) {
            formData.append('image', file);
        } else {
            return;
        }
    } else {
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
            works.push({ 
                id: (works.length + 1),
                title: titleInput.value, 
                imageUrl: URL.createObjectURL(file), 
                categoryId: categoryId 
            });
            fileInput.value = '';
            titleInput.value = '';
            categoryInput.value = '';
            toggleModalDisplay('modalAddPicture');
            displayWorksInGallery(works, ".gallery");
            displayWorksInGallery(works, ".gallery-modal");
        } else {
            const error = await response.json();
        }
    } catch (error) {
        return
    }
}

/**
 * Sets up the submit button for the add picture modal, ensuring it triggers the addition process.
 * 
 * @param {Array} categories - The list of available categories to match against the selected category.
 * @param {Array} list_images - The current list of works (images) to be updated with the new image.
 * @returns {undefined}
 */
function initializeModalToggleListeners(categories, list_images) {
    const submitButton = document.querySelector(".buttonValid");
    if (submitButton) {
        submitButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            processImageUpload(categories, list_images); 
        });
    } else {
        console.error('Le bouton de validation est manquant.');
    }
}

/**
 * Main function that initializes the page after the DOM content has loaded.
 * It fetches data, sets up event listeners, and handles initial UI states.
 * 
 * @returns {undefined}
 */
async function main() {
    const [categories, list_images] = await Promise.all([
        fetchJSONData('http://localhost:5678/api/categories'),
        fetchJSONData('http://localhost:5678/api/works')
    ]);

    categories.unshift({ id: 'all', name: 'Tous' });

    displayWorksInGallery(list_images, '.gallery');
    displayWorksInGallery(list_images, '.gallery-modal');
    setupLogoutButton();
    toggleAdminMode();
    setupImagePreviewInModal();
    setupImageDeletion(list_images);
    initializeCategoryDropdownInModal();
    const buttons = generateCategoryFilterButtons(categories);
    addCategoryFilterListeners(buttons, list_images);
    initializeModalToggleListeners(categories, list_images);

    const fileInput = document.getElementById('fileInput');
    const titleInput = document.getElementById('titleInput');
    const categoryInput = document.getElementById('categoryInput');
    const buttonValid = document.getElementById('buttonValid');

    /**
     * Checks the validity of the form in the add picture modal.
     * If all fields are filled out correctly, it activates the submit button.
     */
    function checkFormValidity() {
        const isFileSelected = fileInput.files.length > 0;
        const isTitleFilled = titleInput.value.trim() !== '';
        const isCategoryFilled = categoryInput.value.trim() !== '';
    
        if (!isFileSelected) {
            fileInput.classList.add('alert');
            showAlert(fileInput, 'Veuillez sélectionner un fichier.');
        } else {
            fileInput.classList.remove('alert');
            hideAlert(fileInput);
        }
    
        if (!isTitleFilled) {
            titleInput.classList.add('alert');
            showAlert(titleInput, 'Veuillez remplir le titre.');
        } else {
            titleInput.classList.remove('alert');
            hideAlert(titleInput);
        }
    
        if (!isCategoryFilled) {
            categoryInput.classList.add('alert');
            showAlert(categoryInput, 'Veuillez sélectionner une catégorie.');
        } else {
            categoryInput.classList.remove('alert');
            hideAlert(categoryInput);
        }
    
        if (isFileSelected && isTitleFilled && isCategoryFilled) {
            buttonValid.classList.add('active');
        } else {
            buttonValid.classList.remove('active');
        }
    }
    
    function showAlert(inputElement, message) {
        let alertElement = inputElement.nextElementSibling;
        if (!alertElement || !alertElement.classList.contains('alert-message')) {
            alertElement = document.createElement('div');
            alertElement.classList.add('alert-message');
            inputElement.parentNode.insertBefore(alertElement, inputElement.nextSibling);
        }
        alertElement.textContent = message;
    }
    
    function hideAlert(inputElement) {
        let alertElement = inputElement.nextElementSibling;
        if (alertElement && alertElement.classList.contains('alert-message')) {
            alertElement.textContent = '';
        }
    }
    
    
    fileInput.addEventListener('change', checkFormValidity);
    titleInput.addEventListener('input', checkFormValidity);
    categoryInput.addEventListener('input', checkFormValidity);

    /**
     * Sets up click event listeners for various elements to toggle modals.
     */
    const setupClickListeners = () => {
        const clickActions = [
            { selector: ".titleMyProjects i", actions: ["modals", "modalGallery"] },
            { selector: ".titleMyProjects p", actions: ["modals","modalGallery"] },
            { selector: ".add-photo-btn", actions: ["modalAddPicture", "modalGallery"] },
            { selector: "#modals #modalGallery .close", actions: ["modals", "modalGallery"] },
            { selector: "#modalAddPicture .close", actions: ["modals","modalAddPicture"] },
            { selector: ".headerModale i", actions: ["modalAddPicture", "modalGallery"] }
        ];
    
        clickActions.forEach(({ selector, actions }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener('click', () => {
                    actions.forEach(action => toggleModalDisplay(action));
                });
            }
        });
    };
    
    setupClickListeners();
}

document.addEventListener('DOMContentLoaded', () => {
    main();
});
