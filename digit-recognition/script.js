
// Get the drawing canvas and its 2D drawing context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Get the application buttons and result elements
const clearButton = document.getElementById("clearButton");
const predictButton = document.getElementById("predictButton");
const result = document.getElementById("result");
const confidence = document.getElementById("confidence");
const imageUpload = document.getElementById("imageUpload");

// Configure the drawing style
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "white";
ctx.lineWidth = 18;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Track whether the user is drawing
let isDrawing = false;

// Get the correct pointer position on the canvas
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

// Draw while the pointer moves
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

// Clear the canvas
clearButton.addEventListener("click", () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    result.textContent = "Your prediction will appear here.";
    confidence.textContent = "";
    imageUpload.value = "";
});

// Temporary message until model inference is added
predictButton.addEventListener("click", () => {
    result.textContent = "Drawing captured. Model integration is coming next.";
    confidence.textContent = "";
});
