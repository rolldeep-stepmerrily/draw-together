const socket = io('http://ip:port'); // 서버 ip에 맞게 변경해야함! README 참고
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

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const resizeCanvas = () => {
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const scale = Math.min(containerWidth / CANVAS_WIDTH, containerHeight / CANVAS_HEIGHT);

  canvas.style.width = `${CANVAS_WIDTH * scale}px`;
  canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const findPosition = (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = canvas.width / rect.width;
  const y = canvas.height / rect.height;

  if (e.touches && e.touches[0]) {
    return {
      x: (e.touches[0].clientX - rect.left) * x,
      y: (e.touches[0].clientY - rect.top) * y,
    };
  }

  return {
    x: (e.clientX - rect.left) * x,
    y: (e.clientY - rect.top) * y,
  };
};

const startDraw = (e) => {
  isDrawing = true;
  const position = findPosition(e);
  [lastX, lastY] = [position.x, position.y];
};

const draw = (e) => {
  if (!isDrawing) {
    return;
  }

  const position = findPosition(e);
  ctx.strokeStyle = colorPicker.value;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();

  socket.emit('draw', {
    x0: lastX,
    y0: lastY,
    x1: position.x,
    y1: position.y,
    color: colorPicker.value,
  });

  [lastX, lastY] = [position.x, position.y];
};

const stopDraw = () => {
  isDrawing = false;
};

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseout', stopDraw);

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startDraw(e);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  draw(e);
});
canvas.addEventListener('touchend', stopDraw);

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
