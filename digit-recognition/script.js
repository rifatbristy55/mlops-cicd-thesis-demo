
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const clearButton = document.getElementById("clearButton");
const predictButton = document.getElementById("predictButton");
const result = document.getElementById("result");
const confidence = document.getElementById("confidence");
const imageUpload = document.getElementById("imageUpload");

const MODEL_URL =
    "https://huggingface.co/onnxmodelzoo/mnist-7/resolve/main/mnist-7.onnx";

let session = null;
let isDrawing = false;

// Set up the drawing canvas
function resetCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resetCanvas();

ctx.strokeStyle = "white";
ctx.lineWidth = 18;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Load the pretrained ONNX model
async function loadModel() {
    try {
        result.textContent = "Loading machine learning model...";
        predictButton.disabled = true;

        session = await ort.InferenceSession.create(MODEL_URL);

        result.textContent = "Model loaded successfully. Draw a digit!";
        predictButton.disabled = false;
    } catch (error) {
        console.error("Model loading error:", error);
        result.textContent = "Unable to load the model. Please refresh.";
    }
}

// Get pointer position
function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height
    };
}

// Start drawing
canvas.addEventListener("pointerdown", (event) => {
    isDrawing = true;

    const position = getPointerPosition(event);

    ctx.beginPath();
    ctx.moveTo(position.x, position.y);

    canvas.setPointerCapture(event.pointerId);
});

// Continue drawing
canvas.addEventListener("pointermove", (event) => {
    if (!isDrawing) return;

    const position = getPointerPosition(event);

    ctx.lineTo(position.x, position.y);
    ctx.stroke();
});

// Stop drawing
function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("lostpointercapture", stopDrawing);

// Clear canvas
clearButton.addEventListener("click", () => {
    resetCanvas();
    result.textContent = "Draw a digit from 0 to 9.";
    confidence.textContent = "";
});

// Prepare drawing for the MNIST model
function preprocessImage() {
    const image = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    );

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;

    // Find the boundaries of the white digit
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;

            if (image.data[index] > 30) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    if (maxX < 0) {
        throw new Error("Please draw a digit first.");
    }

    // Crop the digit and preserve its proportions
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const size = Math.max(width, height);
    const padding = Math.max(4, Math.round(size * 0.2));
    const finalSize = size + padding * 2;

    const temporaryCanvas = document.createElement("canvas");
    temporaryCanvas.width = 28;
    temporaryCanvas.height = 28;

    const tempCtx = temporaryCanvas.getContext("2d");

    tempCtx.fillStyle = "black";
    tempCtx.fillRect(0, 0, 28, 28);

    const scale = 20 / size;
    const drawWidth = width * scale;
    const drawHeight = height * scale;

    const offsetX = (28 - drawWidth) / 2;
    const offsetY = (28 - drawHeight) / 2;

    tempCtx.drawImage(
        canvas,
        minX, minY, width, height,
        offsetX, offsetY, drawWidth, drawHeight
    );

    const pixels = tempCtx.getImageData(0, 0, 28, 28).data;

    const inputData = new Float32Array(28 * 28);

    for (let i = 0; i < inputData.length; i++) {
        inputData[i] = pixels[i * 4] / 255;
    }

    return inputData;
}

// Softmax converts model scores into probabilities
function softmax(scores) {
    const maxScore = Math.max(...scores);

    const exponents = scores.map(
        score => Math.exp(score - maxScore)
    );

    const total = exponents.reduce(
        (sum, value) => sum + value, 0
    );

    return exponents.map(value => value / total);
}

// Run real machine learning prediction
async function predictDigit() {
    if (!session) {
        result.textContent = "The model is not ready yet.";
        return;
    }

    try {
        predictButton.disabled = true;
        result.textContent = "Analysing your digit...";
        confidence.textContent = "";

        const inputData = preprocessImage();

        const inputTensor = new ort.Tensor(
            "float32",
            inputData,
            [1, 1, 28, 28]
        );

        const inputName = session.inputNames[0];

        const outputs = await session.run({
            [inputName]: inputTensor
        });

        const outputName = session.outputNames[0];
        const scores = Array.from(outputs[outputName].data);

        const probabilities = softmax(scores);

        const predictedDigit = probabilities.indexOf(
            Math.max(...probabilities)
        );

        const confidenceScore =
            (probabilities[predictedDigit] * 100).toFixed(2);

        result.textContent = `Predicted Digit: ${predictedDigit}`;

        confidence.textContent =
            `Model confidence: ${confidenceScore}%`;

    } catch (error) {
        console.error("Prediction error:", error);
        result.textContent = error.message;
    } finally {
        predictButton.disabled = false;
    }
}

predictButton.addEventListener("click", predictDigit);

// Start loading the model
loadModel();

