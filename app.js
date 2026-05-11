const screens = document.querySelectorAll(".screen");

const startBtn = document.getElementById("start-btn");
const nameInput = document.getElementById("player-name");
const displayName = document.getElementById("display-name");

const categoryBtns = document.querySelectorAll(".category-btn");

const questionText = document.getElementById("question-text");
const choicesDiv = document.getElementById("choices");
const tracker = document.getElementById("question-tracker");
const feedback = document.getElementById("feedback");

const resultName = document.getElementById("result-name");
const scoreText = document.getElementById("score");
const breakdown = document.getElementById("breakdown");
const restart = document.getElementById("restart");

let player = "";
let questions = [];
let index = 0;
let score = 0;
let answers = [];

function showScreen(id){
    screens.forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function shuffle(arr){
    return [...arr].sort(()=>Math.random()-0.5);
}

// START
startBtn.onclick = () => {
    if(!nameInput.value.trim()) return;

    player = nameInput.value.trim();
    displayName.textContent = player;

    showScreen("category-screen");
};

// CATEGORY
categoryBtns.forEach(btn => {
    btn.onclick = () => {

        const category = btn.dataset.category;

        questions = shuffle(
            allQuestions.filter(q => q.category === category)
        ).slice(0,10);

        index = 0;
        score = 0;
        answers = [];

        showScreen("quiz-screen");
        loadQuestion();
    };
});

// LOAD QUESTION
function loadQuestion(){

    feedback.textContent = "";
    choicesDiv.innerHTML = "";

    const q = questions[index];

    tracker.textContent = `Question ${index+1}/10`;
    questionText.textContent = q.question;

    shuffle(q.choices).forEach(choice => {

        const btn = document.createElement("button");
        btn.textContent = choice;

        btn.onclick = () => answer(btn, choice, q);

        choicesDiv.appendChild(btn);
    });
}

// ANSWER
function answer(btn, choice, q){

    const buttons = choicesDiv.querySelectorAll("button");
    buttons.forEach(b => b.disabled = true);

    const isCorrect = choice === q.answer;

    if(isCorrect){
        btn.classList.add("correct");
        feedback.textContent = "Correct!";
        score++;
    } else {
        btn.classList.add("wrong");
        feedback.textContent = "Wrong! Correct: " + q.answer;
    }

    answers.push({
        question: q.question,
        user: choice,
        correct: q.answer,
        isCorrect: isCorrect
    });

    setTimeout(() => {
        index++;
        if(index < 10) loadQuestion();
        else showResult();
    }, 1200);
}

// RESULT (GREEN + RED FIXED)
function showResult(){

    showScreen("result-screen");

    resultName.textContent = player;
    scoreText.textContent = `${score}/10`;

    breakdown.innerHTML = "";

    answers.forEach((a, i) => {

        const li = document.createElement("li");
        li.classList.add("result-item");

        li.innerHTML = `
            <b>${i+1}. ${a.question}</b><br>
            Your Answer: 
            <span class="${a.isCorrect ? 'text-correct' : 'text-wrong'}">
                ${a.user}
            </span><br>
            ${!a.isCorrect ? 
                `Correct Answer: <span class="text-correct">${a.correct}</span>` 
                : ""
            }
        `;

        breakdown.appendChild(li);
    });
}

restart.onclick = () => location.reload();