var app = angular.module('dnd', []);

app.controller('Main', function ($scope, $sce, $timeout) {
    $scope.homePage = {name: 'home'};
    $scope.page = $scope.homePage;
    $scope.data = archentidesData;
    $scope.curSessionIndex = 0;
    $scope.curSession = $scope.data.sessions[$scope.curSessionIndex];
    $scope.bgSteps = $.merge([], $scope.curSession.steps);
    $scope.steps = $.merge([], $scope.curSession.steps);
    $scope.showOverlay = false;

    for (var i = 0; i < $scope.bgSteps.length; i++) {
        $scope.bgSteps[i].index = i;
    }

    for (var i = 0; i < $scope.data.sessions.length; i++) {
        var session = $scope.data.sessions[i];

        for (var j = 0; j < session.steps.length; j++) {
            var step = session.steps[j];
            step.copy = $sce.trustAsHtml(step.copy);
        }
    }

    $scope.curStep = 0;
    setStep(true);

    $scope.setPage = function (page) {
        $scope.page = page;
    };

    $scope.isPage = function (page) {
        return $scope.page.name.toUpperCase() === page.toUpperCase();
    };

    $scope.prevStep = function () {
        $scope.curStep = ($scope.curStep + $scope.curSession.steps.length - 1) % $scope.curSession.steps.length;
        setStep();
    };
    $scope.nextStep = function () {
        $scope.curStep = ($scope.curStep + 1) % $scope.curSession.steps.length;
        setStep();
    };

    $scope.toggleOverlay = function () {
        $scope.showOverlay = !$scope.showOverlay;
    };

    $scope.activateOverlay = function () {
        $scope.showOverlay = true;
        $scope.slideOverlay = false;

        $timeout(function () {
            $scope.slideOverlay = true;
        });
    };

    $scope.eatClick = function (ev) {
        ev.stopPropagation();
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
