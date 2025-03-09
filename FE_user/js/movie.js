document.addEventListener('DOMContentLoaded', function() {
    const movieId = 1; // Giả sử ID phim là 1, bạn có thể thay đổi logic này để lấy ID từ URL
    fetchMovieDetails(movieId);
    fetchNowShowing();
});

function fetchMovieDetails(movieId) {
    axios.get(`http://localhost:5000/Movie/get/${movieId}`)
        .then(response => {
            if (response.data) {
                const movie = response.data;
                currentMovieInfo = movie; 
                displayMovieDetails(response.data);
                createCalendar(movieId);
            } else {
                console.error('No data received from API');
                document.getElementById('movie-details').innerHTML = '<p>Không thể tải dữ liệu phim. Vui lòng thử lại sau.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('movie-details').innerHTML = '<p>Đã xảy ra lỗi khi tải dữ liệu phim. Vui lòng thử lại sau.</p>';
        });
}

// function displayMovieDetails(movie) {
//     const movieDetailsElement = document.getElementById('movie-details');
//     const content = `
//         <div class="movie-header">
//             <h1 class="movie-title">${movie.title}</h1>
//             <span class="movie-rating">⭐ ${movie.rating || 'N/A'}</span>
//         </div>
//         <div class="movie-content">
//             <div class="movie-poster">
//                 <img src="${movie.posterUrl}" alt="${movie.title}" onclick="openTrailer('${movie.trailerUrl}')">
//                 <div class="play-button" onclick="openTrailer('${movie.trailerUrl}')">▶</div>
//             </div>
//             <div class="movie-info">
//                 <p class="movie-description">${movie.description}</p>
//                 <p class="movie-meta"><strong>Đạo diễn:</strong> ${movie.director}</p>
//                 <p class="movie-meta"><strong>Diễn viên:</strong> ${movie.cast}</p>
//                 <p class="movie-meta"><strong>Thể loại:</strong> ${movie.genre}</p>
//                 <p class="movie-meta"><strong>Thời lượng:</strong> ${movie.duration} phút</p>
//                 <p class="movie-meta"><strong>Khởi chiếu:</strong> ${new Date(movie.releaseDate).toLocaleDateString()}</p>
//                 <p class="movie-meta"><strong>Ngôn ngữ:</strong> ${movie.languages.join(', ')}</p>
//             </div>
//         </div>
//     `;
//     movieDetailsElement.innerHTML = content;
// }

function displayMovieDetails(movie) {
    const movieDetailsElement = document.getElementById('movie-details');
    
    const content = `
        <div class="cine__cover" style="background-image:url('${movie.backdropUrl || movie.posterUrl}')"></div>
        <div class="cine__hero__poster">
            <img src="${movie.posterUrl}" alt="${movie.title}">
        </div>
        <div class="cine__details">
            <h1>${movie.title}</h1>
            <p>${movie.description}</p>
            <p><strong>Ngày chiếu:</strong> ${new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</p>
            <p><strong>Thể loại:</strong> ${movie.genre}</p>
            <p><strong>Thời lượng:</strong> ${movie.duration} phút</p>
            <button class="btn" onclick="openTrailer('${movie.trailerUrl}')">Xem Trailer</button>
        </div>
    `;
    
    movieDetailsElement.innerHTML = content;
}


function openTrailer(trailerUrl) {
    if (!trailerUrl) {
        console.error('Trailer URL is not available');
        alert('Xin lỗi, trailer không khả dụng.');
        return;
    }

    const modal = document.getElementById('trailer-modal');
    const iframe = document.getElementById('trailer-iframe');
    
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
    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = 'none';
            iframe.src = ''; // Dừng video khi đóng modal
        }
    }

    // Đóng modal khi click bên ngoài
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            iframe.src = ''; // Dừng video khi đóng modal
        }
    }
}

function extractYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


