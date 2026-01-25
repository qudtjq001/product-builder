
const generateBtn = document.getElementById('generate-btn');
const lottoBalls = document.querySelectorAll('.lotto-ball');

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
