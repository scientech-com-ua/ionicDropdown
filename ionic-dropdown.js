/**
 * @ngdoc service
 * @name $ionicDropdown
 * @module ionic
 * @description
 *
 * Related: {@link ionic.controller:ionicDropdown ionicDropdown controller}.
 *
 * The Dropdown is a view that floats above an app’s content. Dropdowns provide an
 * easy way to present or gather information from the user and are
 * commonly used in the following situations:
 *
 * - Show more info about the current view
 * - Select a commonly used tool or configuration
 * - Present a list of actions to perform inside one of your views
 *
 * Put the content of the dropdown inside of an `<ion-dropdown-view>` element.
 *
 * @usage
 * ```html
 * <button ion-dropdown title="Choose the items plese">
 *    <label ng-repeat="item in Items" class="item item-radio" ng-class="{'checked': item.checked }">
 *        <input type="checkbox" ng-model="item.checked">
 *        <div class="item-content">
 *          Item {{ item.id }}
 *        </div>
 *        <i class="radio-icon ion-checkmark"></i>
 *    </label>
 * </button>
 * ```
 */

angular.module('ionic.dropdown', ['ionic'])

.directive('ionDropdown', function($compile, $ionicDropdown) {

  return {
    restrict: 'A',
    compile: function($element, $attrs) {
      var content = $element.html();
      $element.html($attrs.title);
      var LinkFn = $compile($element.contents());
      return {
        pre: function ($scope, $element, $attrs) {
          var modal = $ionicDropdown.create(content, {scope: $scope});
          modal.modalEl = modal.el;
          $element.append(LinkFn($scope));
          $element.bind('click', function ($event) {
            if (modal._isShown) {
              modal.hide();
            } else {
              modal.show($event);
            }
          });
        }
      }
    }
  };
})

.directive('ionDropdownView', function($injector) {
  var scrollDirective = $injector.get('ionScrollDirective')[0];
  var dropdownDirective = Object.create(scrollDirective);
  dropdownDirective.compile = function (element) {
    element.addClass('dropdown-view');
    return scrollDirective.compile.apply(dropdownDirective, Array.prototype.slice.call(arguments));
  };
  return dropdownDirective;
})

.factory('$ionicDropdown', ['$ionicModal', '$ionicPosition', '$document', '$window',
function($ionicModal, $ionicPosition, $document, $window) {

  var dropdown_OPTIONS = {
    viewType: 'dropdown-view',
    hideDelay: 1,
    animation: 'none',
    positionView: positionView
  };

  function positionView(target, dropdownEle) {
    var targetEle = angular.element(target.target || target);
    var buttonOffset = $ionicPosition.offset(targetEle);
    var dropdownWidth = targetEle.prop('offsetWidth');
    var dropdownHeight = dropdownEle.prop('offsetHeight');
    // clientHeight doesn't work on all platforms for body
    var bodyHeight = $window.innerHeight;

    var dropdownCSS = {
      left: buttonOffset.left + 'px',
      width: dropdownWidth + 'px',
      marginLeft: '0',
      opacity: '1'
    };

    // If the dropdown when popped down stretches past bottom of screen,
    // make it pop up
    if (buttonOffset.top + buttonOffset.height + dropdownHeight > bodyHeight) {
      dropdownCSS.top = buttonOffset.top - dropdownHeight + 'px';
      dropdownEle.addClass('dropdown-bottom');
    } else {
      dropdownCSS.top = buttonOffset.top + buttonOffset.height + 'px';
      dropdownEle.removeClass('dropdown-bottom');
    }

    dropdownEle.css(dropdownCSS);

  }

  /**
   * @ngdoc controller
   * @name ionicDropdown
   * @module ionic
   * @description
   * Instantiated by the {@link ionic.service:$ionicDropdown} service.
   *
   * Be sure to call [remove()](#remove) when you are done with each dropdown
   * to clean it up and avoid memory leaks.
   *
   * Note: a dropdown will broadcast 'dropdown.shown', 'dropdown.hidden', and 'dropdown.removed' events from its originating
   * scope, passing in itself as an event argument. Both the dropdown.removed and dropdown.hidden events are
   * called when the dropdown is removed.
   */

  /**
   * @ngdoc method
   * @name ionicDropdown#initialize
   * @description Creates a new dropdown controller instance.
   * @param {object} options An options object with the following properties:
   *  - `{object=}` `scope` The scope to be a child of.
   *    Default: creates a child of $rootScope.
   *  - `{boolean=}` `focusFirstInput` Whether to autofocus the first input of
   *    the dropdown when shown.  Default: false.
   *  - `{boolean=}` `backdropClickToClose` Whether to close the dropdown on clicking the backdrop.
   *    Default: true.
   *  - `{boolean=}` `hardwareBackButtonClose` Whether the dropdown can be closed using the hardware
   *    back button on Android and similar devices.  Default: true.
   */

  /**
   * @ngdoc method
   * @name ionicDropdown#show
   * @description Show this dropdown instance.
   * @param {$event} $event The $event or target element which the dropdown should align
   * itself next to.
   * @returns {promise} A promise which is resolved when the dropdown is finished animating in.
   */

  /**
   * @ngdoc method
   * @name ionicDropdown#hide
   * @description Hide this dropdown instance.
   * @returns {promise} A promise which is resolved when the dropdown is finished animating out.
   */

  /**
   * @ngdoc method
   * @name ionicDropdown#remove
   * @description Remove this dropdown instance from the DOM and clean up.
   * @returns {promise} A promise which is resolved when the dropdown is finished animating out.
   */

  /**
   * @ngdoc method
   * @name ionicDropdown#isShown
   * @returns boolean Whether this dropdown is currently shown.
   */

  return {
    /**
     * @ngdoc method
     * @name $ionicDropdown#create
     * @param {string} templateString The template string to use as the dropdowns's
     * content.
     * @param {object} options Options to be passed to the initialize method.
     * @returns {object} An instance of an {@link ionic.controller:ionicDropdown}
     * controller (ionicDropdown is built on top of $ionicDropdown).
     */
    create: function(templateString, options) {console.log(options.scope);
      return $ionicModal.fromTemplate(templateString, ionic.Utils.extend(options || {}, dropdown_OPTIONS) );
    }
  };

}]);
