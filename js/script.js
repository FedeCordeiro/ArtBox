/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");

let mouseDown = false;
let currentColor = "#000000"; // Variable global para almacenar el color seleccionado
let lapiz = new Pencil(ctx, 0, 0, currentColor, 5);
let eraserActive = false; // Variable que controla si la goma está activa
let width = canvas.width;
let height = canvas.height;
let originalImageData = null; // Variable global para almacenar la imagen original

function main() {
  // Inicialización si es necesaria
}

let imageCanvas = new ImageCanvas(ctx, canvas.width, canvas.height);

// Capturar la imagen seleccionada del input de archivo
let fileInput = document.getElementById("add-image");
fileInput.addEventListener("change", function(event) {
  let file = event.target.files[0]; // Obtener el archivo seleccionado
  if (file) {
    imageCanvas.cargarImagen(file); // Cargar la imagen en el canvas
  }
});

// Limpiar el canvas
document.getElementById("all-clean").addEventListener("click", function() {
  ctx.clearRect(0, 0, width, height);
});

// Guardar el canvas como imagen
document.getElementById("save").addEventListener("click", function() {
  let dataURL = canvas.toDataURL("image/jpg");
  let link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas_image.jpg";
  link.click();
});

// Obtener el elemento del selector de color
let colorPicker = document.getElementById("color-picker");

// Cambiar el color del lápiz cuando se selecciona un nuevo color
colorPicker.addEventListener("input", function(e) {
  currentColor = e.target.value; // Actualizar el color global
  if (!eraserActive) {
    // Solo cambiar el color si no está activa la goma
    lapiz.setColor(currentColor); // Cambiar el color del lápiz
  }
});

// Seleccionar la goma
document.getElementById("eraser").addEventListener("click", function() {
  eraserActive = true; // Activar la goma
  lapiz = new Pencil(ctx, 0, 0, "white", 5); // Crear un lápiz que dibuja en blanco
});

// Seleccionar el lápiz
document.getElementById("pencil").addEventListener("click", function() {
  eraserActive = false; // Desactivar la goma
  lapiz = new Pencil(ctx, 0, 0, currentColor, 5); // Crear un lápiz con el color actual
});

// Dibujo en el canvas
canvas.addEventListener("mousedown", function(e) {
  mouseDown = true;
  let pos = getMousePos(e);
  lapiz.setPosition(pos.x, pos.y);
});

canvas.addEventListener("mousemove", function(e) {
  if (mouseDown) {
    let pos = getMousePos(e);
    lapiz.draw(pos.x, pos.y);
    lapiz.setPosition(pos.x, pos.y);
  }
});

canvas.addEventListener("mouseup", function() {
  mouseDown = false;
});

// Obtener la posición del mouse en el canvas
function getMousePos(e) {
  let x = e.offsetX;
  let y = e.offsetY;
  return { x: x, y: y };
}

// Evento para deshacer los filtros y restaurar la imagen original
document.getElementById("undoFilter").addEventListener("click", function() {
  imageCanvas.restaurarImagenOriginal(); // Restaurar la imagen original
});

// Aplicar filtros
document.getElementById("black-white").addEventListener("click", function() {
  let filtro = new BlancoYNegro(ctx, width, height);
  filtro.aplicarFiltro();
});

// Filtro sepia
document.getElementById("sepia").addEventListener("click", function() {
  let filtro = new Sepia(ctx, width, height);
  filtro.aplicarFiltro();
});

// Filtro monocromático
document.getElementById("monochromatic").addEventListener("click", function() {
  let filtro = new Monocromatico(ctx, width, height);
  filtro.aplicarFiltro();
});

// Filtro negativo
document.getElementById("negative").addEventListener("click", function() {
  let filtro = new Negativo(ctx, width, height);
  filtro.aplicarFiltro();
});

// Filtro blur
document.getElementById("blur").addEventListener("click", function() {
  const filtro = new Blur(ctx, width, height);
  filtro.aplicarFiltro(); // Asegúrate de que el nombre del método sea correcto
});

let currentBrightness = 1; // Brillo inicial en 1 (sin cambio)

// Aumentar brillo
document.getElementById("addbrightness").addEventListener("click", function() {
  currentBrightness += 0.1; // Incrementa el brillo en 0.1
  aplicarBrillo(currentBrightness);
});

// Disminuir brillo
document.getElementById("lowbrightness").addEventListener("click", function() {
  currentBrightness = Math.max(0, currentBrightness - 0.1); // Evita brillo negativo
  aplicarBrillo(currentBrightness);
});

// Función para aplicar el filtro de brillo
function aplicarBrillo(valor) {
  const filtro = new Brillo(ctx, width, height);
  filtro.aplicarFiltro(valor); // Pasar el valor de brillo actualizado
}

// Filtro binarización
document.getElementById("binarizacion").addEventListener("click", function() {
  const filtro = new Binarizacion(ctx, width, height);
  filtro.aplicarFiltro();
});

// Filtro detección de bordes
document.getElementById("border").addEventListener("click", function() {
  const filtro = new DeteccionBordes(ctx, width, height);
  filtro.aplicarFiltro();
});

// Filtro saturación
document.getElementById("saturacion").addEventListener("click", function() {
  const filtro = new Saturacion(ctx, width, height);
  const saturationValue = 1.5; // Cambia según el valor deseado
  filtro.aplicarFiltro(saturationValue);
});
