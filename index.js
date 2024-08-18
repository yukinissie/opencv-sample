const cv = require("@u4/opencv4nodejs");

const img = cv.imread("./lenna.jpg");

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const grayImg = img.bgrToGray();

const result = classifier.detectMultiScale(grayImg);

if (!result.objects.length) {
  throw new Error("failed to detect faces");
}

const minDetections = 10;
result.objects.forEach((faceRect, i) => {
  if (result.numDetections[i] < minDetections) {
    return;
  }
  const rect = cv.drawDetection(img, faceRect, {
    color: new cv.Vec(255, 0, 0),
    segmentFraction: 4,
  });
});
cv.imshowWait("result", img);
