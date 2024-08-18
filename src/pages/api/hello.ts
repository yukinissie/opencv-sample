// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cv from "@u4/opencv4nodejs";

type Data = {
  img: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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
  res.status(200).json({
    img: "data:image/png;base64," + cv.imencode(".png", img).toString("base64"),
  });
}
