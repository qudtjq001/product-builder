const URL = "https://teachablemachine.withgoogle.com/models/VwOxg_OVI/";

let model;
let webcam;
let maxPredictions = 0;
let isRunning = false;

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const webcamContainer = document.getElementById("webcam-container");
const labelContainer = document.getElementById("label-container");
const statusText = document.getElementById("status-text");
const resultLabel = document.getElementById("result-label");

function setStatus(text, active) {
    statusText.textContent = text;
    statusText.parentElement.classList.toggle("active", active);
}

function clearLabels() {
    labelContainer.innerHTML = "";
    resultLabel.textContent = "-";
}

function ensureLabelRows() {
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i += 1) {
        const row = document.createElement("div");
        row.className = "label-item";

        const head = document.createElement("div");
        head.className = "label-row";

        const name = document.createElement("span");
        const value = document.createElement("span");
        head.appendChild(name);
        head.appendChild(value);

        const bar = document.createElement("div");
        bar.className = "progress";
        const barFill = document.createElement("span");
        bar.appendChild(barFill);

        row.appendChild(head);
        row.appendChild(bar);
        labelContainer.appendChild(row);
    }
}

async function init() {
    if (isRunning) return;
    try {
        setStatus("모델 로딩 중...", true);
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        ensureLabelRows();

        const flip = true;
        webcam = new tmImage.Webcam(320, 320, flip);
        await webcam.setup();
        await webcam.play();

        webcamContainer.innerHTML = "";
        webcamContainer.appendChild(webcam.canvas);

        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        setStatus("촬영 중", true);

        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error(error);
        setStatus("카메라 접근을 허용해 주세요.", false);
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

async function loop() {
    if (!isRunning) return;
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let top = { className: "", probability: 0 };

    prediction.forEach((item, index) => {
        if (item.probability > top.probability) {
            top = item;
        }

        const row = labelContainer.children[index];
        if (!row) return;
        const [nameNode, valueNode] = row.querySelectorAll(".label-row span");
        const bar = row.querySelector(".progress span");
        const percent = Math.round(item.probability * 100);

        nameNode.textContent = item.className;
        valueNode.textContent = `${percent}%`;
        bar.style.width = `${percent}%`;
    });

    if (top.className) {
        resultLabel.textContent = `${top.className} ${Math.round(top.probability * 100)}%`;
    }
}

function stop() {
    if (!isRunning) return;
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    setStatus("대기 중", false);
    if (webcam) {
        webcam.stop();
    }
}

startBtn.addEventListener("click", init);
stopBtn.addEventListener("click", stop);

clearLabels();
