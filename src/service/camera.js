const width = document.body.clientWidth;
const height = document.body.clientHeight

/* global cv, __Camera_Id__ */

let canvasInput;
let canvasInputCtx;
let canvasBuffer;
let canvasBufferCtx;
let srcMat;
let grayMat;
let faceClassifier;
let eyeClassifier;
let emitter;
let video;

const detectFace = true;
const detectEye = false;

export async function startCamera() {
  const resolution =  {
    width: { exact: width },
    height: { exact: height },
  };
  // 开始时，如果你只有一个摄像头，可以把这里注释掉
  if (__Camera_Id__) {
    resolution.deviceId = __Camera_Id__;
  } else {
    resolution.video.facingMode = { exact: "user" };
  }
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({
      video: resolution, audio: false
    })
      .then(function(s) {
        resolve(s);
      })
      .catch(function(err) {
        console.log("An error occured! ", err.message);
      });
  });

}

export function startVideoProcessing(_emitter, _video) {
  emitter = _emitter;
  video = _video;
  canvasInput = document.createElement('canvas');
  canvasInput.width = width;
  canvasInput.height = height;
  canvasInputCtx = canvasInput.getContext('2d');

  canvasBuffer = document.createElement('canvas');
  canvasBuffer.width = width;
  canvasBuffer.height = height;
  canvasBufferCtx = canvasBuffer.getContext('2d');

  srcMat = new cv.Mat(height, width, cv.CV_8UC4);
  grayMat = new cv.Mat(height, height, cv.CV_8UC1);

  faceClassifier = new cv.CascadeClassifier();
  faceClassifier.load('haarcascade_frontalface_default.xml');

  eyeClassifier = new cv.CascadeClassifier();
  eyeClassifier.load('haarcascade_eye.xml');

  requestAnimationFrame(processVideo);
}

function processVideo() {
  canvasInputCtx.drawImage(video, 0, 0, width, height);
  let imageData = canvasInputCtx.getImageData(0, 0, width, height);
  srcMat.data.set(imageData.data);
  cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);
  let faces = [];
  let eyes = [];
  let size;
  if (detectFace) {
    let faceVect = new cv.RectVector();
    let faceMat = new cv.Mat();
    if (detectEye) {
      cv.pyrDown(grayMat, faceMat);
      size = faceMat.size();
    } else {
      cv.pyrDown(grayMat, faceMat);
      if (width > 320)
        cv.pyrDown(faceMat, faceMat);
      size = faceMat.size();
    }
    faceClassifier.detectMultiScale(faceMat, faceVect);
    for (let i = 0; i < faceVect.size(); i++) {
      let face = faceVect.get(i);
      faces.push(new cv.Rect(face.x, face.y, face.width, face.height));
      if (detectEye) {
        let eyeVect = new cv.RectVector();
        let eyeMat = faceMat.roi(face);
        eyeClassifier.detectMultiScale(eyeMat, eyeVect);
        for (let i = 0; i < eyeVect.size(); i++) {
          let eye = eyeVect.get(i);
          eyes.push(new cv.Rect(face.x + eye.x, face.y + eye.y, eye.width, eye.height));
        }
        eyeMat.delete();
        eyeVect.delete();
      }
    }
    faceMat.delete();
    faceVect.delete();
  } else {
    if (detectEye) {
      let eyeVect = new cv.RectVector();
      let eyeMat = new cv.Mat();
      cv.pyrDown(grayMat, eyeMat);
      size = eyeMat.size();
      eyeClassifier.detectMultiScale(eyeMat, eyeVect);
      for (let i = 0; i < eyeVect.size(); i++) {
        let eye = eyeVect.get(i);
        eyes.push(new cv.Rect(eye.x, eye.y, eye.width, eye.height));
      }
      eyeMat.delete();
      eyeVect.delete();
    }
  }
  //canvasOutputCtx.drawImage(canvasInput, 0, 0, width, height);
  //drawResults(canvasOutputCtx, faces, 'red', size);
  //drawResults(canvasOutputCtx, eyes, 'yellow', size);
  emitResults(faces, size);
  requestAnimationFrame(processVideo);
}

function emitResults(results, size) {
  const [result] = results;
  if (!result) return;
  const yRatio = height / size.height;
  emitter.emit('result', result.y * yRatio + result.height * yRatio / 2);
}

function drawResults(ctx, results, color, size) {
  for (let i = 0; i < results.length; ++i) {
    let rect = results[i];
    let xRatio = width/size.width;
    let yRatio = height/size.height;
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.strokeRect(rect.x*xRatio, rect.y*yRatio, rect.width*xRatio, rect.height*yRatio);
  }
}

function stopCamera() {
  if (!streaming) return;
  stopVideoProcessing();
  document.getElementById("canvasOutput").getContext("2d").clearRect(0, 0, width, height);
  video.pause();
  video.srcObject=null;
  stream.getVideoTracks()[0].stop();
  streaming = false;
}

window.opencvIsReady = opencvIsReady;
