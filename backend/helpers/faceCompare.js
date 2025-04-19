// import * as tf from '@tensorflow/tfjs-node';
// import * as faceapi from 'face-api.js';
// import pkg from 'canvas';
// import path from 'path';

// const { loadImage, createCanvas,canvas, Image, ImageData } = pkg;
// // faceapi.env.monkeyPatch({ Canvas: createCanvas,canvas, Image, ImageData });

// faceapi.env.monkeyPatch({
//   Canvas: createCanvas(1, 1).constructor, // Important fix
//   Image,
//   ImageData,
// });

// const MODEL_PATH = path.join(process.cwd(), 'models');

// // Load models once on server start
// export const loadModels = async () => {
//   await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
//   await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
//   await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
// };

// export const compareFaces = async (refImageBase64, liveImageBase64) => {
//   try {
//     const refImg = await loadImage(refImageBase64);
//     const liveImg = await loadImage(liveImageBase64);

  
//     const refDesc = await faceapi
//       .detectSingleFace(refImg)
//       .withFaceLandmarks()
//       .withFaceDescriptor();
  
//     const liveDesc = await faceapi
//       .detectSingleFace(liveImg)
//       .withFaceLandmarks()
//       .withFaceDescriptor();
  
//     if (!refDesc || !liveDesc) return false;
  
//     const distance = faceapi.euclideanDistance(refDesc.descriptor, liveDesc.descriptor);
//     return distance < 0.45;
//   } catch (error) {
//     console.log("Error comparing faces:", error.message);
//     return false;
//   } // Threshold: 0.45 for match
// };


// helpers/faceCompare.js
import * as tf from '@tensorflow/tfjs-node'; // ✅ registers TensorFlow backend for Node.js
import * as faceapi from 'face-api.js';
import { createCanvas, loadImage, Image, ImageData } from 'canvas';
import path from 'path';

faceapi.env.monkeyPatch({
  Canvas: createCanvas(1, 1).constructor,
  Image,
  ImageData,
});

// const MODEL_PATH = path.join(process.cwd(), 'models'); // your models folder path

export const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
  // await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  // await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  console.log('✅ FaceAPI models loaded');
};

export const compareFaces = async (refImageBase64, liveImageBase64) => {
  try {
    const refImg = await loadImage(refImageBase64);
    const liveImg = await loadImage(liveImageBase64);

    const refDesc = await faceapi.detectSingleFace(refImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const liveDesc = await faceapi.detectSingleFace(liveImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!refDesc || !liveDesc) {
      console.log('⛔ Face not detected in one or both images');
      return false;
    }

    const distance = faceapi.euclideanDistance(refDesc.descriptor, liveDesc.descriptor);
    console.log('🎯 Face match distance:', distance);
    return distance < 0.45; // Adjust threshold if needed
  } catch (error) {
    console.error('🚨 Error comparing faces:', error.message);
    return false;
  }
};
