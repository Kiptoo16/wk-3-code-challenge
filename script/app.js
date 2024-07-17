const apiUrl = "https://flatdango-deploy.vercel.app/films";

const fetchAndDisplayInitialMovie = () => {
    fetch(`${apiUrl}/1`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => displayMovieDetails(data))
        .catch(error => console.error('Error fetching initial movie details:', error));
}


function displayMovieDetails(movie) {
    const { title, runtime, showtime, tickets_sold, capacity, description, poster } = movie;
    const availableTickets = capacity - tickets_sold;

    const movieInfo =
        `<h3>${title}</h3>
         <p><strong>Description:</strong> ${description}</p>
         <p><strong>Runtime:</strong> ${runtime} minutes</p>
         <p><strong>Showtime:</strong> ${showtime}</p>
         <p><strong>Available Tickets:</strong> ${availableTickets}</p>
         <img src="${poster}" alt="${title} Poster">`;

    document.getElementById('movie-info').innerHTML = movieInfo;

    
    const purchaseBtn = document.getElementById('ticket-purchase');
    purchaseBtn.textContent = availableTickets === 0 ? "Sold Out" : "Purchase Ticket";
    purchaseBtn.disabled = availableTickets === 0;

    purchaseBtn.addEventListener('click', () => {
        if (availableTickets !== 0) {
            
            movie.tickets_sold++;
            displayMovieDetails(movie);
            alert('Ticket purchased!');
        } else {
            alert('Tickets are sold out!');
        }
    });
}

function fetchAndDisplayFilmMenu() {
    fetch(`${apiUrl}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filmList = document.getElementById('films');
            filmList.innerHTML = '';

            data.forEach(film => {
                const { id, title, tickets_sold, capacity } = film;
                const availableTickets = capacity - tickets_sold;
                const filmItem = document.createElement('li');

                filmItem.textContent = title;
                filmItem.classList.add('film', 'item');
                if (availableTickets === 0) {
                    filmItem.classList.add('sold-out');
                }

                filmItem.addEventListener('click', () => {
                    fetch(`${apiUrl}/${id}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => displayMovieDetails(data))
                        .catch(error => console.error('Error fetching movie details:', error));
                });

                filmList.appendChild(filmItem);
            });
        })
        .catch(error => console.error('Error fetching film menu:', error));
}

fetchAndDisplayInitialMovie();
fetchAndDisplayFilmMenu();