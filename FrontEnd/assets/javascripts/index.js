
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations des images');
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

function createGalleryMyProjects(works,classendroit,figcaption_value) {
    const galleryContainer = document.querySelector(classendroit);
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

function adminMode (){
    const token = localStorage.getItem('authToken');
    const adminElements = document.querySelectorAll('.admin');

    adminElements.forEach(element => {
        if (token) {
            element.style.setProperty('display', 'flex', 'important');
        } else {
            element.style.setProperty('display', 'none', 'important');
        }
    });

    const notLog = document.querySelectorAll('.notLog');
    notLog.forEach(element => {
        if (token) {
            element.style.display = 'none';
        } else {
            element.style.display = 'flex'; 
        }
    })

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

function toggleModal(pictures) {
    var modal = document.getElementById("modalGallery");
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
    createGalleryMyProjects(pictures,'.gallery-modal',false);
    removePictureModal(pictures);

}

function toggleModalAddPicture() {
    var modal = document.getElementById("modalAddPicture");
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
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

            } catch (error) {
                alert('Une erreur est survenue lors de la suppression de l\'image.');
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', async () => {

    const categories = await fetchData('http://localhost:5678/api/categories');
    let list_images = await fetchData('http://localhost:5678/api/works');
    removeTokenForLogout();
    categories.unshift({ id: 'all', name: 'Tous' });
    adminMode ();
    const images = createGalleryMyProjects(list_images,'.gallery',true);
    const buttons = createFilterButtons(categories);
    filterEvent(buttons, list_images);

    document.querySelector("#titleMyProjects i").onclick = function() {
        toggleModal(list_images);
    }
    document.querySelector(".add-photo-btn").onclick = function() {
        toggleModalAddPicture();
    }
    document.querySelector("#modalGallery .close").onclick = function() {
        toggleModal();
    }
    
    document.querySelector("#modalAddPicture .close").onclick = function() {
        toggleModalAddPicture();
        toggleModal();
    }

    window.onclick = function(event) {
        var modalGallery = document.getElementsByClassName("modal");
        var modalAddPicture = document.getElementById("modalAddPicture")
        if (event.target == modalGallery) {
            toggleModal();
        }
        if (event.target == modalAddPicture){
            toggleModalAddPicture();
        }
    }
});
