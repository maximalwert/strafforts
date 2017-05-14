/// <reference path="./../typings/jquery.d.ts" />

namespace jQueryHelpers {
    export function attachEventHandler(locator: string, actionName: string, callback: () => void) {
        $(locator).on(actionName, callback);
    }

    export function attachClickEventHandler(locator: string, callback: () => void) {
        attachEventHandler(locator, 'click', callback);
    }
}