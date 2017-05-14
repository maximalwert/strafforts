/// <reference path="./../typings/google.analytics.d.ts" />

namespace GoogleAnalyticsHelpers {
    export function sendEvent(category: string, action: string, label?: string) {
        if (label) {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action,
                eventLabel: label.trim()
            });
        } else {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action
            });
        }
    }
    export function sendOutboundLinkClickingEvent(href: string) {
        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'Click',
            eventLabel: href.trim(),
            transport: 'beacon'
        });
    }
}