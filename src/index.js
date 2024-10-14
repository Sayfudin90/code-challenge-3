// Constants for the base API URL
const BASE_URL = 'http://localhost:3000';

// Function to fetch the first film's details
const fetchFirstFilm = async () => {
    try {
        const response = await fetch(`${BASE_URL}/films/1`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const film = await response.json();
        displayFilmDetails(film);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

// Function to fetch all films
const fetchAllFilms = async () => {
    try {
        const response = await fetch(`${BASE_URL}/films`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const films = await response.json();
        populateFilmMenu(films);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

// Function to populate the films menu
const populateFilmMenu = (films) => {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = ''; // Clear the current list

    films.forEach(film => {
        const li = document.createElement('li');
        li.className = 'film item';
        li.innerText = film.title;

        // Add click event to fetch film details
        li.onclick = () => displayFilmDetails(film);

        // Add delete button for each film
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'ui red button';
        deleteButton.onclick = (event) => {
            event.stopPropagation(); // Prevent triggering film detail fetch
            deleteFilm(film.id, li);
        };

        li.appendChild(deleteButton);
        filmsList.appendChild(li);
    });
};

// Function to display the film's details
const displayFilmDetails = (film) => {
    const availableTickets = film.capacity - film.tickets_sold;

    document.getElementById('title').innerText = film.title;
    document.getElementById('poster').src = film.poster;
    document.getElementById('runtime').innerText = `${film.runtime} minutes`;
    document.getElementById('film-info').innerText = film.description;
    document.getElementById('showtime').innerText = film.showtime;
    document.getElementById('ticket-num').innerText = availableTickets;

    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.disabled = availableTickets <= 0;

    if (availableTickets > 0) {
        buyTicketButton.innerText = 'Buy Ticket';
        buyTicketButton.onclick = () => buyTicket(film);
    } else {
        buyTicketButton.innerText = 'Sold Out';
    }
};

// Function to buy a ticket
const buyTicket = async (film) => {
    const availableTickets = film.capacity - film.tickets_sold;

    if (availableTickets > 0) {
        const newTicketsSold = film.tickets_sold + 1; // Increment tickets sold
        const updatedFilm = { tickets_sold: newTicketsSold };

        try {
            const response = await fetch(`${BASE_URL}/films/${film.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFilm),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedFilmData = await response.json();
            displayFilmDetails(updatedFilmData); // Update the UI with the new film data
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    } else {
        alert('No tickets available!');
    }
};

// Function to delete a film
const deleteFilm = async (id, li) => {
    try {
        const response = await fetch(`${BASE_URL}/films/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Could not delete the film');
        }

        // Remove the film from the UI
        li.remove();
        alert('Film deleted successfully.');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

// Initialize the application
const init = () => {
    fetchFirstFilm();  // Fetch the first film details on page load
    fetchAllFilms();   // Fetch all films for the side menu
};

// Run the initialization function on page load
document.addEventListener('DOMContentLoaded', init);

