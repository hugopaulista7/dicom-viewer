import dicomParser from 'dicom-parser';

function applyWindowLevel(pixelValue, windowCenter, windowWidth) {
  const low = windowCenter - windowWidth / 2;
  const high = windowCenter + windowWidth / 2;
  if (pixelValue <= low) return 0;
  if (pixelValue >= high) return 255;
  return Math.round(((pixelValue - low) / windowWidth) * 255);
}

function extractFramePixels(byteArray, offset, frameSize, bitsStored, isSigned) {
  const pixels = new Array(frameSize);
  for (let i = 0; i < frameSize; i++) {
    if (bitsStored > 8) {
      let value = byteArray[offset + i * 2] | (byteArray[offset + i * 2 + 1] << 8);
      if (isSigned && value > 32767) value -= 65536;
      pixels[i] = value;
    } else {
      pixels[i] = byteArray[offset + i];
    }
  }
  return pixels;
}

function pixelsToImageData(pixels, cols, rows, windowCenter, windowWidth, invert) {
  const rgba = new Uint8ClampedArray(rows * cols * 4);
  for (let i = 0; i < pixels.length; i++) {
    let gray = applyWindowLevel(pixels[i], windowCenter, windowWidth);
    if (invert) gray = 255 - gray;
    rgba[i * 4] = gray;
    rgba[i * 4 + 1] = gray;
    rgba[i * 4 + 2] = gray;
    rgba[i * 4 + 3] = 255;
  }
  return new ImageData(rgba, cols, rows);
}

function resolveWindowLevel(dataSet, minPixelValue, defaultWindowWidth) {
  const defaultCenter = minPixelValue + defaultWindowWidth / 2;
  const wcStr = dataSet.string('x00281050');
  const wwStr = dataSet.string('x00281051');
  const windowCenter = wcStr ? parseFloat(wcStr.split('\\')[0]) : defaultCenter;
  const windowWidth = wwStr ? parseFloat(wwStr.split('\\')[0]) : defaultWindowWidth;
  return { windowCenter, windowWidth: windowWidth || defaultWindowWidth };
}

export function parseDicom(arrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  const dataSet = dicomParser.parseDicom(byteArray);

  const rows = dataSet.uint16('x00280010');
  const cols = dataSet.uint16('x00280011');
  const bitsStored = dataSet.uint16('x00280101') || 8;
  const numFrames = parseInt(dataSet.string('x00280008') || '1', 10);
  const isSigned = (dataSet.uint16('x00280103') || 0) === 1;
  const photometric = (dataSet.string('x00280004') || 'MONOCHROME2').trim();
  const invert = photometric === 'MONOCHROME1';

  const maxPixelValue = isSigned ? 2 ** (bitsStored - 1) - 1 : 2 ** bitsStored - 1;
  const minPixelValue = isSigned ? -(2 ** (bitsStored - 1)) : 0;
  const defaultWindowWidth = maxPixelValue - minPixelValue;

  const { windowCenter, windowWidth } = resolveWindowLevel(dataSet, minPixelValue, defaultWindowWidth);

  const pixelDataElement = dataSet.elements['x7fe00010'];
  const bytesPerPixel = bitsStored > 8 ? 2 : 1;
  const frameSize = rows * cols;
  const frameByteSize = frameSize * bytesPerPixel;

  const frames = [];
  for (let f = 0; f < numFrames; f++) {
    const offset = pixelDataElement.dataOffset + f * frameByteSize;
    const pixels = extractFramePixels(byteArray, offset, frameSize, bitsStored, isSigned);
    frames.push(pixelsToImageData(pixels, cols, rows, windowCenter, windowWidth, invert));
  }

  return { frames, metadata: { rows, cols, numFrames } };
}
