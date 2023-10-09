const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");

// Function to fetch data and display results
function fetchData() {
    const word = inpWord.value.trim(); // Remove leading/trailing spaces
    if (!word) {
        // Handle empty input
        result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        return;
    }

    fetch(`${url}${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            if (data && data.length > 0) {
                const wordInfo = data[0];

                result.innerHTML = `
                    <div class="word">
                        <h3>${wordInfo.word}</h3>
                        <button onclick="playSound()">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                    <div class="details">
                        <p>${wordInfo.phonetic}</p>
                    </div>
                    <div class="meanings">
                        <h4>Meanings:</h4>
                        <ul>
                            ${wordInfo.meanings.map(meaning => `
                                <li>${meaning.partOfSpeech}:
                                    <ul>
                                        ${meaning.definitions.map(definition => `
                                            <li>${definition.definition}</li>
                                            <ul>
                                                ${definition.example ? `<li>Example: ${definition.example}</li>` : ''}
                                            </ul>
                                        `).join('')}
                                    </ul>
                                </li>
                            `).join('')}
                        </ul>
                    </div>`;

                if (wordInfo.phonetics && wordInfo.phonetics.length > 0 && wordInfo.phonetics[0].audio) {
                    sound.setAttribute("src", `https:${wordInfo.phonetics[0].audio}`);
                } else {
                    sound.removeAttribute("src"); 
                }
            } else {
                result.innerHTML = `<h3 class="error">Word not found</h3>`;
                sound.removeAttribute("src"); 
            }
        })
        .catch(error => {
            console.error('Error:', error);
            result.innerHTML = `<h3 class="error">Word not Found</h3>`;
            sound.removeAttribute("src"); 
        });
}

// Event listener for clicking the button
btn.addEventListener("click", fetchData);

// Event listener for Enter key press
inpWord.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        fetchData();
    }
});

function playSound() {
    sound.play();
}
