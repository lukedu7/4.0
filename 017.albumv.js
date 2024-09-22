// Variáveis globais
let currentLevel = 1;
let completedBooks = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const books = [
    "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
    "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
    "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
    "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
    "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações",
    "Ezequiel", "Daniel", "Oseias", "Joel", "Amós",
    "Obadias", "Jonas", "Miqueias", "Naum", "Habacuque",
    "Sofonias", "Ageu", "Zacarias", "Malaquias",
    "Mateus", "Marcos", "Lucas", "João", "Atos",
    "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
    "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
    "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus",
    "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João",
    "3 João", "Judas", "Apocalipse"
];

// Elementos do DOM
const levelInfoElement = document.getElementById('levelInfo');
const progressInfoElement = document.getElementById('progressInfo');
const questionContainer = document.getElementById('questionContainer');
const questionElement = document.getElementById('question');
const alternativesElement = document.getElementById('alternatives');
const submitButton = document.getElementById('submitButton');
const resultElement = document.getElementById('result');
const gameContainer = document.getElementById('gameContainer');
const albumContainer = document.getElementById('albumContainer');
const startAlbumButton = document.getElementById('startAlbumButton');

// Event Listeners
startAlbumButton.addEventListener('click', startAlbumMode);
submitButton.addEventListener('click', checkAnswer);

function startAlbumMode() {
    gameContainer.style.display = 'none';
    questionContainer.style.display = 'none';
    albumContainer.style.display = 'block';
    createAlbum();
}

function createAlbum() {
    const albumGrid = document.getElementById('album-container');
    albumGrid.innerHTML = '';

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        if (completedBooks.includes(book)) {
            bookItem.classList.add('completed');
        }
        bookItem.textContent = book;
        bookItem.addEventListener('click', () => startBookQuiz(book));
        albumGrid.appendChild(bookItem);
    });
}

function startBookQuiz(book) {
    fetchQuestions(book);
}

function fetchQuestions(book) {
    // Simular o carregamento de perguntas (substitua isso por uma chamada real à API ou carregamento de arquivo)
    setTimeout(() => {
        currentQuestions = generateMockQuestions(book);
        currentQuestionIndex = 0;
        score = 0;
        showQuizInterface();
        loadQuestion();
    }, 500);
}

function generateMockQuestions(book) {
    // Gerar perguntas de exemplo (substitua isso por perguntas reais)
    return Array(10).fill().map((_, index) => ({
        pergunta: `Pergunta ${index + 1} sobre ${book}?`,
        alternativas: ["Alternativa A", "Alternativa B", "Alternativa C"],
        correta: "Alternativa A"
    }));
}

function showQuizInterface() {
    questionContainer.style.display = 'block';
    albumContainer.style.display = 'none';
}

function loadQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionElement.textContent = question.pergunta;
    alternativesElement.innerHTML = '';
    
    const allOptions = [...question.alternativas, question.correta];
    shuffleArray(allOptions).forEach((option, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="radio" name="answer" id="option${index}" value="${option}">
            <label for="option${index}">${option}</label>
        `;
        alternativesElement.appendChild(li);
    });

    submitButton.textContent = 'Responder';
    submitButton.onclick = checkAnswer;
}

function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Por favor, selecione uma resposta.');
        return;
    }

    const userAnswer = selectedAnswer.value;
    const correctAnswer = currentQuestions[currentQuestionIndex].correta;

    if (userAnswer === correctAnswer) {
        score++;
        selectedAnswer.parentElement.classList.add('correct');
    } else {
        selectedAnswer.parentElement.classList.add('incorrect');
        document.querySelector(`input[value="${correctAnswer}"]`).parentElement.classList.add('correct');
    }

    disableAllOptions();

    if (currentQuestionIndex < currentQuestions.length - 1) {
        submitButton.textContent = 'Próxima Pergunta';
        submitButton.onclick = nextQuestion;
    } else {
        submitButton.textContent = 'Ver Resultado';
        submitButton.onclick = showResults;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    const percentage = (score / currentQuestions.length) * 100;
    questionElement.textContent = `Você acertou ${score} de ${currentQuestions.length} perguntas (${percentage.toFixed(2)}%).`;
    alternativesElement.innerHTML = '';
    
    if (percentage >= 70) {
        const book = currentQuestions[0].pergunta.split(' ').pop().replace('?', '');
        if (!completedBooks.includes(book)) {
            completedBooks.push(book);
        }
        if (completedBooks.length === books.length) {
            currentLevel++;
            completedBooks = [];
            alert(`Parabéns! Você completou o nível ${currentLevel - 1}. Avançando para o nível ${currentLevel}.`);
        }
    }

    submitButton.textContent = 'Voltar ao Álbum';
    submitButton.onclick = returnToAlbum;
    updateProgress();
}

function returnToAlbum() {
    startAlbumMode();
}

// Funções Utilitárias
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function disableAllOptions() {
    document.querySelectorAll('input[name="answer"]').forEach(input => input.disabled = true);
}

function updateProgress() {
    levelInfoElement.textContent = `Nível ${currentLevel}`;
    progressInfoElement.textContent = `Progresso: ${completedBooks.length}/${books.length}`;
}

// Inicialização
updateProgress();