function createCalendar(movieId) {
    const today = new Date();
    const dateSelector = document.getElementById('date-selector');
    let content = '';

    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    for (let i = 0; i < 10; i++) {  // Thay đổi từ 5 thành 10
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        const dayName = dayNames[date.getDay()];
        const dayNumber = date.getDate();
        const dateString = date.toLocaleDateString('en-CA');

        content += `
            <button class="date-button" data-date="${dateString}">
                <span class="day-name">${dayName}</span>
                <span class="day-number">${dayNumber}</span>
            </button>
        `;
    }

    dateSelector.innerHTML = content;

    // Thêm event listener cho các nút ngày
    dateSelector.querySelectorAll('.date-button').forEach(button => {
        button.addEventListener('click', function() {
            const selectedDate = this.getAttribute('data-date');
            fetchShowtimes(movieId, selectedDate);
            // Đánh dấu nút được chọn
            dateSelector.querySelectorAll('.date-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Tự động chọn ngày đầu tiên
    const firstDateButton = dateSelector.querySelector('.date-button');
    if (firstDateButton) {
        firstDateButton.classList.add('active');
        const firstDate = firstDateButton.getAttribute('data-date');
        fetchShowtimes(movieId, firstDate);
    }
}

function fetchShowtimes(movieId, date) {
    axios.get(`http://localhost:5000/Movie/GetAllShowtimes/${movieId}?date=${date}`)
        .then(response => {
            if (response.data && response.data.length > 0) {
                displayShowtimes(response.data);
            } else {
                document.getElementById('showtimes').innerHTML = '<p>Không có suất chiếu trong ngày này.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('showtimes').innerHTML = '<p>Không có suất chiếu trong ngày này.</p>';
        });
}

// }
function displayShowtimes(showtimes) {
    const showtimesElement = document.getElementById('showtimes');
    let content = '<ul class="showtime-list">';
    
    showtimes.forEach(showtime => {
        const startTime = new Date(showtime.startTime);
        const endTime = new Date(showtime.endTime);
        content += `
            <li class="showtime-item" data-showtime-id="${showtime.id}" data-start-time="${showtime.startTime}" data-end-time="${showtime.endTime}">
                ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ~ ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </li>
        `;
    });
    
    content += '</ul>';
    showtimesElement.innerHTML = content;

    // Thêm event listener cho các phần tử showtime
    const showtimeItems = showtimesElement.querySelectorAll('.showtime-item');
    showtimesElement.querySelectorAll('.showtime-item').forEach(item => {
        item.addEventListener('click', function() {
            const showtimeId = this.getAttribute('data-showtime-id');
            const startTime = this.getAttribute('data-start-time');
            const endTime = this.getAttribute('data-end-time');
            openTicketModal(showtimeId, startTime, endTime);
        });
    });
}

// phim đang chiếu
function fetchNowShowing() {
    axios.get('http://localhost:5000/Movie?page=1&limit=10&activeOnly=true')
        .then(response => {
            if (response.data && response.data.movies && response.data.movies.length > 0) {
                displayNowShowing(response.data.movies);
            } else {
                console.error('No now showing movies received from API');
                document.getElementById('now-showing-list').innerHTML = '<p>Không có phim đang chiếu.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('now-showing-list').innerHTML = '<p>Đã xảy ra lỗi khi tải danh sách phim đang chiếu. Vui lòng thử lại sau.</p>';
        });
}

function displayNowShowing(movies) {
    const nowShowingElement = document.getElementById('now-showing-list');
    let content = '<ul class="now-showing-movies">';
    
    movies.forEach(movie => {
        content += `
            <li class="movie-item">
                <img src="${movie.posterUrl}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>Thời lượng: ${movie.duration} phút</p>
                    <a href="movie-detail.html?id=${movie.id}" class="btn btn-primary">Chi tiết</a>
                </div>
            </li>
        `;
    });
    
    content += '</ul>';
    nowShowingElement.innerHTML = content;
}

// Gọi hàm này khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) {
        fetchMovieDetails(movieId);
        createCalendar(movieId);
    }

    const trailerButton = document.querySelector('.btn[onclick^="openTrailer"]');
    if (trailerButton) {
        trailerButton.addEventListener('click', function(event) {
            event.preventDefault();
            const trailerUrl = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            openTrailer(trailerUrl);
        });
    }
});




async function fetchTicketTypes() {
    try {
        const response = await axios.get('http://localhost:5000/api/ticket/alltickettypes');
        return response.data;
    } catch (error) {
        console.error('Error fetching ticket types:', error);
        return [];
    }
}

async function openTicketModal(showtimeId, startTime,endTime) {
    const modal = document.getElementById('ticket-modal');
    const ticketOptions = document.getElementById('ticket-options');
    const selectedTickets = document.getElementById('selected-tickets');
    const proceedButton = document.getElementById('proceed-to-payment');

    // Fetch all ticket types from API
    const ticketTypes = await fetchTicketTypes();

    // Hiển thị các loại vé
    if (ticketTypes.length > 0) {
        ticketOptions.innerHTML = ticketTypes.map(type => `
            <div class="ticket-option" onclick="selectTicket(${type.id}, '${type.name}', ${type.price}, ${showtimeId}, '${startTime}', '${endTime}')">
                <span class="ticket-name">${type.name}</span>
                <span class="ticket-price">${type.price.toLocaleString('vi-VN')}đ</span>
            </div>
        `).join('');
    } else {
        ticketOptions.innerHTML = '<p>Không có loại vé nào khả dụng.</p>';
    }

    // Reset selected ticket
    selectedTickets.innerHTML = '';
    proceedButton.disabled = true;

    // Hiển thị modal
    modal.style.display = 'block';

    // Đóng modal khi nhấn nút close
    const closeButton = modal.querySelector('.close');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    // Đóng modal khi nhấn bên ngoài
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

let selectedTicketInfo = null;

function selectTicket(id, name, price, showtimeId, startTime, endTime) {
    const selectedTickets = document.getElementById('selected-tickets');
    const proceedButton = document.getElementById('proceed-to-payment');

    selectedTickets.innerHTML = `
        <h3>Vé đã chọn:</h3>
        <p>Phim: ${currentMovieInfo ? currentMovieInfo.title : 'N/A'}</p>
        <p>${name}: ${price.toLocaleString('vi-VN')}đ</p>
        <p><strong>Tổng cộng: ${price.toLocaleString('vi-VN')}đ</strong></p>
    `;

    proceedButton.disabled = false;

    // Lưu thông tin vé đã chọn
    selectedTicketInfo = { 
        id, 
        name, 
        price, 
        showtimeId,
        movieTitle: currentMovieInfo ? currentMovieInfo.title : 'N/A',
        startTime: startTime,
        endTime: endTime
    };

    // Highlight selected ticket
    document.querySelectorAll('.ticket-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`.ticket-option:nth-child(${id})`).classList.add('selected');
}

// thanh toán//
function proceedToPayment() {
    if (!selectedTicketInfo) {
        alert('Vui lòng chọn loại vé trước khi thanh toán.');
        return;
    }

    // Hiển thị form thông tin người dùng
    document.getElementById('user-info-form').style.display = 'block';
    document.getElementById('proceed-to-payment').style.display = 'none';
}




document.getElementById('user-info-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const phone = document.getElementById('user-phone').value.trim();

    if (!name || !email || !phone) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    // Regex kiểm tra email: phải có @ + tên miền + đuôi hợp lệ (.com, .vn, .net, ...)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn|net|org|edu|gov|info)$/i;
    // Regex kiểm tra số điện thoại: 10 số, bắt đầu bằng số 0
    const phoneRegex = /^0\d{9}$/;

    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ! Vui lòng nhập đúng định dạng (ví dụ: example@gmail.com).');
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0.');
        return;
    }

    

    // Tạo URL với các tham số cần thiết
    const paymentUrl = `payment.html?showtimeId=${selectedTicketInfo.showtimeId}&startTime=${encodeURIComponent(selectedTicketInfo.startTime)}&endTime=${encodeURIComponent(selectedTicketInfo.endTime)}&ticketType=${encodeURIComponent(selectedTicketInfo.name)}&price=${selectedTicketInfo.price}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&movieTitle=${encodeURIComponent(selectedTicketInfo.movieTitle)}`;


    // Chuyển hướng đến trang thanh toán
    window.location.href = paymentUrl;
});

document.getElementById('proceed-to-payment').addEventListener('click', function() {
    document.getElementById('ticket-selection-section').style.display = 'none';
    document.getElementById('user-info-section').style.display = 'block';
});


// Đóng modal khi nhấn nút close
document.querySelector('#ticket-modal .close').onclick = function() {
    document.getElementById('ticket-modal').style.display = 'none';
    // Reset về trạng thái ban đầu
    document.getElementById('ticket-selection-section').style.display = 'block';
    document.getElementById('user-info-section').style.display = 'none';
}

// Đóng modal khi nhấn bên ngoài
window.onclick = function(event) {
    if (event.target == document.getElementById('ticket-modal')) {
        document.getElementById('ticket-modal').style.display = 'none';
        // Reset về trạng thái ban đầu
        document.getElementById('ticket-selection-section').style.display = 'block';
        document.getElementById('user-info-section').style.display = 'none';
    }
}