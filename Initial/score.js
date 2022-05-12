// [dropPosition, bounciness, ballSize, bucketLabel] in order.
const outputs = [];
const predictionPoint = 300;
const k = 100;

// Ran every time a balls drops into a bucket
function onScoreUpdate(dropPosition, bounciness, ballSize, bucketLabel) {
  outputs.push([dropPosition, bounciness, ballSize, bucketLabel]);
}

// Write code here to analyze stuff
function runAnalysis() {
  const predictedBucket = KNN(outputs);

  console.log(`The predicted bucket is: ${predictedBucket}`);
}

// Calc the absolute distance.
const absDistance = (pointA, pointB = predictionPoint) =>
  Math.abs(pointA - pointB);

// KNN Implementation.
const KNN = (data) => {
  return _.chain(data)
    .map((row) => [absDistance(row[0]), row[3]])
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
};
