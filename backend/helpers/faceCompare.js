import * as faceapi from 'face-api.js';
import pkg from 'canvas';
import path from 'path';

const { canvas, Image, ImageData } = pkg;
faceapi.env.monkeyPatch({ Canvas: canvas, Image, ImageData });

const MODEL_PATH = path.join(process.cwd(), 'models');

// Load models once on server start
export const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
};

export const compareFaces = async (refImageBase64, liveImageBase64) => {
  try {
    const refImg = await canvas.loadImage(refImageBase64);
    const liveImg = await canvas.loadImage(liveImageBase64);
  
    const refDesc = await faceapi
      .detectSingleFace(refImg)
      .withFaceLandmarks()
      .withFaceDescriptor();
  
    const liveDesc = await faceapi
      .detectSingleFace(liveImg)
      .withFaceLandmarks()
      .withFaceDescriptor();
  
    if (!refDesc || !liveDesc) return false;
  
    const distance = faceapi.euclideanDistance(refDesc.descriptor, liveDesc.descriptor);
    return distance < 0.45;
  } catch (error) {
    console.log("Error comparing faces:", error.message);
    return false;
  } // Threshold: 0.45 for match
};
