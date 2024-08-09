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
    const buttons = categories.map(filter => {
        const button = document.createElement('button');
        button.id = filter.id;
        button.className = 'filter-button';
        const span = document.createElement('span');
        span.textContent = filter.name;
        button.appendChild(span);
        filtersContainer.appendChild(button);
        return button;
    });
    return buttons;
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

document.addEventListener('DOMContentLoaded', async () => {
    const categories = await fetchData('http://localhost:5678/api/categories');
    let list_images = await fetchData('http://localhost:5678/api/works');
    categories.unshift({ id: 'all', name: 'Tous' });
    console.log(categories);
    const buttons = createFilterButtons(categories);
    filterEvent(buttons, list_images);
});
