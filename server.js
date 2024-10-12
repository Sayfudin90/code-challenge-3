const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample endpoint for films
const films = [
    {
        id: "1",
        title: "The Giant Gila Monster",
        runtime: "108",
        capacity: 30,
        showtime: "04:00PM",
        tickets_sold: 27,
        description: "A giant lizard terrorizes a rural Texas community and a heroic teenager attempts to destroy the creature.",
        poster: "https://www.gstatic.com/tv/thumb/v22vodart/2157/p2157_v_v8_ab.jpg"
    },
    // Add more film objects as needed
];

// Endpoint to get a specific film
app.get('/films/:id', (req, res) => {
    const film = films.find(f => f.id === req.params.id);
    if (film) {
        res.json(film);
    } else {
        res.status(404).send('Film not found');
    }
});

// Endpoint to get all films
app.get('/films', (req, res) => {
    res.json(films);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
