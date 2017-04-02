var app = angular.module('dnd', []);

app.controller('Main', function ($scope, $sce, $timeout) {
    $scope.pageLevel = 0;
    $scope.homePage = {name: 'home'};
    $scope.page = $scope.homePage;
    $scope.data = archentidesData;
    $scope.curTile = null;
    $scope.bgSteps = null;
    $scope.steps = null;
    $scope.showOverlay = false;
    $scope.last = null;

    (function () {
        for (var i = 0; i < $scope.data.pages.length; i++) {
            var page = $scope.data.pages[i];

            if (page.name.toLowerCase() === 'story') {
                $scope.last = page.tiles[page.tiles.length - 1];
            }

            for (var j = 0; j < page.tiles.length; j++) {
                var tile = page.tiles[j];

                if (tile.steps) {
                    for (var k = 0; k < tile.steps.length; k++) {
                        var step = tile.steps[k];
                        step.imageUrl = 'images/Map_' + (j + 1) + '-' + (k + 1) + '.png';
                        step.copyHtml = $sce.trustAsHtml(step.copy);
                    }
                }
            }
        }
    })();

    $scope.isPage = function (page) {
        return $scope.page.name.toUpperCase() === page.toUpperCase();
    };

    $scope.getImage = function (index, obj) {
        var name;

        if (obj.imageName) {
            name = obj.imageName;
        } else if ($scope.page.imagesByName) {
            name = obj.title;
        } else {
            name = $scope.page.name + '-' + (index + 1);
        }

        return 'images/' + name.toLowerCase() + '.jpg';
    };

    $scope.prevStep = function () {
        $scope.curStep = ($scope.curStep + $scope.curTile.steps.length - 1) % $scope.curTile.steps.length;
        setStep();
    };

    $scope.nextStep = function () {
        $scope.curStep = ($scope.curStep + 1) % $scope.curTile.steps.length;
        setStep();
    };

    $scope.activateOverlay = function (on) {
        $scope.showOverlay = on;
        $scope.slideOverlay = !on;

        $timeout(function () {
            $scope.slideOverlay = on;
        });
    };

    $scope.eatClick = function (ev) {
        ev.stopPropagation();
    };

    $scope.setPage = function (page, level) {
        $scope.page = page;
        $scope.pageLevel = level;

        if (level === 2) {
            $scope.curTile = $scope.page;

            if ($scope.page.steps) {
                $scope.bgSteps = $.merge([], $scope.page.steps);
                $scope.steps = $.merge([], $scope.page.steps);
                $scope.curStep = 0;

                for (var i = 0; i < $scope.bgSteps.length; i++) {
                    $scope.bgSteps[i].index = i;
                }

                setStep(true);
            } else {
                $scope.bgSteps = [];
                $scope.steps = [];

            }
        }
    };

    function setStep (initial) {
        var index = 0;

        // find current step, move to end of array
        for (var i = 0; i < $scope.bgSteps.length; i++) {
            $scope.bgSteps[i].preshow = false;
            $scope.bgSteps[i].show = false;

            if ($scope.bgSteps[i].index === $scope.curStep) {
                index = i;
            }
        }

        var step = $scope.bgSteps[index];
        step.preshow = !initial;
        $scope.bgSteps.splice(index, 1);
        $scope.bgSteps.push(step);

        $timeout(function () {
            step.preshow = false;
            step.show = true;
        });
    }
});
