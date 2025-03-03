let currentPage = 1;
const moviesPerPage = 5;
let totalMovies = 0;

document.addEventListener('DOMContentLoaded', function() {
    fetchNowShowingMovies();
    
    document.getElementById('prevBtn').addEventListener('click', () => navigateSlider('prev'));
    document.getElementById('nextBtn').addEventListener('click', () => navigateSlider('next'));
});

function fetchNowShowingMovies() {
    const container = document.getElementById('nowShowingMovies');
    
    // Thêm class fade-out để bắt đầu hiệu ứng fade out
    container.classList.add('fade-out');
    
    // Đợi hiệu ứng fade out hoàn thành
    setTimeout(() => {
        fetch(`http://localhost:5000/Movie?page=${currentPage}&limit=${moviesPerPage}&activeOnly=true`)
            .then(response => response.json())
            .then(data => {
                if (data.movies && Array.isArray(data.movies)) {
                    totalMovies = data.totalMovies;
                    container.innerHTML = '';
                    data.movies.forEach(movie => {
                        container.appendChild(createMovieCard(movie));
                    });
                    updateSliderVisibility();
                    
                    // Thêm class fade-in để bắt đầu hiệu ứng fade in
                    container.classList.remove('fade-out');
                    container.classList.add('fade-in');
                    
                    // Xóa class fade-in sau khi hiệu ứng hoàn thành
                    setTimeout(() => {
                        container.classList.remove('fade-in');
                    }, 500);
                } else {
                    console.error('Unexpected data structure:', data);
                }
            })
            .catch(error => console.error('Error:', error));
    }, 300); // Đợi 500ms cho hiệu ứng fade out
}

function updateSliderVisibility() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn && nextBtn) {
        prevBtn.style.display = currentPage > 1 ? 'block' : 'none';
        nextBtn.style.display = currentPage * moviesPerPage < totalMovies ? 'block' : 'none';
    } else {
        console.error('Navigation buttons not found');
    }
}

function navigateSlider(direction) {
    if (direction === 'next' && currentPage * moviesPerPage < totalMovies) {
        currentPage++;
        fetchNowShowingMovies();
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
        fetchNowShowingMovies();
    }
}

function updateSliderVisibility() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn && nextBtn) {
        prevBtn.style.display = currentPage > 1 ? 'block' : 'none';
        nextBtn.style.display = currentPage * moviesPerPage < totalMovies ? 'block' : 'none';
    } else {
        console.error('Navigation buttons not found');
    }
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