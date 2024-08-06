async function fetchCategories(url) {
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

function displaygallerie(pictures) {
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

async function filterEvent() {
    let filterButtons = document.querySelectorAll('.filter-button');

    let list_images = await fetchCategories('http://localhost:5678/api/works');

    console.log('List Images:', list_images);

    filterButtons.forEach(button => {
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

            displaygallerie(picturesToDisplay);
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const filterData = [
        { id: 'all', label: 'Tous' },
        { id: '1', label: 'Objets' },
        { id: '2', label: 'Appartement' },
        { id: '3', label: 'Hotels & Restaurants' }
    ];

    const filtersContainer = document.querySelector('.filters');

    filterData.forEach(filter => {
        const button = document.createElement('button');
        button.id = filter.id;
        button.className = 'filter-button';

        const span = document.createElement('span');
        span.textContent = filter.label;

        button.appendChild(span);
        filtersContainer.appendChild(button);
    });

        filterEvent();
});
