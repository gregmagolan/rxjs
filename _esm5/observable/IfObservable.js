/** PURE_IMPORTS_START .._Observable,.._util_subscribeToResult,.._OuterSubscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || /*@__PURE__*/ (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Observable } from '../Observable';
import { subscribeToResult } from '../util/subscribeToResult';
import { OuterSubscriber } from '../OuterSubscriber';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var IfObservable = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(IfObservable, _super);
    function IfObservable(condition, thenSource, elseSource) {
        var _this = _super.call(this) || this;
        _this.condition = condition;
        _this.thenSource = thenSource;
        _this.elseSource = elseSource;
        return _this;
    }
    /**
     * Decides at subscription time which Observable will actually be subscribed.
     *
     * <span class="informal">`If` statement for Observables.</span>
     *
     * `if` accepts a condition function and two Observables. When
     * an Observable returned by the operator is subscribed, condition function will be called.
     * Based on what boolean it returns at that moment, consumer will subscribe either to
     * the first Observable (if condition was true) or to the second (if condition was false). Condition
     * function may also not return anything - in that case condition will be evaluated as false and
     * second Observable will be subscribed.
     *
     * Note that Observables for both cases (true and false) are optional. If condition points to an Observable that
     * was left undefined, resulting stream will simply complete immediately. That allows you to, rather
     * then controlling which Observable will be subscribed, decide at runtime if consumer should have access
     * to given Observable or not.
     *
     * If you have more complex logic that requires decision between more than two Observables, {@link defer}
     * will probably be a better choice. Actually `if` can be easily implemented with {@link defer}
     * and exists only for convenience and readability reasons.
     *
     *
     * @example <caption>Change at runtime which Observable will be subscribed</caption>
     * let subscribeToFirst;
     * const firstOrSecond = Rx.Observable.if(
     *   () => subscribeToFirst,
     *   Rx.Observable.of('first'),
     *   Rx.Observable.of('second')
     * );
     *
     * subscribeToFirst = true;
     * firstOrSecond.subscribe(value => console.log(value));
     *
     * // Logs:
     * // "first"
     *
     * subscribeToFirst = false;
     * firstOrSecond.subscribe(value => console.log(value));
     *
     * // Logs:
     * // "second"
     *
     *
     * @example <caption>Control an access to an Observable</caption>
     * let accessGranted;
     * const observableIfYouHaveAccess = Rx.Observable.if(
     *   () => accessGranted,
     *   Rx.Observable.of('It seems you have an access...') // Note that only one Observable is passed to the operator.
     * );
     *
     * accessGranted = true;
     * observableIfYouHaveAccess.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('The end')
     * );
     *
     * // Logs:
     * // "It seems you have an access..."
     * // "The end"
     *
     * accessGranted = false;
     * observableIfYouHaveAccess.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('The end')
     * );
     *
     * // Logs:
     * // "The end"
     *
     * @see {@link defer}
     *
     * @param {function(): boolean} condition Condition which Observable should be chosen.
     * @param {Observable} [trueObservable] An Observable that will be subscribed if condition is true.
     * @param {Observable} [falseObservable] An Observable that will be subscribed if condition is false.
     * @return {Observable} Either first or second Observable, depending on condition.
     * @static true
     * @name if
     * @owner Observable
     */
    IfObservable.create = function (condition, thenSource, elseSource) {
        return new IfObservable(condition, thenSource, elseSource);
    };
    IfObservable.prototype._subscribe = function (subscriber) {
        var _a = this, condition = _a.condition, thenSource = _a.thenSource, elseSource = _a.elseSource;
        return new IfSubscriber(subscriber, condition, thenSource, elseSource);
    };
    return IfObservable;
}(Observable));
export { IfObservable };
var IfSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(IfSubscriber, _super);
    function IfSubscriber(destination, condition, thenSource, elseSource) {
        var _this = _super.call(this, destination) || this;
        _this.condition = condition;
        _this.thenSource = thenSource;
        _this.elseSource = elseSource;
        _this.tryIf();
        return _this;
    }
    IfSubscriber.prototype.tryIf = function () {
        var _a = this, condition = _a.condition, thenSource = _a.thenSource, elseSource = _a.elseSource;
        var result;
        try {
            result = condition();
            var source = result ? thenSource : elseSource;
            if (source) {
                this.add(subscribeToResult(this, source));
            }
            else {
                this._complete();
            }
        }
        catch (err) {
            this._error(err);
        }
    };
    return IfSubscriber;
}(OuterSubscriber));
//# sourceMappingURL=IfObservable.js.map 
