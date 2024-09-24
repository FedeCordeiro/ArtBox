class ImageCanvas {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.originalImageData = null; // Almacenar la imagen original
  }

  cargarImagen(file) {
    let orgWidth = this.width;
    let orgHeight = this.height;

    let miImg = new Image();
    miImg.src = URL.createObjectURL(file); // Creamos la URL del archivo
    let ctx = this.ctx;

    miImg.onload = () => {
      const aspectRatio = miImg.naturalWidth / miImg.naturalHeight;
      let targetWidth = orgWidth;
      let targetHeight = targetWidth / aspectRatio;

      if (targetHeight > orgHeight) {
        targetHeight = orgHeight;
        targetWidth = targetHeight * aspectRatio;
      }

      ctx.clearRect(0, 0, orgWidth, orgHeight); // Limpiar el canvas antes de dibujar la imagen
      ctx.drawImage(miImg, 0, 0, targetWidth, targetHeight);

      // Guardar la imagen original
      this.originalImageData = ctx.getImageData(0, 0, orgWidth, orgHeight);
    };
  }

  restaurarImagenOriginal() {
    if (this.originalImageData) {
      this.ctx.putImageData(this.originalImageData, 0, 0); // Restaurar la imagen original
    }
  }
}