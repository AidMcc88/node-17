document.addEventListener('DOMContentLoaded', () => {
    loadTitans();
    document.getElementById('add-titan-button').addEventListener('click', () => toggleTitanForm());
    document.getElementById('titan-form').addEventListener('submit', handleFormSubmit);
});

let currentEditingId = null; // Track the id of the titan being edited
let titans = []; // Store the loaded titans globally

async function loadTitans() {
    try {
        const response = await fetch('/api/titans');
        titans = await response.json(); // Store the loaded titans globally
        displayTitans(titans);
    } catch (error) {
        console.error('Error loading titans:', error);
    }
}

function displayTitans(newTitans) {
    const titanList = document.getElementById('titan-list');
    titanList.innerHTML = '';

    newTitans.forEach(titan => {
        const titanElement = document.createElement('section');
        titanElement.id = `titan-${titan._id}`;
        titanElement.classList.add('titan');
        titanElement.innerHTML = `
            <h3>${titan.name}</h3>
            <p><strong>Class:</strong> ${titan.class}</p>
            <p><strong>Weapon:</strong> ${titan.weapon}</p>
            <p><strong>Ability 1:</strong> ${titan.ability1}</p>
            <p><strong>Ability 2:</strong> ${titan.ability2}</p>
            <p><strong>Ability 3:</strong> ${titan.ability3}</p>
            <img src="${titan.img}" alt="${titan.name} Image">
            <button onclick="editTitan(${titan._id})">Edit</button>
            <button onclick="deleteTitan(${titan._id})">Delete</button>
        `;
        titanList.appendChild(titanElement);
    });
}

function toggleTitanForm(edit = false) {
    const formContainer = document.getElementById('titan-form-container');
    formContainer.classList.toggle('hidden');
    if (!edit) {
        currentEditingId = null;
        document.getElementById('titan-form').reset();
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const fetchOptions = {
        method: currentEditingId ? 'PUT' : 'POST',
        body: formData,
    };

    const url = currentEditingId ? `/api/titans/${currentEditingId}` : '/api/titans';

    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Update the titans array
        titans = result;

        // Update the UI
        displayTitans(titans);

        toggleTitanForm();
        currentEditingId = null; // Reset currentEditingId after a successful update
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

async function editTitan(titanId) {
    const titanToEdit = titans.find(titan => titan._id === titanId);
    if (titanToEdit) {
        const form = document.getElementById('titan-form');
        form.elements.name.value = titanToEdit.name;
        form.elements.class.value = titanToEdit.class;
        form.elements.weapon.value = titanToEdit.weapon;
        form.elements.ability1.value = titanToEdit.ability1;
        form.elements.ability2.value = titanToEdit.ability2;
        form.elements.ability3.value = titanToEdit.ability3;
        currentEditingId = titanId;
        toggleTitanForm(true);
    }
}

async function deleteTitan(titanId) {
    if (confirm('Are you sure you want to delete this titan?')) {
        try {
            const response = await fetch(`/api/titans/${titanId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            // Update the titans array
            titans = result;
            // Update the UI
            displayTitans(titans);
        } catch (error) {
            console.error('Error deleting titan:', error);
        }
    }
}
