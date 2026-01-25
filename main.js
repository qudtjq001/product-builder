
const generateBtn = document.getElementById('generate-btn');
const lottoBalls = document.querySelectorAll('.lotto-ball');
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
};

applyTheme(currentTheme);

generateBtn.addEventListener('click', () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    lottoBalls.forEach((ball, index) => {
        ball.textContent = sortedNumbers[index];
        ball.style.transform = 'scale(0)';
        setTimeout(() => {
            ball.style.transform = 'scale(1)';
        }, 100 * index);
    });
});

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
});
