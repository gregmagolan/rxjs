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
var UsingObservable = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(UsingObservable, _super);
    function UsingObservable(resourceFactory, observableFactory) {
        var _this = _super.call(this) || this;
        _this.resourceFactory = resourceFactory;
        _this.observableFactory = observableFactory;
        return _this;
    }
    /**
     * Creates an Observable that uses a resource which will be disposed at the same time as the Observable.
     *
     * <span class="informal">Use it when you catch yourself cleaning up after an Observable.</span>
     *
     * `using` is a factory operator, which accepts two functions. First function returns a disposable resource.
     * It can be an arbitrary object that implements `unsubscribe` method. Second function will be injected with
     * that object and should return an Observable. That Observable can use resource object during its execution.
     * Both functions passed to `using` will be called every time someone subscribes - neither an Observable nor
     * resource object will be shared in any way between subscriptions.
     *
     * When Observable returned by `using` is subscribed, Observable returned from the second function will be subscribed
     * as well. All its notifications (nexted values, completion and error events) will be emitted unchanged by the output
     * Observable. If however someone unsubscribes from the Observable or source Observable completes or errors by itself,
     * the `unsubscribe` method on resource object will be called. This can be used to do any necessary clean up, which
     * otherwise would have to be handled by hand. Note that complete or error notifications are not emitted when someone
     * cancels subscription to an Observable via `unsubscribe`, so `using` can be used as a hook, allowing you to make
     * sure that all resources which need to exist during an Observable execution will be disposed at appropriate time.
     *
     * @see {@link defer}
     *
     * @param {function(): ISubscription} resourceFactory A function which creates any resource object
     * that implements `unsubscribe` method.
     * @param {function(resource: ISubscription): Observable<T>} observableFactory A function which
     * creates an Observable, that can use injected resource object.
     * @return {Observable<T>} An Observable that behaves the same as Observable returned by `observableFactory`, but
     * which - when completed, errored or unsubscribed - will also call `unsubscribe` on created resource object.
     * @static true
     * @name using
     * @owner Observable
     */
    UsingObservable.create = function (resourceFactory, observableFactory) {
        return new UsingObservable(resourceFactory, observableFactory);
    };
    UsingObservable.prototype._subscribe = function (subscriber) {
        var _a = this, resourceFactory = _a.resourceFactory, observableFactory = _a.observableFactory;
        var resource;
        try {
            resource = resourceFactory();
            return new UsingSubscriber(subscriber, resource, observableFactory);
        }
        catch (err) {
            subscriber.error(err);
        }
    };
    return UsingObservable;
}(Observable));
export { UsingObservable };
var UsingSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(UsingSubscriber, _super);
    function UsingSubscriber(destination, resource, observableFactory) {
        var _this = _super.call(this, destination) || this;
        _this.resource = resource;
        _this.observableFactory = observableFactory;
        destination.add(resource);
        _this.tryUse();
        return _this;
    }
    UsingSubscriber.prototype.tryUse = function () {
        try {
            var source = this.observableFactory.call(this, this.resource);
            if (source) {
                this.add(subscribeToResult(this, source));
            }
        }
        catch (err) {
            this._error(err);
        }
    };
    return UsingSubscriber;
}(OuterSubscriber));
//# sourceMappingURL=UsingObservable.js.map 
