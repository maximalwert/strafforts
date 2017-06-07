/// <reference path="./../typings/jquery.d.ts" />
/// <reference path="./../common/googleAnalyticsHelpers.ts" />
/// <reference path="./../common/helpers.ts" />
/// <reference path="./../common/jQueryHelpers.ts" />

/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll.
$(window).scroll(() => {
    if ($('.navbar').offset().top > 50) {
        $('.navbar-fixed-top').addClass('top-nav-collapse');
    } else {
        $('.navbar-fixed-top').removeClass('top-nav-collapse');
    }
});

$(document).ready(() => {
    // jQuery for page scrolling feature - requires jQuery Easing plugin.
    $('a.page-scroll').bind('click', (event) => {
        const anchor = $(event.currentTarget).attr('href');
        $('html, body').stop().animate({
            scrollTop: $(anchor).offset().top,
        }, 500, 'easeInOutExpo');
        event.preventDefault();
    });

    // Closes the Responsive Menu on Menu Item Click.
    $('.navbar-collapse ul li a').click(() => {
        $('.navbar-toggle:visible').click();
    });

    // Remove the focused state after click, otherwise bootstrap will still highlight the link.
    $('a').mouseup(() => {
        $(this).blur();
    });

    // Google Analytics event tracking.
    $('.external').on('click', (event) => {
        GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent($(event.currentTarget).attr('href'));
    });
    $('.navbar-brand, .navbar-nav a').on('click', (event) => {
        GoogleAnalyticsHelpers.sendEvent('Home', 'Navigate', event.currentTarget.textContent);
    });
    $(':not(.error-section) .btn').on('click', (event) => {
        GoogleAnalyticsHelpers.sendEvent('Home', event.currentTarget.textContent, event.currentTarget.textContent);
    });
    $('.btn-connect-strava').on('click', (event) => {
        GoogleAnalyticsHelpers.sendEvent('Home', 'Connect with Strava', 'Connect with Strava');
    });
    $('.error-section .btn').on('click', (event) => {
        GoogleAnalyticsHelpers.sendEvent('Error', event.currentTarget.textContent, event.currentTarget.textContent);
    });
});
