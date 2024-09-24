class Filter {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  aplicarFiltro() {
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    this.doAplicarfiltro(imageData);
    this.ctx.putImageData(imageData, 0, 0);
  }

  doAplicarfiltro(imageData) {}
}

class BlancoYNegro extends Filter {
  doAplicarfiltro(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      let avg = (r + g + b) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
  }
}

class Sepia extends Filter {
  doAplicarfiltro(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      data[i] = r * 0.393 + g * 0.769 + b * 0.189;
      data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    }
  }
}

class Monocromatico extends Filter {
  doAplicarfiltro(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] * 0.3;
      let g = data[i + 1] * 0.59;
      let b = data[i + 2] * 0.11;
      let gray = r + g + b;

      // Aplica un tono específico (ejemplo: tono azul)
      data[i] = gray * 0.5; // Rojo
      data[i + 1] = gray * 0.5; // Verde
      data[i + 2] = gray; // Azul
    }
  }
}

class Negativo extends Filter {
  doAplicarfiltro(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]; // Invertir el rojo
      data[i + 1] = 255 - data[i + 1]; // Invertir el verde
      data[i + 2] = 255 - data[i + 2]; // Invertir el azul
    }
  }
}

class Blur extends Filter {
  doAplicarfiltro(imageData) {
    const kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    const kernelWeight = 9;
    const data = imageData.data; 
    const copyData = new Uint8ClampedArray(data); // Copia de los datos originales

    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        let sumR = 0,
          sumG = 0,
          sumB = 0;

        // Aplicar el kernel sobre los píxeles vecinos
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            let pixelIndex = ((y + ky) * this.width + (x + kx)) * 4;

            sumR += copyData[pixelIndex]; // Rojo
            sumG += copyData[pixelIndex + 1]; // Verde
            sumB += copyData[pixelIndex + 2]; // Azul
          }
        }

        // Calcular el nuevo valor promediando según el kernel
        let pixelIndex = (y * this.width + x) * 4;
        data[pixelIndex] = sumR / kernelWeight; 
        data[pixelIndex + 1] = sumG / kernelWeight; 
        data[pixelIndex + 2] = sumB / kernelWeight; 
        // El canal alpha se mantiene igual
      }
    }
  }
}

class Brillo extends Filter {
  aplicarFiltro(brightness) {
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;

    // Ajustar el brillo multiplicando cada componente RGB por el valor de brillo
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * brightness); 
      data[i + 1] = Math.min(255, data[i + 1] * brightness);
      data[i + 2] = Math.min(255, data[i + 2] * brightness); 
    }

    this.ctx.putImageData(imageData, 0, 0); // Aplicar los cambios en el canvas
  }
}

class DeteccionBordes extends Filter {
  doAplicarfiltro(imageData) {
    const kernelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];
    const kernelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    const data = imageData.data;
    const copyData = new Uint8ClampedArray(data);

    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        let sumR_X = 0,
          sumG_X = 0,
          sumB_X = 0;
        let sumR_Y = 0,
          sumG_Y = 0,
          sumB_Y = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            let pixelIndex = ((y + ky) * this.width + (x + kx)) * 4;

            let weightX = kernelX[ky + 1][kx + 1];
            let weightY = kernelY[ky + 1][kx + 1];

            sumR_X += copyData[pixelIndex] * weightX;
            sumG_X += copyData[pixelIndex + 1] * weightX;
            sumB_X += copyData[pixelIndex + 2] * weightX;

            sumR_Y += copyData[pixelIndex] * weightY;
            sumG_Y += copyData[pixelIndex + 1] * weightY;
            sumB_Y += copyData[pixelIndex + 2] * weightY;
          }
        }

        let sumR = Math.sqrt(sumR_X ** 2 + sumR_Y ** 2);
        let sumG = Math.sqrt(sumG_X ** 2 + sumG_Y ** 2);
        let sumB = Math.sqrt(sumB_X ** 2 + sumB_Y ** 2);

        let pixelIndex = (y * this.width + x) * 4;
        data[pixelIndex] = sumR > 255 ? 255 : sumR;
        data[pixelIndex + 1] = sumG > 255 ? 255 : sumG;
        data[pixelIndex + 2] = sumB > 255 ? 255 : sumB;
      }
    }
  }
}

class Saturacion extends Filter {
  aplicarFiltro(saturationValue) {
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      let gray = 0.3 * r + 0.59 * g + 0.11 * b; // Escala de grises

      data[i] = gray + (r - gray) * saturationValue;
      data[i + 1] = gray + (g - gray) * saturationValue;
      data[i + 2] = gray + (b - gray) * saturationValue;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }
}

class Binarizacion extends Filter {
  doAplicarfiltro(imageData) {
    let data = imageData.data;
    let threshold = 128; // Umbral para binarización

    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      let value = avg > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value; // Asigna blanco o negro
    }
  }
}
