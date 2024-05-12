"use strict";

const slcHouses = document.getElementById("houses");
const rdbLocation = document.getElementById("ancestry");

let filteredCharacters;

window.addEventListener("load", initialise);
slcHouses.addEventListener("change", updateCharacters);
rdbLocation.addEventListener("change", updateCharacters);

function initialise() {
    fillHouseFilter();
    fillAncestryRadioButtons();
    updateCharacters();
}

function fillHouseFilter() {
    let listOfHouses = potterCharacters.reduce((houses, h) => {
        if (!houses.includes(h.house)) {
            houses.push(h.house.toString());
        }
        return houses;
    }, []);

    if (listOfHouses.includes("")) listOfHouses[listOfHouses.indexOf("")] = "Homeless";

    listOfHouses.sort()
        .unshift("All");

    listOfHouses.forEach(h => slcHouses[slcHouses.length] = new Option(h));
}

function fillAncestryRadioButtons() {
    let listOfAncestry = potterCharacters.reduce((ancestry, a) => {
        if (!ancestry.includes(a.ancestry)) {
            ancestry.push(a.ancestry.toString());
        }
        return ancestry;
    }, []);

    if (listOfAncestry.includes("")) listOfAncestry[listOfAncestry.indexOf("")] = "not mentioned";

    listOfAncestry.sort()
        .unshift("all");

    let buttonParagraph = document.createElement("p");

    listOfAncestry.forEach(a => {
        let newRadioButton = document.createElement("input");
        let newLabel = document.createElement("label");
        newRadioButton.setAttribute("type", "radio");
        newRadioButton.setAttribute("name", "ancestry");
        newLabel.appendChild(newRadioButton);
        newLabel.innerHTML += a;
        buttonParagraph.appendChild(newLabel);
    });

    rdbLocation.appendChild(buttonParagraph);

    let rdbFirstButton = document.querySelector("div#ancestry > p > label > input");
    rdbFirstButton.checked = true;
}

function updateCharacters() {
    const main = document.querySelector("main");
    const selectedHouse = slcHouses[slcHouses.selectedIndex].value;
    const ancestryButtons = document.querySelectorAll("input");
    const lblArray = document.querySelectorAll("label");

    let checkedRadioButton;
    let filteredCharacters = potterCharacters;

    clearMainElement();

    for (let i = 0; i < ancestryButtons.length; i++) {
        if (ancestryButtons[i].checked === true) {
            checkedRadioButton = i;
            break;
        }
    }

    if (selectedHouse === "Homeless") {
        filteredCharacters = filteredCharacters.filter(h => h.house === "");
    } else if (selectedHouse !== "All") {
        filteredCharacters = filteredCharacters.filter(h => h.house === selectedHouse);
    }

    if (checkedRadioButton === 3) {
        filteredCharacters = filteredCharacters.filter(a => a.ancestry === "");
    } else if (checkedRadioButton !== 0) {
        filteredCharacters = filteredCharacters.filter(a => a.ancestry === lblArray[checkedRadioButton].innerText);
    }

    if (filteredCharacters.length !== 0) {
        for (const character of filteredCharacters) {
            const status = checkCharacterStatus(character);

            let artCharacter = document.createElement("article");

            if (character.house === "") artCharacter.setAttribute("class", "no-data tooltip");
            else artCharacter.setAttribute("class", `${character.house.toLowerCase()} tooltip`);
// REMOVE MORE HTML FORMAT OUT OF THE JAVASCRIPT
            artCharacter.innerHTML = `<img src="${character.image}" alt="${character.name}">`;
            artCharacter.innerHTML += `<p class="tooltiptext">Wizard: ${character.wizard}<br>Status: ${status}</p>`;
            artCharacter.innerHTML += `<h2>${character.name}</h2>`;
            artCharacter.innerHTML += `<p class="color-white-smoke">${character.actor}</p>`;

            main.appendChild(artCharacter);
        }
    } else {
        let noCharacters = document.createElement("h3");
        noCharacters.innerText = "There are no characters with the current selected filters. Please adjust the filters.";

        main.appendChild(noCharacters);
    }
}

function clearMainElement() {
    let elementsToRemove = document.querySelectorAll("main *");
    for (const element of elementsToRemove) element.remove();
}

function checkCharacterStatus(character) {
    if (character.hogwartsStudent) return "Student";
    else if (character.hogwartsStaff) return "Staff";
    else return "Most likely evil in some sort of way";
}