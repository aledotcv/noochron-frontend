document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('view.html')) {
        console.log("window.location.pathname", window.location.pathname);
        return;
    }

    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('greeting').innerHTML = `<strong>Hola, ${username} 👋</strong>`;
    } else {
        window.location.href = 'index.html';
    }
    await getNotes();
});

async function getNotes() {
    try {
        let sessionId = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        let url = 'https://enabled-elephant-presently.ngrok-free.app/notes';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'x-session-id': sessionId,
                'x-user-id': userId
            }
        });

        if (response.ok) {
            const notes = await response.json();
            console.log('Notes:', notes);
            populateNotes(notes);
        } else {
            const errorText = await response.text();
            window.location.href = 'index.html';
            alert(`Ocurrio un error al obtener las notas`);
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = 'index.html';
        alert('Ocurrio un error al obtener las notas.');
    }
}
function truncateStr(string, length){
    if(string.length >= length){
        return string.slice(0, length) + "..."
    }
    else{
        return string;
    }
}
function populateNotes(notes) {
    const notesContainer = document.querySelector('.container .row');
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        notesContainer.innerHTML = '<p>No has creado notas.</p>';
        return;
    }


    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'col';

        noteElement.innerHTML = `
            <div class="card" data-note-id="${note.noteId}" style="animation: bounceIn 1.1s;">
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col">
                            <h4>${note.title}</h4>
                            <p>${truncateStr(note.content, 30)}</p>
                        </div>
                        <div class="col">
                            ${note.tags.split(',').map(tag => `<p style="width: 146px;background: #3e68ff;border-radius: 11px;color: var(--bs-body-bg);text-align: center;">${tag}</p>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        noteElement.querySelector('.card').addEventListener('click', () => openNoteModal(note));
        notesContainer.appendChild(noteElement);
    });
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0);
    }
    10% {
        transform: scale(.2);
    }

    70% {
        transform: scale(1.05);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
`;
document.head.appendChild(style);

function openNoteModal(note) {
    const modal = document.getElementById('noteModal');
    modal.querySelector('#noteTitle').value = note.title;
    modal.querySelector('#noteContent').value = note.content;
    modal.querySelector('#noteTags').value = note.tags;
    modal.querySelector('#noteId').value = note.noteId;
    modal.style.display = 'block';
}

document.querySelectorAll('#saveNote').forEach(button => {
    button.addEventListener('click', async () => {
        const noteId = document.getElementById('noteId').value;
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        const tags = document.getElementById('noteTags').value;
        const sessionId = localStorage.getItem('sessionId');
        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch(`https://enabled-elephant-presently.ngrok-free.app/notes`, {
                method: noteId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'x-session-id': sessionId,
                    'x-user-id': userId,
                    'x-note-id': noteId
                },
                body: JSON.stringify({ title, content, tags, userId })
            });

            if (response.ok) {
                await getNotes();
                closeModal();
            } else {
                const errorText = await response.text();
                alert(`Ocurrio un error al ${noteId ? 'actualizar' : 'crear'} la nota: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Ocurrio un error al ${noteId ? 'actualizar' : 'crear'} la nota.`);
        }
    });
});

document.querySelectorAll('#deleteNote').forEach(button => {
    button.addEventListener('click', async () => {
        const noteId = document.getElementById('noteId').value;
        const sessionId = localStorage.getItem('sessionId');
        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch(`https://enabled-elephant-presently.ngrok-free.app/notes`, {
                method: 'DELETE',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'x-session-id': sessionId,
                    'x-user-id': userId,
                    'x-note-id': noteId
                }
            });

            if (response.ok) {
                await getNotes();
                closeModal();
            } else {
                const errorText = await response.text();
                alert(`Ocurrio un error al eliminar la nota: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrio un error al eliminar la nota.');
        }
    });
});

document.querySelectorAll('#createNote').forEach(button => {
    button.addEventListener('click', () => {
        openNoteModal({ title: '', content: '', tags: '', noteId: '' });
    });
});

document.querySelectorAll('#searchButton').forEach(button => {
    button.addEventListener('click', async () => {
        const searchTerm = document.getElementById('searchInput').value;
        const activeFilter = document.querySelector('.nav-link.active').getAttribute('data-search-type');
        const sessionId = localStorage.getItem('sessionId');
        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch('https://enabled-elephant-presently.ngrok-free.app/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'x-session-id': sessionId,
                    'x-user-id': userId,
                    'type-search': activeFilter
                },
                body: JSON.stringify({ query: searchTerm })
            });

            if (response.ok) {
                const searchResults = await response.json();
                console.log('Search Results:', searchResults);
                if (searchResults.length === 0) {
                    alert('No se encontraron resultados. Mostrando todas las notas.');
                    await getNotes();
                } else {
                    populateNotes(searchResults);
                }
            } else {
                const errorText = await response.text();
                alert(`Ocurrio un error al buscar las notas: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrio un error al buscar las notas.');
        }
    });
});

document.querySelectorAll('#clearButton').forEach(button => {
    button.addEventListener('click', async () => {
        document.getElementById('searchInput').value = '';
        await getNotes();
    });
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
    });
});

