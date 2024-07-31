async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories des filtres');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchInfosPictures() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
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

async function sortPictureInCategories() {
    const list_info_picture = await fetchInfosPictures();
    const list_categories = await fetchCategories();
    let list_objets = [];
    let list_appartements = [];
    let list_hotels = [];
    const [objets, appartements, hotels] = list_categories;

    for (let i = 0; i < list_info_picture.length; i++) {
        if (list_info_picture[i].categoryId === objets.id) {
            list_objets.push(list_info_picture[i]);
        } else if (list_info_picture[i].categoryId === appartements.id) {
            list_appartements.push(list_info_picture[i]);
        } else if (list_info_picture[i].categoryId === hotels.id) {
            list_hotels.push(list_info_picture[i]);
        }
    }
    return {objets: list_objets, appartements: list_appartements, hotels: list_hotels, all: list_info_picture};
}

function displayPictures(pictures) {
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

async function filterevent() {
    let pictureCategories = await sortPictureInCategories();
    let filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.id;

            let picturesToDisplay = [];

            if (categoryId === 'all') {
                picturesToDisplay = pictureCategories.all;
            } else if (categoryId === pictureCategories.objets[0]?.categoryId.toString()) {
                picturesToDisplay = pictureCategories.objets;
            } else if (categoryId === pictureCategories.appartements[0]?.categoryId.toString()) {
                picturesToDisplay = pictureCategories.appartements;
            } else if (categoryId === pictureCategories.hotels[0]?.categoryId.toString()) {
                picturesToDisplay = pictureCategories.hotels;
            }

            displayPictures(picturesToDisplay);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    filterevent();
});
