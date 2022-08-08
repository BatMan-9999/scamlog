// const getPixels = require("get-pixels");
// const quantize = require("quantize");
import getPixels from "get-pixels";
import quantize from "quantize";

function createPixelArray(imgData: any, pixelCount: number, quality: number) {
  const pixels = imgData;
  const pixelArray = [];

  for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
    offset = i * 4;
    r = pixels[offset + 0];
    g = pixels[offset + 1];
    b = pixels[offset + 2];
    a = pixels[offset + 3];

    // If pixel is mostly opaque and not white
    if (typeof a === "undefined" || a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push([r, g, b]);
      }
    }
  }
  return pixelArray;
}

function validateOptions(options: ValidateOptionsParams) {
  let { colorCount, quality } = options;

  if (typeof colorCount === "undefined" || !Number.isInteger(colorCount)) {
    colorCount = 10;
  } else if (colorCount === 1) {
    throw new Error(
      "colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()"
    );
  } else {
    colorCount = Math.max(colorCount, 2);
    colorCount = Math.min(colorCount, 20);
  }

  if (
    typeof quality === "undefined" ||
    !Number.isInteger(quality) ||
    quality < 1
  ) {
    quality = 10;
  }

  return {
    colorCount,
    quality,
  };
}

interface ValidateOptionsParams {
  colorCount: number;
  quality: number;
}

function loadImg(img: any) {
  return new Promise((resolve, reject) => {
    getPixels(img, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function getColor(img: any, quality: number) {
  return new Promise((resolve, reject) => {
    getPalette(img, 5, quality)
      .then((palette) => {
        resolve(palette as any[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getPalette(img: any, colorCount = 10, quality = 10) {
  const options = validateOptions({
    colorCount,
    quality,
  });

  return new Promise((resolve, reject) => {
    loadImg(img)
      .then((imgData) => {
        const pixelCount =
          (imgData as any).shape[0] * (imgData as any).shape[1];
        const pixelArray = createPixelArray(
          (imgData as any).data,
          pixelCount,
          options.quality
        );

        const cmap = quantize(pixelArray, options.colorCount);
        const palette = cmap ? cmap.palette() : null;

        resolve(palette);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default getColor;
