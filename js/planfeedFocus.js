'use strict';

planfeedApp.directive('planfeedFocus', function ($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.planfeedFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});