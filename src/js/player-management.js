/* ==========================================================================
   1. STATES AND GLOBAL SELECTORS
   ========================================================================== */

// Player elements
const itemsContainer = document.getElementById('inventory-items-container');
const pokemonContainer = document.getElementById('captured-pokemon-list');

// Modals
const inventoryModal = document.getElementById('inventory-modal');
const pokemonModal = document.getElementById('pokemon-management-modal');
const editPokemonModal = document.getElementById('edit-pokemon-modal');

// Pokémon Attributtes
const pokeLevelUpVelocity = document.getElementById('poke-level-velocity');
const totalXPInput = document.getElementById('total-xp');
const xpToAddInput = document.getElementById('xp-to-add');
const currentLvlDisplay = document.getElementById('current-level');

/* ==========================================================================
   2. LEVEL & XP RULES
   ========================================================================== */
function getMinimumXp(level, velocity) {
    switch (velocity) {
        case "fast": return 0.8 * level * level;
        case "medium": return 1.0 * level * level;
        case "slow": return 1.25 * level * level;
        case "pseudo-legendary": return 1.5 * level * level;
        case "legendary": return 2.0 * level * level;
        default: return 1.0 * level * level;
    }
}

function calculateLevel(xpTotal) {
    if (!pokeLevelUpVelocity) return 5;
    const velocity = pokeLevelUpVelocity.value.toLowerCase();
    const xpInput = parseFloat(xpTotal) || 0;

    const baseXpForLvl5 = getMinimumXp(5, velocity);
    const totalXp = xpInput + baseXpForLvl5;

    let level = 5;

    switch (velocity) {
        case "fast": level = Math.floor(Math.sqrt(totalXp / 0.8)); break;
        case "medium": level = Math.floor(Math.sqrt(totalXp / 1.0)); break;
        case "slow": level = Math.floor(Math.sqrt(totalXp / 1.25)); break;
        case "pseudo-legendary": level = Math.floor(Math.sqrt(totalXp / 1.5)); break;
        case "legendary": level = Math.floor(Math.sqrt(totalXp / 2.0)); break;
        default: level = Math.floor(Math.sqrt(totalXp / 1.0)); break;
    }

    return Math.max(5, level);
}

function updateLevel() {
    if (!totalXPInput) return;
    const currentXP = totalXPInput.value;
    const level = calculateLevel(currentXP);

    if (currentLvlDisplay) {
        currentLvlDisplay.textContent = level;
    }
}

function addXP() {
    if (!totalXPInput || !xpToAddInput) return;
    const currentTotal = parseInt(totalXPInput.value, 10) || 0;
    const addedXP = parseInt(xpToAddInput.value, 10) || 0;

    totalXPInput.value = currentTotal + addedXP;
    xpToAddInput.value = '';

    updateLevel();
}

/* ==========================================================================
   3. INVENTORY MANAGEMENT
   ========================================================================== */
function renderInventory() {
    if (!itemsContainer) return;
    itemsContainer.innerHTML = '';

    for (let index in characterState.inventory) {
        const item = characterState.inventory[index];
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

function updateItemName(index, val) {
    characterState.inventory[index].name = val;
}

function updateItemQty(index, val) {
    characterState.inventory[index].quantity = parseInt(val, 10) || 1;
}

function removeItem(index) {
    characterState.inventory.splice(index, 1);
    renderInventory();
}

/* ==========================================================================
   4. CAPTURED POKEMON MANAGEMENT
   ========================================================================== */
function renderPokemonBasicInfo() {
    if (!pokemonContainer) return;
    pokemonContainer.innerHTML = '';

    for (let index in characterState.capturedPokemon) {
        const poke = characterState.capturedPokemon[index];
        const itemRow = document.createElement('button');
        itemRow.className = 'captured-item';

        itemRow.innerHTML = `
            <div class="item-avatar"></div>
            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">${poke.species || 'POKÉMON NAME'}</span>
                    <span class="poke-item-lvl">LVL ${poke.level || 1}</span>
                </div>
                <div class="health-bar-container green-bar">
                    <div class="health-bar-fill" style="width: 100%;"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP 12 / 12</span>
                    <span>HAPPINESS ${poke.happiness || 0} / 10</span>
                </div>
            </div>
        `;

        pokemonContainer.appendChild(itemRow);
    }
}

/* ==========================================================================
   5. MODAL AND UI CONTROL
   ========================================================================== */

function openInventory(itemsArray = null) {
    if (itemsArray) characterState.inventory = itemsArray;

    updateAllPlayerNames()

    renderInventory();
    inventoryModal?.classList.remove('hidden');
}

function closeInventory() {
    inventoryModal?.classList.add('hidden');
}

function updateAllPlayerNames() {
    const nameElements = document.querySelectorAll('.get-player-name');

    nameElements.forEach(el => {
        el.textContent = characterState.name.toUpperCase();
    });
}

function openPokemon(pokeArray = null) {
    if (pokeArray) characterState.capturedPokemon = pokeArray;

    updateAllPlayerNames()

    renderPokemonBasicInfo();
    pokemonModal?.classList.remove('hidden');
}

function closePokemon() {
    pokemonModal?.classList.add('hidden');
}

function openEditPokemon() {
    if (editPokemonModal) {
        editPokemonModal.classList.remove('hidden');
        updateAllEffectInputs();
    }
}

function closeEditPokemon() {
    editPokemonModal?.classList.add('hidden');
}

function toggleEffectInput(checkbox) {
    const textInput = checkbox.nextElementSibling;
    if (textInput) {
        textInput.disabled = !checkbox.checked;
    }
}

function updateAllEffectInputs() {
    const checkboxes = document.querySelectorAll('#edit-pokemon-modal .custom-checkbox');
    checkboxes.forEach(checkbox => toggleEffectInput(checkbox));
}

/* ==========================================================================
   6. EVENT LISTENERS
   ========================================================================== */
document.getElementById('add-item-btn')?.addEventListener('click', () => {
    characterState.inventory.push({ name: '', quantity: 1 });
    renderInventory();
});

document.getElementById('add-pokemon-btn')?.addEventListener('click', () => {
    addPokemon();
});

function addPokemon() {
    characterState.capturedPokemon.push({
        species: 'NEW POKÉMON',
        level: 5,
        type1: '',
        type2: '',
        levelSpeed: '',
        xp: 0,
        hp: 0,
        capturedBy: '',
        item: '',
        happiness: 1,
        nature: '',
        ability: '',
        status: {
            hp: 5,
            atk: 5,
            spAtk: 5,
            def: 5,
            spDef: 5,
            spd: 5
        },
        attacks: [
            { atkName: '', atkType: '', pp: 10, pwr: 40, haveEffect: false, effect: '' }
        ]
    });

    console.log(characterState);

    renderPokemonBasicInfo();
}

document.getElementById('add-xp')?.addEventListener('click', () => {
    addXP();
});

pokeLevelUpVelocity?.addEventListener('change', () => {
    updateLevel();
});