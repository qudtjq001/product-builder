const URL = "https://teachablemachine.withgoogle.com/models/VwOxg_OVI/";

let model;
let maxPredictions = 0;

const preview = document.getElementById("preview");
const labelContainer = document.getElementById("label-container");
const statusText = document.getElementById("status-text");
const resultLabel = document.getElementById("result-label");
const uploadInput = document.getElementById("image-upload");

function setStatus(text) {
    statusText.textContent = text;
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

async function loadModelIfNeeded() {
    if (model) return;
    setStatus("모델 로딩 중...");
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    ensureLabelRows();
}

async function predictImage(imageEl) {
    const prediction = await model.predict(imageEl);
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

uploadInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        await loadModelIfNeeded();
    } catch (error) {
        console.error(error);
        setStatus("모델 로딩 실패");
        return;
    }

    setStatus("이미지 분석 중...");

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = async () => {
        preview.innerHTML = "";
        preview.appendChild(img);
        await predictImage(img);
        setStatus("분석 완료");
        URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
        setStatus("이미지를 읽을 수 없습니다.");
        URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
});

clearLabels();
