import cv from "@u4/opencv4nodejs";
import { createServer, IncomingMessage, ServerResponse } from "http";

export function main(_request: IncomingMessage, response: ServerResponse) {
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
      color: new cv.Vec3(255, 0, 0),
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

export function requestHandler(
  request: IncomingMessage,
  response: ServerResponse
) {
  const { url } = request;
  switch (url) {
    case "/":
      main(request, response);
      break;
    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not Found");
  }
}

const server = createServer(requestHandler);
server.listen(8080);
