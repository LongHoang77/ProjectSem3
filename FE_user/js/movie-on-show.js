document.addEventListener('DOMContentLoaded', function() {
    axios.get('http://localhost:5000/Movie?page=1&limit=2&activeOnly=true')
        .then(function (response) {
            const movies = response.data.movies;
            const container = document.getElementById('nowShowingMovies');


            const vietnameseMonths = [
                'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
                'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
            ];

            movies.forEach((movie, index) => {
                const releaseDate = new Date(movie.releaseDate);
                const endDate = new Date(movie.endDate);
                
                const startDay = releaseDate.getDate();
                const startMonth = vietnameseMonths[releaseDate.getMonth()];
                const startYear = releaseDate.getFullYear();
                
                const endDay = endDate.getDate();
                const endMonth = vietnameseMonths[endDate.getMonth()];
                const endYear = endDate.getFullYear();

                const movieElement = `
                    <div class="col-lg-12 col-12 mb-5">
                        <div class="custom-block d-flex">
                            <div class="custom-block-date-wrap">
                                <div class="date-box start-date">
                                    <span class="custom-block-date">${startDay}</span>
                                    <span class="custom-block-month-year">${startMonth} ${startYear}</span>
                                </div>
                                <div class="date-box end-date">
                                    <span class="custom-block-date">${endDay}</span>
                                    <span class="custom-block-month-year">${endMonth} ${endYear}</span>
                                </div>
                            </div>
                            <div class="custom-block-image-wrap">
                                <a href="movie-detail.html?id=${movie.id}">
                                    <img src="${movie.posterUrl}" class="custom-block-image img-fluid" alt="${movie.title}">
                                    <i class="custom-block-icon bi-link"></i>
                                </a>
                            </div>

                            <div class="custom-block-info">
                                <a href="event-detail.html?id=${movie.id}" class="events-title mb-2">${movie.title}</a>

                                <p class="mb-0">${movie.description.substring(0, 150)}...</p>

                                <div class="d-flex flex-wrap border-top mt-3 pt-3">
                                    <div class="mb-4 mb-lg-0">
                                        <div class="d-flex flex-wrap align-items-center mb-1">
                                            <span class="custom-block-span">Thời lượng:</span>
                                            <p class="mb-0">${movie.duration} phút</p>
                                        </div>

                                        <div class="d-flex flex-wrap align-items-center">
                                            <span class="custom-block-span">Thể loại:</span>
                                            <p class="mb-0">${movie.genre}</p>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center ms-lg-auto">
                                        <a href="movie-detail.html?id=${movie.id}" class="btn custom-btn">Chi tiết</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += movieElement;
            });
        })
        .catch(function (error) {
            console.error('Error fetching movies:', error);
        });
});