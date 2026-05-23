const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const comboText = document.getElementById("combo");
const questionText = document.getElementById("question");
const answerInput = document.getElementById("answer");
const finalScore = document.getElementById("final-score");
const bestText = document.getElementById("best");

let score = 0;
let combo = 0;
let time = 60;
let correctAnswer = 0;
let timer = null;
let infiniteMode = false;

let best = localStorage.getItem("math_best") || 0;
bestText.textContent = best;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const questionGenerators = [
  // 1
  () => {
    const x = random(-20, 20);
    const a = random(2, 15);
    const b = random(-50, 50);
    const c = a * x + b;

    return {
      text: `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
      answer: [String(x)]
    };
  },

  // 2
  () => {
    const a = random(1, 10);
    const b = random(1, 20);
    const c = random(1, 20);

    return {
      text: `${a}x² + ${b}x + ${c} = 0 | Найди D`,
      answer: [String(b * b - 4 * a * c)]
    };
  },

  // 3
  () => {
    const base = random(2, 8);
    const power = random(2, 6);

    return {
      text: `log${base}(${base ** power})`,
      answer: [String(power), numberToWords(power)]
    };
  },

  // 4
  () => {
    const percent = random(5, 70);
    const number = random(100, 5000);
    const result = number * percent / 100;

    return {
      text: `${percent}% от ${number}`,
      answer: [String(result), numberToWords(result)]
    };
  },

  // 5
  () => {
    const a = random(2, 15);
    const b = random(2, 5);

    return {
      text: `${a}^${b}`,
      answer: [String(a ** b)]
    };
  },

  // 6
  () => {
    const a = random(3, 20);

    return {
      text: `√${a * a}`,
      answer: [String(a), numberToWords(a)]
    };
  },

  // 7
  () => {
    const a = random(1, 20);
    const b = random(1, 20);

    return {
      text: `(${a} + ${b})²`,
      answer: [String((a + b) ** 2)]
    };
  },

  // 8
  () => {
    const a1 = random(1, 50);
    const d = random(1, 15);
    const n = random(5, 20);

    return {
      text: `a₁=${a1}, d=${d}, n=${n} | Найди aₙ`,
      answer: [String(a1 + d * (n - 1))]
    };
  },

  // 9
  () => {
    const b1 = random(1, 10);
    const q = random(2, 5);
    const n = random(3, 7);

    return {
      text: `b₁=${b1}, q=${q}, n=${n} | Найди bₙ`,
      answer: [String(b1 * (q ** (n - 1)))]
    };
  },

  // 10
  () => {
    const a = random(-100, 100);

    return {
      text: `|${a}|`,
      answer: [String(Math.abs(a))]
    };
  }
];

function generateQuestion() {
  const generator = questionGenerators[random(0, questionGenerators.length - 1)];
  const question = generator();

  questionText.textContent = question.text;
  correctAnswer = question.answer;
}

// Генерируем около 1000+ вариаций за счёт случайных чисел
for (let i = 0; i < 100; i++) {
  questionGenerators.push(...questionGenerators.slice(0, 10));
}

function numberToWords(num) {
  const words = {
    0: 'ноль',
    1: 'один',
    2: 'два',
    3: 'три',
    4: 'четыре',
    5: 'пять',
    6: 'шесть',
    7: 'семь',
    8: 'восемь',
    9: 'девять',
    10: 'десять'
  };

  return words[num] || String(num);
}

function startGame() {
  const customTimeInput = document.getElementById("custom-time");
  const customTime = Number(customTimeInput.value);
  const mode = document.getElementById("time-mode").value;

  infiniteMode = mode === "infinite";

  clearInterval(timer);

  menuScreen.classList.remove("active");
  endScreen.classList.remove("active");
  gameScreen.classList.add("active");

  score = 0;
  combo = 0;

  if (infiniteMode) {
    time = "∞";
  } else {
    time = customTime > 0 ? customTime : 60;
  }

  updateUI();
  generateQuestion();

  answerInput.disabled = false;
  answerInput.focus();

  if (!infiniteMode) {
    timer = setInterval(() => {
      time--;
      timeText.textContent = time;

      if (time <= 0) {
        endGame();
      }
    }, 1000);
  }
}

function updateUI() {
  scoreText.textContent = score;
  timeText.textContent = time;
  comboText.textContent = `x${combo}`;
}

function checkAnswer() {
  let userAnswer = answerInput.value.trim().toLowerCase();

  if (userAnswer === '') return;

  userAnswer = userAnswer.replace(',', '.');

  const isCorrect = correctAnswer.some(answer => {
    return userAnswer === String(answer).toLowerCase();
  });

  if (isCorrect) {
    combo++;
    score += combo >= 3 ? 5 : 3;

    if (!infiniteMode) {
      time += 3;
    }
  } else {
    combo = 0;

    if (!infiniteMode) {
      time -= 7;

      if (time < 0) {
        time = 0;
      }
    }
  }

  updateUI();
  answerInput.value = '';
  generateQuestion();
}

function endGame() {
  clearInterval(timer);

  answerInput.disabled = true;

  gameScreen.classList.remove("active");
  endScreen.classList.add("active");

  finalScore.textContent = score;

  if (score > best) {
    best = score;
    localStorage.setItem("math_best", best);
    bestText.textContent = best;
  }
}

function goMenu() {
  endScreen.classList.remove("active");
  menuScreen.classList.add("active");
}

answerInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});
