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
  // Get the testSet and the trainingSet.
  const [testSet, trainingSet] = splitDataset(outputs, 10);

  // Train our algorithm using the testSet point with all trainingSet records.
  testSet.forEach((row) => {
    const testSetPoint = row[0];
    const testSetBucket = row[3];

    const predictedBucket = KNN(trainingSet, testSetPoint);

    console.log(`Original: ${testSetBucket}, Predict: ${predictedBucket}`);
  });

  // console.log(`The predicted bucket is: ${predictedBucket}`);
}

// Calc the absolute distance.
const absDistance = (pointA, pointB = predictionPoint) =>
  Math.abs(pointA - pointB);

// KNN Implementation.
const KNN = (trainingData, testSetPoint) => {
  return _.chain(trainingData)
    .map((row) => [absDistance(row[0], testSetPoint), row[3]])
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

// Spliting the data into training and testing set.
const splitDataset = (data, testSetSize = 100) => {
  const shuffledData = _.shuffle(data);

  const testSet = _.slice(shuffledData, 0, testSetSize);
  const trainingSet = _.slice(shuffledData, testSetSize);

  return [testSet, trainingSet];
};
