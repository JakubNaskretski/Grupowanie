let numberOfPointsPerGroup = 15;
let numberOfGroups = 3;
let canvasSizePerGroup = 150;
let canvasSize = numberOfGroups * canvasSizePerGroup;
let points = [...Array(3)].map(e => Array(2));
let groupsMap = [];
let selectedGroups = [];
let groupX;
let groupY;
let centroidsCentersMap = [];
let groupColorsMap = [];

for (var i = 0; i < numberOfGroups; i++) {
        groupsMap[String(i)] = [canvasSizePerGroup*i, canvasSizePerGroup*i+canvasSizePerGroup];
}

console.log(groupsMap);

function setup() {
    createCanvas(canvasSize, canvasSize);
    background(255);

    for (var j = 0; j < numberOfGroups; j++){


        do {
            // random select quater of canvas
            groupX = Math.floor(Math.random() * numberOfGroups) + 0;
            groupY = Math.floor(Math.random() * numberOfGroups) + 0;
            
            // if it was already selected, try to select another one
        } while (containsArray(selectedGroups, [groupX, groupY]));
            // push selected quater to the list
        selectedGroups.push([groupX, groupY]);

        var randomColor = Math.floor(Math.random()*16777215).toString(16);

        for (var i = 0; i < numberOfPointsPerGroup; i++) {
            points[j][i] = new SinglePoint(
                groupsMap[String(groupX)][0], 
                groupsMap[String(groupX)][1], 
                groupsMap[String(groupY)][0], 
                groupsMap[String(groupY)][1], 
                j, 
                '#'+String(randomColor));
        }

        // find random centroid center in quoter
        let centroidCenterX = Math.floor(Math.random() * (groupsMap[String(groupX)][1] - groupsMap[String(groupX)][0])) + groupsMap[String(groupX)][0];
        let centroidCenterY = Math.floor(Math.random() * (groupsMap[String(groupY)][1] - groupsMap[String(groupY)][0])) + groupsMap[String(groupY)][0];

        console.log ('centroidCenterX '+centroidCenterX+' centroidCenterY '+centroidCenterY);

        // TMP centers of the centroids
        fill(0);
        ellipse(centroidCenterX, centroidCenterY, 25, 25);

        // save starting center for centroid
        centroidsCentersMap[String(j)] = [centroidCenterX, centroidCenterY];
        // Save colors by group
        // TODO: add color to some already existing map
        groupColorsMap[String(j)] = ['#'+String(randomColor)];
    }

    for (let pointGroup of points) {
        for (let point of pointGroup) {
            point.show();
        }
    }

    for (let pointGroup of points) {
        for (let point of pointGroup) {
            calculatePointCentroid(point, centroidsCentersMap);
        }
    }
  }
  
  function draw() {
  }

  function containsArray(mainArray, arrayToCheck) {
      for (arrayElem of mainArray) {
          if (arrayEquals(arrayElem, arrayToCheck)) {
              return true;
          }
      }
      return false;
  }

  function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  function calculatePointCentroid(point, centersMap) {
      let center;
      let centroidDistance;
    for (var i = 0; i < centersMap.length; i++ ) {
        centroidDistance = Math.sqrt(Math.pow(point.x - centersMap[String(i)][0], 2) + Math.pow(point.y - centersMap[String(i)][1], 2));

        if (centroidDistance < point.centroidDistance || typeof point.centroidDistance === 'undefined') {
            point.centroidDistance = centroidDistance;
            point.groupGuess = i;
            point.paintGuessedGroup(groupColorsMap[String(i)]);
        } 
        // else {
        //     point.paintGuessedGroup(point.color);
        // }

    }
  }

  function recalculateCentroids(points, centroidsCentersMap) {
    let pointsToCalculateCentroid;
    let newCentroidX;
    let newCentroidY;
    let tmpCentroidsMap = [];

    console.log('recalculated centroidsCentersMap '+centroidsCentersMap);

    for (var i = 0; i < centroidsCentersMap.length; i++ ) {
        pointsToCalculateCentroid = [];
        for (let pointGroup of points) {
            for (let point of pointGroup) {
                if (point.groupGuess === i) {
                    pointsToCalculateCentroid.push(point);
                }
            }
        }

        newCentroidX = 0;
        newCentroidY = 0;

        for (let centroidPoint of pointsToCalculateCentroid) {
            newCentroidX += centroidPoint.x;
            newCentroidY += centroidPoint.y;
        }

        tmpCentroidsMap[String(i)] = [newCentroidX/pointsToCalculateCentroid.length, newCentroidY/pointsToCalculateCentroid.length];

        fill(0);
        ellipse(newCentroidX/pointsToCalculateCentroid.length, newCentroidY/pointsToCalculateCentroid.length, 25, 25);
    } 
    return tmpCentroidsMap;
  }

  function mousePressed() {
      clear();
      background(255);
      console.log('pressed worked');
      for (let pointGroup of points) {
        for (let point of pointGroup) {
            point.show();
            point.paintGuessedGroup(groupColorsMap[String(point.groupGuess)]);
        }
    }

      let newCentroidsMap = recalculateCentroids(points, centroidsCentersMap);

      centroidsCentersMap = newCentroidsMap;

      for (let pointGroup of points) {
        for (let point of pointGroup) {
            calculatePointCentroid(point, centroidsCentersMap);
        }
    }
  }