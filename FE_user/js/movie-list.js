document.addEventListener('DOMContentLoaded', function() {
    fetchNowShowingMovies();
});

function fetchNowShowingMovies() {
    fetch('http://localhost:5000/Movie?page=1&limit=5&activeOnly=true')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('nowShowingMovies');
            if (data.movies && Array.isArray(data.movies)) {
                container.innerHTML = ''; // Clear existing content
                data.movies.forEach(movie => {
                    container.appendChild(createMovieCard(movie));
                });
            } else {
                console.error('Unexpected data structure:', data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        
        <div class="movie-poster" onclick="playTrailer('${movie.trailerUrl}')">
            <img src="${movie.posterUrl}" alt="${movie.title}">
        </div>
        <div class="movie-info">
            <div class="movie-title">
                <a href="movie-detail.html?id=${movie.id}" class="movie-link">${movie.title}</a>
            </div>
            <div class="movie-genre">
                <span class="movie-link">${movie.genre}</span>
            </div>
        </div>
    `;
    return card;
}

function playTrailer(trailerUrl) {
    if (trailerUrl) {
        const modal = document.getElementById('trailer-modal');
        const iframe = document.getElementById('trailer-iframe');
        const modalContent = document.querySelector('.modal-content');
        
        // Xử lý URL YouTube
        if (trailerUrl.includes('youtube.com') || trailerUrl.includes('youtu.be')) {
            const videoId = extractYouTubeVideoId(trailerUrl);
            if (videoId) {
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
            } else {
                console.error('Invalid YouTube URL');
                alert('Xin lỗi, không thể tải trailer. URL không hợp lệ.');
                return;
            }
        } else {
            // Nếu không phải URL YouTube, sử dụng URL gốc
            iframe.src = trailerUrl;
        }

        modal.style.display = 'block';

        // Thêm sự kiện để đóng modal
        const closeButton = modal.querySelector('.close');
        closeButton.onclick = function() {
            closeModal(modal, iframe);
        }

        // Đóng modal khi click ra ngoài iframe
        modal.onclick = function(event) {
            if (event.target === modal || !modalContent.contains(event.target)) {
                closeModal(modal, iframe);
            }
        }
    } else {
        alert('Trailer không khả dụng.');
    }
}

function closeModal(modal, iframe) {
    modal.style.display = 'none';
    iframe.src = ''; // Dừng video khi đóng modal
}

// Hàm hỗ trợ để trích xuất ID video từ URL YouTube
function extractYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}