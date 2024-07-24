// pokemonApi.js
import { displayPokemon } from './domElements.js';

export async function getPokemonData(pokemon, isSearchResult = false) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const data = await response.json();
        displayPokemon(data, isSearchResult);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

export function saveSearch(pokemon) {
    let savedSearches = JSON.parse(localStorage.getItem('pokedexSearches')) || [];
    if (!savedSearches.includes(pokemon)) {
        savedSearches.push(pokemon);
        localStorage.setItem('pokedexSearches', JSON.stringify(savedSearches));
    }
}

export function loadSavedSearches() {
    const savedSearches = JSON.parse(localStorage.getItem('pokedexSearches')) || [];
    savedSearches.forEach(pokemon => getPokemonData(pokemon));
}
