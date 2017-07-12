/// <reference path="./../../../../node_modules/@types/google.analytics/index.d.ts" />

namespace GoogleAnalyticsHelpers {
    export function sendEvent(category: string, action: string, element: Element, value?: number) {
        const title = element.getAttribute('title');
        const textConent = element.textContent ? element.textContent.trim() : undefined;
        const label = (title && title.length !== 0) ? title : textConent;
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action.trim(),
            eventLabel: label,
            eventValue: value,
        });
    }
}