document.getElementById('addReminder').addEventListener('click', () => {
    const title = document.getElementById('noteTitle').value;
   // const content = document.getElementById('noteContent').value;
   const content = "Recordatorio para tu nota de inMind."; 
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(now.getDate() + 2);

    const startDate = formatDate(tomorrow);
    const endDate = formatDate(dayAfterTomorrow);
    const recurrence = "FREQ=DAILY";

    const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(title)}&details=${encodeURIComponent(content)}&dates=${startDate}/${endDate}&recur=${encodeURIComponent(recurrence)}&ctz=America/MexicoCity`;

    window.open(googleCalendarUrl, '_blank');
});

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}
document.getElementById('closeModalView').addEventListener('click', closeModal);
function closeModal() {
    const modal = document.getElementById('noteModal');
    modal.style.display = 'none';
}

document.getElementById('voiceInput').addEventListener('click', startVoiceRecognition);

function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert('Tu navegador no soporta reconocimiento de voz. Intenta con Chrome o Edge.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    const voiceButton = document.getElementById('voiceInput');
    voiceButton.style.backgroundColor = '#dc3545';
    voiceButton.textContent = '⏺️';

    try {
        recognition.start();
    } catch (error) {
        alert('Error al iniciar el reconocimiento de voz. Asegurate de permitir el acceso al micrófono.');
        voiceButton.style.backgroundColor = '#6c757d';
        voiceButton.textContent = '🎤';
        return;
    }

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const noteContentTextarea = document.getElementById('noteContent');
        noteContentTextarea.value += (noteContentTextarea.value ? ' ' : '') + transcript;
    };

    recognition.onerror = (event) => {
        let errorMessage = 'Error generico en el reconocimiento de voz';

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            errorMessage = 'Debes permitir el acceso al micrófono para usar esta función';
        } else if (event.error === 'no-speech') {
            errorMessage = 'No se detectó ninguna voz. Intenta de nuevo';
        } else if (event.error === 'network') {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet, permisos del navegador o intenta con otro navegador';
        }

        alert(errorMessage);
        voiceButton.style.backgroundColor = '#6c757d';
        voiceButton.textContent = '🎤';
    };

    recognition.onend = () => {
        voiceButton.style.backgroundColor = '#6c757d';
        voiceButton.textContent = '🎤';
    };
}

let currentSpeech = null;

document.getElementById('textToSpeech').addEventListener('click', startTextToSpeech);

function startTextToSpeech() {
    if (!window.speechSynthesis) {
        alert('Tu navegador no soporta TTS. Intenta con Chrome, Edge o Safari.');
        return;
    }

    const noteContent = document.getElementById('noteContent').value;
    const ttsButton = document.getElementById('textToSpeech');

    if (!noteContent.trim()) {
        alert('No hay contenido para reproducir en la nota');
        return;
    }

    if (currentSpeech && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        currentSpeech = null;
        ttsButton.style.backgroundColor = '#17a2b8';
        ttsButton.textContent = '🔊';
        return;
    }

    currentSpeech = new SpeechSynthesisUtterance(noteContent);
    currentSpeech.lang = 'es-MX';
    currentSpeech.rate = 1.0;
    currentSpeech.pitch = 1.0;
    currentSpeech.volume = 1.0;

    ttsButton.style.backgroundColor = '#ffc107';
    ttsButton.textContent = '⏸️';

    currentSpeech.onend = () => {
        ttsButton.style.backgroundColor = '#17a2b8';
        ttsButton.textContent = '🔊';
        currentSpeech = null;
    };

    currentSpeech.onerror = (event) => {
        if(event.error != 'interrupted')
        alert('Error al reproducir el audio: ' + event.error);
        ttsButton.style.backgroundColor = '#17a2b8';
        ttsButton.textContent = '🔊';
        currentSpeech = null;
    };

    speechSynthesis.speak(currentSpeech);
}

document.getElementById('summarizeNote').addEventListener('click', summarizeNote);

async function summarizeNote() {
    const noteContent = document.getElementById('noteContent').value;
    const sessionId = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    const summarizeButton = document.getElementById('summarizeNote');

    if (!noteContent.trim()) {
        alert('No hay contenido para resumir en la nota');
        return;
    }

    if (noteContent.length > 5000) {
        alert('El contenido excede el limite de 5000 caracteres. Por favor, reduce el texto.');
        return;
    }

    try {
        summarizeButton.disabled = true;
        summarizeButton.style.opacity = '0.5';
        summarizeButton.style.backgroundColor = '#6c757d';
        summarizeButton.textContent = '⏳';

        const response = await fetch('https://enabled-elephant-presently.ngrok-free.app/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'x-session-id': sessionId,
                'x-user-id': userId
            },
            body: JSON.stringify({ content: noteContent })
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('noteContent').value = result.summary;
        } else {
            const errorText = await response.text();
            alert(`Error al resumir la nota: ${errorText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrio un error al resumir la nota.');
    } finally {
        summarizeButton.disabled = false;
        summarizeButton.style.opacity = '1';
        summarizeButton.style.backgroundColor = '#ffc107';
        summarizeButton.textContent = '✨';
    }
}