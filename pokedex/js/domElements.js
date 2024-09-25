// domElements.js
export const searchBtn = document.getElementById('searchBtn');
export const clearBtn = document.getElementById('clearBtn');
export const loadMoreBtn = document.getElementById('loadMoreBtn');
export const searchInput = document.getElementById('search');
export const pokemonContainer = document.getElementById('pokemon-container');

export function displayPokemon(pokemon, isSearchResult = false) {
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

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
