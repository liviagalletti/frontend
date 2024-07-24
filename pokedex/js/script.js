const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('search');
const pokemonContainer = document.getElementById('pokemon-container');

let offset = 0;
const limit = 3;

// Get Pokémon Api
async function getPokemonData(pokemon, isSearchResult = false) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const data = await response.json();
        displayPokemon(data, isSearchResult);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Display Pokémon
function displayPokemon(pokemon, isSearchResult = false) {
    const pokemonElement = document.createElement('div');
    const types = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');
    const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);

    pokemonElement.classList.add(types.split(', ')[0]);
    pokemonElement.classList.add('pokemon');
    pokemonElement.id = pokemon.name;
    pokemonElement.innerHTML = `
        <h2>${capitalizedPokemonName}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Type: ${types}</p>
    `;
    
    if (isSearchResult) {
        pokemonContainer.insertBefore(pokemonElement, pokemonContainer.firstChild);
    } else {
        pokemonContainer.appendChild(pokemonElement);
    }
}

// Search and Save 
searchBtn.addEventListener('click', () => {
    const pokemonName = searchInput.value.toLowerCase();
    if (pokemonName && !document.getElementById(pokemonName)) {
        getPokemonData(pokemonName, true); // Passa true para indicar que é um resultado de pesquisa
        saveSearch(pokemonName);
    } else {
        alert('Pokémon já carregado ou nome inválido!');
    }
});

// Save into localStorage
function saveSearch(pokemon) {
    let savedSearches = JSON.parse(localStorage.getItem('pokedexSearches')) || [];
    if (!savedSearches.includes(pokemon)) {
        savedSearches.push(pokemon);
        localStorage.setItem('pokedexSearches', JSON.stringify(savedSearches));
    }
}

// Load saved search
function loadSavedSearches() {
    const savedSearches = JSON.parse(localStorage.getItem('pokedexSearches')) || [];
    savedSearches.forEach(pokemon => getPokemonData(pokemon));
}

// Clear search 
clearBtn.addEventListener('click', () => {
    localStorage.removeItem('pokedexSearches');
    pokemonContainer.innerHTML = '';
    offset = 0;
    loadInitialPokemons();
});

// Load First Pokémons 
function loadInitialPokemons() {
    for (let i = 1; i <= limit; i++) {
        getPokemonData(i);
    }
}

// Load More Pokemons
loadMoreBtn.addEventListener('click', () => {
    offset += limit;
    for (let i = offset + 1; i <= offset + limit; i++) {
        getPokemonData(i);
    }
});



// Chame as funções quando a página for carregada
window.addEventListener('load', () => {
    loadInitialPokemons();
    loadSavedSearches();
});
