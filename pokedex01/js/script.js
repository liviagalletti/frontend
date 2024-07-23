const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('search');
const pokemonContainer = document.getElementById('pokemon-container');

let offset = 0;
const limit = 20; // Ajuste o limite conforme necessário

// Função para buscar dados do Pokémon
async function getPokemonData(pokemon, isSearchResult = false) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayPokemon(data, isSearchResult);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

// Função para exibir o Pokémon
function displayPokemon(pokemon, isSearchResult = false) {
    if (!pokemon || !pokemon.name || !pokemon.sprites || !pokemon.types) {
        console.error('Invalid Pokémon data:', pokemon);
        return;
    }

    const pokemonElement = document.createElement('div');
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
    
    // Adiciona a classe CSS correspondente ao primeiro tipo
    if (types.length > 0) {
        pokemonElement.classList.add(types[0]);
    }
    
    pokemonElement.classList.add('pokemon');
    pokemonElement.id = pokemon.name;
    pokemonElement.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Type: ${types.join(', ')}</p> <!-- Adiciona os tipos -->
    `;
    
    if (isSearchResult) {
        // Adiciona ao topo do container
        pokemonContainer.insertBefore(pokemonElement, pokemonContainer.firstChild);
    } else {
        pokemonContainer.appendChild(pokemonElement);
    }
}

// Função para buscar e salvar a pesquisa
searchBtn.addEventListener('click', () => {
    const pokemonName = searchInput.value.toLowerCase();
    if (pokemonName && !document.getElementById(pokemonName)) {
        getPokemonData(pokemonName, true); // Passa true para indicar que é um resultado de pesquisa
        saveSearch(pokemonName);
    } else {
        alert('Pokémon já carregado ou nome inválido!');
    }
});

// Função para salvar a pesquisa no localStorage
function saveSearch(pokemon) {
    let savedSearches = JSON.parse(localStorage.getItem('pokedexSearches')) || [];
    if (!savedSearches.includes(pokemon)) {
        savedSearches.push(pokemon);
        localStorage.setItem('pokedexSearches', JSON.stringify(savedSearches));
    }
}

// Função para carregar pesquisas salvas
function loadSavedSearches() {
    const savedSearches = JSON.parse(localStorage.getItem('pokedexSearches')) || [];
    savedSearches.forEach(pokemon => getPokemonData(pokemon));
}

// Função para limpar pesquisas salvas
clearBtn.addEventListener('click', () => {
    localStorage.removeItem('pokedexSearches');
    pokemonContainer.innerHTML = '';
    offset = 0;
    loadInitialPokemons();
});

// Função para carregar Pokémons iniciais
function loadInitialPokemons() {
    for (let i = 1; i <= limit; i++) {
        getPokemonData(i);
    }
}

// Função para carregar mais Pokémons
loadMoreBtn.addEventListener('click', () => {
    offset += limit;
    for (let i = offset + 1; i <= offset + limit; i++) {
        getPokemonData(i);
    }
});

// Adiciona um evento de rolagem
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Detecta rolagem para cima e faz a página rolar para o topo se estiver suficientemente perto
    if (scrollTop < 100) { // Ajuste o valor conforme necessário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Chame as funções quando a página for carregada
window.addEventListener('load', () => {
    loadInitialPokemons();
    loadSavedSearches();
});
