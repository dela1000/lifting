//Angular code for list
var app = angular.module('weightsApp', [
    'chasselberg.slider'
])

app.controller('weightController', function($scope, $compile) {

    $scope.pounds = [
        { "weight": 55, "count": 0 },
        { "weight": 45, "count": 6 },
        { "weight": 35, "count": 2 },
        { "weight": 25, "count": 2 },
        { "weight": 10, "count": 4 },
        { "weight": 5, "count": 4 },
        { "weight": 2.5, "count": 4 },
        { "weight": 2, "count": 4 },
        { "weight": 1.5, "count": 0 },
        { "weight": 1, "count": 0 }
    ]

    $scope.metric = [
        { "weight": 25, "count": 0 },
        { "weight": 20, "count": 4 },
        { "weight": 15, "count": 4 },
        { "weight": 10, "count": 2 },
        { "weight": 5, "count": 0 },
        { "weight": 2.5, "count": 2 },
        { "weight": 2, "count": 0 },
        { "weight": 1.5, "count": 0 },
        { "weight": 1, "count": 0 },
        { "weight": 0.5, "count": 0 },
    ]

    $scope.defaultWeightSets = {};
    $scope.selection = {};

    //Set defaults values for each type
    $scope.metricSelector = () => {
        $scope.selectedType = "metric";
        $scope.poundsClass = "btn btn-outline-secondary"
        $scope.metricClass = "btn btn-dark"
        $scope.abbreviation = "kg";
        $scope.defaultWeightSets = {};
        $scope.defaultWeightSets["metric"] = $scope.metric;
        $scope.displayWeights = $scope.metric;
        $scope.barbellWeight = 20;
        $scope.barbellWeightMin = 10;
        $scope.barbellWeightMax = 25;
        $scope.goalWeight = 45;
        $scope.weightMin = 20;
        $scope.weightMax = 400;
        $scope.weightSets = $scope.defaultWeightSets;
        $scope.selection = [];
        setDefaults($scope.weightSets);
    }

    $scope.poundsSelector = () => {
        $scope.selectedType = "pounds";
        $scope.metricClass = "btn btn-outline-secondary"
        $scope.poundsClass = "btn btn-dark"
        $scope.abbreviation = "lb";
        $scope.defaultWeightSets = {};
        $scope.defaultWeightSets["pounds"] = $scope.pounds;
        $scope.displayWeights = $scope.pounds;
        $scope.barbellWeight = 45;
        $scope.barbellWeightMin = 20;
        $scope.barbellWeightMax = 60;
        $scope.goalWeight = 100;
        $scope.weightMin = 45;
        $scope.weightMax = 900;
        $scope.weightSets = $scope.defaultWeightSets;
        $scope.selection = [];
        setDefaults($scope.weightSets);
    }

    $scope.selection = {};

    // //Turn slider on if weight quantity is increased or turn off is count goes down to 0
    let setDefaults = (data) => {
        $scope.selection = {}
        _.forEach(data, (weightSet) => {
            _.forEach(weightSet, (weight) => {
                if (weight.count > 0) {
                    $scope.selection[weight.weight] = true;
                } else {
                    $scope.selection[weight.weight] = false;
                };

            })
        })
        rackBar();
    }

    let availablePlates = {};
    //Rack the weights onto the bar
    let rackBar = () => {
        availablePlates = {};
        let opts = {};
        let setWeights = [];

        _.forEach($scope.selection, function(selected, index) {
            if (selected) {
                setWeights.push(index);
                _.forEach($scope.displayWeights, (weightDisplayed) => {
                    if (weightDisplayed.weight === Number(index)) {
                        availablePlates[index] = weightDisplayed.count;
                    }
                })
            }
        });

        const options = Object.assign({
            set: setWeights,
            barbellWeight: $scope.barbellWeight,
            availablePlates: availablePlates,
            returnClosest: true,
            addedPlates: [],
        }, opts);
        //Add the barbell weight at the start
        let currentWeight = options.barbellWeight;

        options.set = options.set.concat(options.addedPlates);

        // Put in order by weight, descending
        options.set.sort((a, b) => (a - b)).reverse();

        const result = {
            plates: [],
        };

        // This specifies that two symmetric plates are assumed for all plate additions.
        // This is assumed for now, but could change if an assymetric mode is added.
        const multiplier = 2;

        options.set.forEach((plateWeight) => {
            let limitation = options.availablePlates[plateWeight];

            if (limitation % multiplier) {
                // Weight limits must be divisible by 2 for now.
                limitation -= 1;
            }

            // Null limitation == infinite
            if (currentWeight < $scope.goalWeight && (limitation == null || limitation >= multiplier)) {
                // The weight we're testing to see if it will fit
                const testWeight = plateWeight;

                // Check if we can add this weight to the bar
                if (testWeight <= $scope.goalWeight - currentWeight) {
                    // How many of this plate can we add in total?
                    let qty = Math.floor(($scope.goalWeight - currentWeight) / testWeight);

                    if (qty % multiplier) {
                        qty -= 1;
                    }

                    // Reduce if there are limitations
                    if (limitation && qty > limitation) {
                        qty = limitation;
                    }

                    if (qty) {
                        result.plates.push({
                            plateWeight,
                            qty
                        });
                    }

                    // Add weight to the bar
                    currentWeight += testWeight * qty;
                }
            }
        });

        let holder = []
        _.forEach(availablePlates, (qty, weight) => {
            let numberWeight = Number(weight)
            holder.push(qty * numberWeight);
        })

        let maxWeight = _.reduce(holder, function(sum, n) {
            return sum + n;
        }, options.barbellWeight);

        if (maxWeight < $scope.goalWeight) {
            options.returnClosest = false;
        } else {
            options.returnClosest = true;
        };

        $scope.displayError = null;
        if (options.returnClosest === false) {
            $scope.displayError = "Achieving " + $scope.goalWeight + $scope.abbreviation + " is impossible with current weight set. Closest possible weight is " + currentWeight + $scope.abbreviation
        }

        result.closestWeight = currentWeight

        $scope.result = result;
        $scope.result['maxWeight'] = maxWeight;
        drawBar();

    }

    drawBar = () => {

        let result = []

        _.forEach($scope.result.plates, (weightData) => {

            let n = weightData.qty / 2;

            _.times(n, function() {
                result.push(Number(weightData.plateWeight))
            });
        })

        result = result.reverse();

        d3.select("#svgrack")
            .remove();

        let svg = d3.select("#result")
            .append("svg")
            .attr("id", "svgrack")
            .attr("height", 200)
            .attr("width", 1000);


        let barLeft = 25;
        let barwidth = 510;
        let barthickness = 10;
        let barH = 90 + barthickness / 2;

        svg.append("rect")
            .attr("id", "bar")
            .attr("width", barwidth - barLeft)
            .attr("height", barthickness)
            .attr("border-radius", "10px")
            .attr("stroke", "black")
            .attr("x", barLeft)
            .attr("y", barH - barthickness / 2);

        let scaleHeight = d3.scaleLinear().domain([1.25, 100]).range([50, 300]);
        let plateWidth = 20;

        let drawnCount = 0;
        let weightsOnBar;

        function drawPlate(svg, x, weight) {
            drawnCount++;
            weightsOnBar = drawnCount/2;

            if(weightsOnBar > 10){
                return;
            }

            let plateHeight = scaleHeight(weight)

            let weightClass;

            if ($scope.selectedType === "metric") {
                if (weight === 25) {
                    weightClass = "redPlate"
                }
                if (weight === 20) {
                    weightClass = "bluePlate"
                }
                if (weight === 15) {
                    weightClass = "yellowPlate"
                }
                if (weight === 10) {
                    weightClass = "greenPlate"
                }
                if (weight === 5) {
                    weightClass = "whitePlate"
                }
                if (weight === 2.5) {
                    weightClass = "redPlate"
                }
                if (weight === 2) {
                    weightClass = "bluePlate"
                }
                if (weight === 1.5) {
                    weightClass = "yellowPlate"
                }
                if (weight === 1) {
                    weightClass = "greenPlate"
                }
                if (weight === .5) {
                    weightClass = "whitePlate"
                }
            }

            if ($scope.selectedType === "pounds") {
                if (weight === 55) {
                    weightClass = "redPlate"
                }
                if (weight === 45) {
                    weightClass = "bluePlate"
                }
                if (weight === 35) {
                    weightClass = "yellowPlate"
                }
                if (weight === 25) {
                    weightClass = "greenPlate"
                }
                if (weight === 10) {
                    weightClass = "whitePlate"
                }
                if (weight === 5) {
                    weightClass = "redPlate"
                }
                if (weight === 2.5) {
                    weightClass = "bluePlate"
                }
                if (weight === 2) {
                    weightClass = "yellowPlate"
                }
                if (weight === 1.5) {
                    weightClass = "greenPlate"
                }
                if (weight === 1) {
                    weightClass = "whitePlate"
                }
            }

            svg.append("rect")
                .attr("rx", 3)
                .attr("ry", 3)
                .attr("id", weightClass)
                .attr("stroke", "black")
                .attr("width", plateWidth)
                .attr("height", plateHeight)
                .attr("border-radius", "20px")
                .attr("x", x)
                .attr("y", barH - (plateHeight / 2));
        }

        function drawPlateLabel(svg, y, x, label) {

            if(weightsOnBar > 10){
                return;
            }

            svg.append("text")
                .attr("class", "plateLabel")
                .attr("x", x - 8)
                .attr("y", y + 4)
                .text(label);
        }

        let numPlates = result.length;

        _.forEach(result, (plate, index) => {
            let weight = plate;
            drawPlate(svg, 5 + barLeft + index * 25, weight);
            drawPlateLabel(svg, barH, 5 + barLeft + index * 25 + plateWidth - 2, weight);

            drawPlate(svg, barwidth - (1 + index) * 25, weight);
            drawPlateLabel(svg, barH, barwidth - (1 + index) * 25 + plateWidth - 2, weight);
        })

        $compile(svg.node())($scope);
    }

    $scope.metricSelector();


    $scope.$watchGroup(['barbellWeight', 'goalWeight'], () => {
        rackBar();
    }, true)

    let tempDiff

    $scope.$watch('selection', () => {
        rackBar();
    }, true)

    $scope.$watch('selection', (newValue, oldValue) => {
        let weightOptionChanged = _.reduce(newValue, function(result, value, key) {
            if (_.isEqual(value, oldValue[key])) {
                result
            } else {
                result[key] = value;
            };
            return result
        }, {});

        let optionChanged
        let optionChangedResult
        for (let i in weightOptionChanged) {
            optionChanged = Number(i)
            optionChangedResult = weightOptionChanged[i]
        }

        _.forEach($scope.displayWeights, (option) => {
            if (optionChanged === option.weight) {
                if (optionChangedResult === true) {
                    option.count = 2
                }
                if (optionChangedResult === false) {
                    option.count = 0
                }
            }
        })
        rackBar();
    }, true)

    $scope.$watch('displayWeights', (newValue, oldValue) => {

        _.forEach(newValue, (value) => {
            delete value.$$hashKey
        })

        let diff = _.differenceWith(newValue, oldValue, _.isEqual);
        if (diff[0]) {
            _.forEach($scope.selection, (selection, value) => {
                if (diff[0].count === 0 && Number(value) === diff[0].weight) {
                    $scope.selection[value] = false
                }
                if (diff[0].count > 0 && Number(value) === diff[0].weight) {
                    $scope.selection[value] = true
                }
            })
        }
        rackBar();
    }, true)
});