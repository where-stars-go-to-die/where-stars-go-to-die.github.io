const itemsContainer = document.getElementById('inventory-items-container');
const pokemonContainer = document.getElementById('captured-pokemon-list');

const inventory = document.getElementById('inventory-modal');
const pokemon = document.getElementById('pokemon-management-modal');

let loggedPlayer = {
    name: "Ryan",
    id: "ryan_id"
};

let currentInventory = [];
let currentPokemon = [];

function openInventory(playerName = null, itemsArray = null) {
    const nameToDisplay = playerName ? playerName : loggedPlayer.name;

    if (!itemsArray) {
        currentInventory = currentInventory.length > 0 ? currentInventory : [];
    } else {
        currentInventory = itemsArray;
    }

    document.getElementById('inventory-player-name').textContent = nameToDisplay.toUpperCase();

    renderInventory();
    inventory.classList.remove('hidden');
}

function openPokemon(playerName = null, itemsArray = null) {
    const nameToDisplay = playerName ? playerName : loggedPlayer.name;

    if (!itemsArray) {
        currentPokemon = currentPokemon.length > 0 ? currentPokemon : [];
    } else {
        currentPokemon = itemsArray;
    }

    document.getElementById('manage-player-name').textContent = nameToDisplay.toUpperCase();

    renderPokemon();
    pokemon.classList.remove('hidden');
}

function closeInventory() {
    inventory.classList.add('hidden');
}

function closePokemon() {
    pokemon.classList.add('hidden');
}

function renderInventory() {
    itemsContainer.innerHTML = '';

    for (let index in currentInventory) {
        const item = currentInventory[index];

        const itemRow = document.createElement('div');
        itemRow.className = 'inventory-item-row';

        itemRow.innerHTML = `
            <div class="inventory-section">
                <input type="text" class="inventory-item-input" value="${item.name}" onchange="updateItemName(${index}, this.value)">
                <input type="number" class="inventory-qty-input" value="${item.quantity}" min="1" onchange="updateItemQty(${index}, this.value)">
            </div>

            <button class="item-delete-btn" onclick="removeItem(${index})">×</button>
        `;

        itemsContainer.appendChild(itemRow);
    }
}

function renderPokemon() {
    pokemonContainer.innerHTML = '';

    for (let index in currentPokemon) {
        const item = currentPokemon[index];

        const itemRow = document.createElement('button');
        itemRow.className = 'captured-item';

        itemRow.innerHTML = `
            <div class="item-avatar"></div>
            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">POKÉMON NAME</span>
                    <span class="poke-item-lvl">LVL 12</span>
                </div>
                <div class="health-bar-container green-bar">
                    <div class="health-bar-fill" style="width: 100%;"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP 12 / 12</span>
                    <span>HAPPINESS 5 / 10</span>
                </div>
            </div>
        `;

        pokemonContainer.appendChild(itemRow);
    }
}

document.getElementById('add-item-btn').addEventListener('click', () => {
    currentInventory.push({ name: '', quantity: 1 });
    renderInventory();
});

document.getElementById('add-pokemon-btn').addEventListener('click', () => {
    currentPokemon.push({ name: '', quantity: 1 });
    renderPokemon();
});

function updateItemName(index, val) {
    currentInventory[index].name = val;
}

function updateItemQty(index, val) {
    currentInventory[index].quantity = val || 1;
}

function removeItem(index) {
    currentInventory.splice(index, 1);
    renderInventory();
}