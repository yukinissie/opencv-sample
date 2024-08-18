import http from "http";
import cv from "@u4/opencv4nodejs";

function requestHandler(_request, response) {
  const img = cv.imread("./lenna.jpg");
  const grayImg = img.bgrToGray();
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
  const result = classifier.detectMultiScale(grayImg);

  if (!result.objects.length) {
    throw new Error("failed to detect faces");
  }

  const minDetections = 10;
  result.objects.forEach((faceRect, i) => {
    if (result.numDetections[i] < minDetections) {
      return;
    }
    cv.drawDetection(img, faceRect, {
      color: new cv.Vec(255, 0, 0),
      segmentFraction: 4,
    });
  });

  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.write('<h1><span id="lenna">Lenna</span></h1>');
  response.write(
    '<img src="data:image/png;base64,' +
      cv.imencode(".png", img).toString("base64") +
      '" alt="Lenna">'
  );
  response.end();
}

const server = http.createServer(requestHandler);
server.listen(8080);
