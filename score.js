const outputs = [];

// Ran every time a balls drops into a bucket
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Write code here to update the score
  outputs.push([dropPosition, bounciness, size, bucketLabel]);

  // console.log(outputs);
}

function runAnalysis() {
  // Get the training and test data.
  const testSetSize = 10;
  let accuracy = 0;
  const [trainSet, testSet] = splitDataset(normalize(outputs, 3), testSetSize);

  // Test different k values.
  _.range(1, 20).forEach((k) => {
    // Run the test set through the knn.
    testSet.forEach((row) => {
      const dropPosition = row[0];
      const currentBucket = row[3];
      // Get the nearest neighbors, compare the current bucket to the nearest neighbors, and give me the most common bucket.
      const prodictBucket = knn(trainSet, _.initial(row), k);

      // Check the accuracy.
      if (+prodictBucket === +currentBucket) {
        accuracy++;
      }

      // console.log(`Current: ${currentBucket}, Predict: ${prodictBucket}`);
    });

    // console.log('--------');
    console.log(`K: ${k}, Accuracy: ${(accuracy / testSetSize) * 100}%`);
    accuracy = 0;
  });
  console.log('=============================');
}

// Create a knn that takes a dataset and a point that we want to predict.
const knn = (data, point, k) => {
  return _.chain(data)
    .map((row) => [distance(_.initial(row), point), _.last(row)]) // [{distance, bouncies, ballSize}=>Features, bucket=>Label]
    .sortBy((row) => row[0]) // [nearest distance, bucket]
    .slice(0, k) // get the first k
    .countBy((row) => row[1]) // look for the most common repeated value
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .value();
};

const distance = (pointA, pointB) => {
  // pointA = 300, pointB = 400
  // pointA = [300, .5, 16], pointB = [400, .55, 16]

  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
};

const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainSet = _.slice(shuffled, testCount);

  return [trainSet, testSet];
};

// Normalizing the data.
const normalize = (data, featureCount) => {
  const clonedData = _.clone(data);

  for (let i = 0; i < featureCount; i++) {
    const column = _.map(clonedData, (row) => row[i]);

    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      // Normalizing formula: (x - min) / (max - min).
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);

      // console.log(clonedData[j][i]);
    }
  }
  return clonedData;
};
// Get the best k value.
// function runAnalysis() {
//   // Get the training and test data.
//   const testSetSize = 10;
//   let accuracy = 0;
//   const [trainSet, testSet] = splitDataset(outputs, testSetSize);

//   // Test different k values.
//   _.range(1, 20).forEach((k) => {
//     // Run the test set through the knn.
//     testSet.forEach((row) => {
//       const dropPosition = row[0];
//       const currentBucket = row[3];
//       // Get the nearest neighbors, compare the current bucket to the nearest neighbors, and give me the most common bucket.
//       const prodictBucket = knn(trainSet, dropPosition, k);

//       // Check the accuracy.
//       if (+prodictBucket === +currentBucket) {
//         accuracy++;
//       }

//       // console.log(`Current: ${currentBucket}, Predict: ${prodictBucket}`);
//     });

//     // console.log('--------');
//     console.log(`K: ${k}, Accuracy: ${(accuracy / testSetSize) * 100}%`);
//     accuracy = 0;
//   });
//   console.log('=============================');
// }

// Without Shuffle.
// const splitDataset = (data, testCount) => {
//   const testSet = _.slice(data, 0, testCount);
//   const trainSet = _.slice(data, testCount);

//   return [trainSet, testSet];
// };

// Which bucket will a ball go into if dropped at 100px position?
// 1. Drop a ball a bunch of times at 100px position and record the bucket it falls into.
// 2. For each observation subtract drop point from the observation and get the absolute distance value.
// 3. Sort the results by distance from least to greatest.
// 4. look at the [k] top records. what was the most common bucket?
// 5. whichever bucket came up most frequently is the one ours will probably go into.

// // Create a knn function that takes in a dataset and a k value.
// // It should return a function that takes in a test observation.
// // It should return the most common bucket that the test observation falls into.

// function knn(data, k) {
//   // Write code here to return a function that takes in a test observation
//   // and returns the most common bucket that the test observation falls into.
//   const trainSet = _.map(data, (row) => [distance(row[0]), row[3]]);
//   const testSet = _.map(data, (row) => [distance(row[0]), row[3]]);

//   const predictBucket = (testObservation) => {
//     const nearestNeighbors = _.chain(trainSet)
//       .map((row) => [distance(row[0]), row[1]])
//       .sortBy((row) => row[0])
//       .slice(0, k)
//       .countBy((row) => row[1])
//       .toPairs()
//       .sortBy((row) => row[1])
//       .last()
//       .first()
//       .value();
//     return nearestNeighbors[0];
//   };
//   return predictBucket;
// }
