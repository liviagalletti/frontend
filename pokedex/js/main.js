// main.js
import { searchBtn, clearBtn, loadMoreBtn, searchInput, pokemonContainer, capitalizeFirstLetter, displayPokemon } from './domElements.js';
import { getPokemonData, saveSearch, loadSavedSearches } from './pokemonApi.js';

let offset = 0;
const limit = 3;

searchBtn.addEventListener('click', () => {
    const pokemonName = searchInput.value.toLowerCase();
    if (pokemonName && !document.getElementById(pokemonName)) {
        getPokemonData(pokemonName, true);
        saveSearch(pokemonName);
    } else {
        alert('Pokémon já carregado ou nome inválido!');
    }
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('pokedexSearches');
    pokemonContainer.innerHTML = '';
    offset = 0;
    loadInitialPokemons();
});

function loadInitialPokemons() {
    for (let i = 1; i <= limit; i++) {
        getPokemonData(i);
    }
}

loadMoreBtn.addEventListener('click', () => {
    offset += limit;
    for (let i = offset + 1; i <= offset + limit; i++) {
        getPokemonData(i);
    }
});

window.addEventListener('load', () => {
    loadInitialPokemons();
    loadSavedSearches();
});
