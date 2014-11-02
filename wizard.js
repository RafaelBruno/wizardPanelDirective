$wizard = angular.module("wizard", []);

$wizard.directive('wizard', function($timeout) {
	return {
		scope: {
				nextLabel: "@",
				backLabel: "@",
				alertLabel:"@"
		},
		restrict: 'E',
		transclude: true,
		replace: true,
		controller: function($scope, $element, $attrs) {
			var panes = $scope.panes = [];
			var panesElement = $scope.panesElement = [];
			$scope.countSteps = 0;

			$scope.nextLabel = $attrs.nextLabel;
			$scope.backLabel = $attrs.backLabel;
			$scope.alertLabel = $attrs.alertLabel;

			if(typeof $scope.nextLabel === "undefined"){
				$scope.nextLabel = "Next";
			}if(typeof $scope.backLabel === "undefined"){
				$scope.backLabel = "Back";
			}if(typeof $scope.alertLabel === "undefined"){
				$scope.alertLabel = "Fill out all required fields";
			}


			var progressBarElement = $($($($element).children()).children()[1]).children();
			var backStepElement = $($($($element).children()).children()[3]).children()[0];
			var nextStepElement = $($($($element).children()).children()[3]).children()[1];

			var alertRequired = $($($($element).children()).children()[4]);

			$scope.select = function(pane) {
				angular.forEach(panes, function(pane) {
					pane.selected = false;
				});
				pane.selected = true;
			};

			$scope.nextStep = function() {
				if (isRequiredValue(panesElement[$scope.countSteps])) {
					$(alertRequired).hide();
					$scope.countSteps++;
					$scope.select(panes[$scope.countSteps]);
					if ($scope.countSteps > 0) {
						$(backStepElement).show();
					}
					if (($scope.countSteps + 1) == panes.length) {
						$(nextStepElement).hide();
						$(progressBarElement).removeClass().addClass("progress-bar progress-bar-success");
					}

					$scope.thisProgressBarValue = $scope.thisProgressBarValue + $scope.progressBarValue;
					$(progressBarElement).css({width: $scope.thisProgressBarValue + "%"});
				}
			};

			$scope.backStep = function() {
				$scope.countSteps--;
				$scope.select(panes[$scope.countSteps]);

				if (($scope.countSteps + 1) < panes.length) {
					$(nextStepElement).show();
					$(progressBarElement).removeClass("progress-bar-success");
				}

				if ($scope.countSteps <= 0) {
					$(backStepElement).hide();
				}

				$scope.thisProgressBarValue = $scope.thisProgressBarValue - $scope.progressBarValue;
				$(progressBarElement).css({width: $scope.thisProgressBarValue + "%"});
			};


			function isRequiredValue(thisPane) {
				$scope.isRequiredValue = true;
				var thisPaneInputs = $(thisPane).find("input");

				angular.forEach(thisPaneInputs, function(paneInputs) {
					if ($(paneInputs).attr("required") === "required") {
						if ($(paneInputs).val() === "") {
							$scope.isRequiredValue = false;
							$($(paneInputs).closest("required"))
							.removeClass()
							.addClass("form-group has-error has-feedback");

							$($(paneInputs).closest("#panelRequired")).removeClass()
							.addClass("panel panel-danger");

							$(alertRequired).show().delay(5000).fadeOut();
						}
					}
				});
				$(alertRequired).fadeOut();
				return $scope.isRequiredValue;
			}

			this.addStep = function(pane, paneElem) {
				if (panes.length === 0) {
					$scope.select(pane);
				}
				panes.push(pane);
				panesElement.push(paneElem);

				$scope.progressBarValue = (100 / panes.length);
				$scope.thisProgressBarValue = $scope.progressBarValue;

				$(progressBarElement).css({width: $scope.progressBarValue + "%"});
			};
		},
		link: function(scope, e, a, ctrl, transclude) {
			transclude(scope.$parent, function(clone, scope) {
				$(e).find(".transcludeContainer").append(clone);
			});
			if (a.template !== "left") {
				if (a.justified === "true") {
					scope.justified = 'nav-justified';
				}
				else {
					scope.justified = "";
				}
			} else {
				scope.justified = "";
			}
		},
		templateUrl: function($node, tattrs) {
			return "templates/wizardPanelTemplate.html";
		}
	};
}).directive('wizardstep', function() {
	return {
		scope: {paneltitle: "@"},
		restrict: 'E',
		transclude: true,
		replace: true,
		require: "^wizard",
		link: function(scope, e, a, wizardPanelCtrl, transclude) {
			transclude(scope.$parent, function(clone, scope) {
				$(e).append(clone);
			});
			console.log("wizard Step");
			wizardPanelCtrl.addStep(scope, e);
		},
		templateUrl: "templates/wizardStepTemplate.html"
	};
});


$wizard.directive('required', function() {
	return {
		scope: {panelTitle: "@"
	},
	restrict: 'E',
	transclude: true,
	link: function(scope, e, a, ctrl, transclude) {
		transclude(scope.$parent, function(clone, scope) {
			$(e).find(".transcludeContainer").append(clone);
		});

		if (a.type === "panel") {
			scope.panelTitle = a.panelTitle;
			scope.state = a.state;

			if (typeof scope.state === "undefined" || scope.state === "") {
				scope.state = "default";
			} else if (scope.state !== "primary"
				&& scope.state !== "warning"
				&& scope.state !== "danger"
				&& scope.state !== "success"
				&& scope.state !== "info"
				&& scope.state !== "default") {
				console.warn(scope.state + " Não é um status valido para Panel");
			}

			var thisComponent = $(e).find(".form-control");
			$(e).find(".form-control").prop("required", true);
			$(thisComponent).keyup(function() {
				if ($(thisComponent).val() != "") {
					$(e).find("#panelRequired").removeClass().addClass("panel panel-success");
					$($(thisComponent).closest("required")).removeClass("has-error");
				}
				else {
					$(e).find("#panelRequired").removeClass().addClass("panel panel-" + scope.state);
				}
			});

		} else {
			/*Type required*/
			scope.hasStatus = "";
			var thisComponent = $(e).find(".form-control");
			$(e).find(".form-control").prop("required", true);
			$(thisComponent).keyup(function() {
				if ($(thisComponent).val() != "") {
					$(e).addClass("has-success");
				}
				else {
					$(e).removeClass("has-success");
				}
			});
		}
	},
	templateUrl: function($node, tattrs) {
		if (tattrs.type === "panel") {
			return  "templates/requiredPanel.html";
		}
		else {
			return "templates/required.html";
		}
	}
};
});