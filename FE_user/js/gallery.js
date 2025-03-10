let currentIndex = 0;
let galleryItems = [];

document.addEventListener('DOMContentLoaded', function() {
    fetchGalleryItems();
});

function fetchGalleryItems() {
    fetch('http://localhost:5000/api/Gallery/GetallGalleryItems')
        .then(response => response.json())
        .then(data => {
            galleryItems = data;
            displayGalleryItems();
            updateNavigationButtons();
        })
        .catch(error => console.error('Error:', error));
}

function displayGalleryItems() {
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '';
    
    for (let i = currentIndex; i < currentIndex + 3 && i < galleryItems.length; i++) {
        galleryContainer.appendChild(createGalleryItem(galleryItems[i]));
    }
}

function createGalleryItem(item) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    col.innerHTML = `
        <div class="card gallery-item">
            <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
            </div>
        </div>
    `;
    
    return col;
}

function navigateGallery(direction) {
    if (direction === 'prev' && currentIndex > 0) {
        currentIndex -= 3;
    } else if (direction === 'next' && currentIndex + 3 < galleryItems.length) {
        currentIndex += 3;
    }
    
    displayGalleryItems();
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex + 3 >= galleryItems.length;
}