const socket = io('http://localhost:3069');
const canvas = document.querySelector('#drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.querySelector('#colorPicker');
const clearButton = document.querySelector('#clearButton');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 2;

const startDraw = (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
};

const draw = (e) => {
  if (!isDrawing) {
    return;
  }

  ctx.strokeStyle = colorPicker.value;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  socket.emit('draw', {
    x0: lastX,
    y0: lastY,
    x1: e.offsetX,
    y1: e.offsetY,
    color: colorPicker.value,
  });

  [lastX, lastY] = [e.offsetX, e.offsetY];
};

const stopDraw = () => {
  isDrawing = false;
};

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseout', stopDraw);

clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clear');
});

socket.on('draw', (drawing) => {
  ctx.strokeStyle = drawing.color;
  ctx.beginPath();
  ctx.moveTo(drawing.x0, drawing.y0);
  ctx.lineTo(drawing.x1, drawing.y1);
  ctx.stroke();
});

socket.on('clear', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

socket.on('init', (drawings) => {
  drawings.forEach((drawing) => {
    ctx.strokeStyle = drawing.color;
    ctx.beginPath();
    ctx.moveTo(drawing.x0, drawing.y0);
    ctx.lineTo(drawing.x1, drawing.y1);
    ctx.stroke();
  });
});
