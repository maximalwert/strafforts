/// <reference path="./../typings/google.analytics.d.ts" />

namespace GoogleAnalyticsHelpers {
    export function sendEvent(category: string, action: string, element: Element, value?: number) {
        const title = element.getAttribute('title') ? element.getAttribute('title') : '';
        const label = title.length === 0 ? element.textContent.trim() : title;
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action.trim(),
            eventLabel: label ? label : null,
            eventValue: value ? value : null,
        });
    }
}
