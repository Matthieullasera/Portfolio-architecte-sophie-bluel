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
    const filtersContainer = document.querySelector('.filters'); 
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

function createGalleryMyProjects(works) {
    const galleryContainer = document.querySelector('.gallery');
    const images = [];
    works.forEach(filter => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = filter.imageUrl;
        image.alt = filter.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = filter.title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
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
    const adminElements = document.querySelectorAll('.admin'); // Sélectionne tous les éléments avec la classe 'admin'

    adminElements.forEach(element => {
        if (token) {
            // Affiche les éléments avec la classe 'admin'
            element.style.setProperty('display', 'flex', 'important');
        } else {
            // Cache les éléments avec la classe 'admin'
            element.style.setProperty('display', 'none', 'important');
        }
    });

    const notLog = document.querySelectorAll('.notLog');
    notLog.forEach(element => {
        if (token) {
            element.style.display = 'none'; // Cache l'élément avec l'ID 'login'
        } else {
            element.style.display = 'flex'; // Affiche l'élément avec l'ID 'login'
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

document.addEventListener('DOMContentLoaded', async () => {
    const categories = await fetchData('http://localhost:5678/api/categories');
    let list_images = await fetchData('http://localhost:5678/api/works');
    categories.unshift({ id: 'all', name: 'Tous' });
    adminMode ();
    const images = createGalleryMyProjects(list_images);
    const buttons = createFilterButtons(categories);
    filterEvent(buttons, list_images);
});
