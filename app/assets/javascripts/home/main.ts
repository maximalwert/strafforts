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
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

$(document).ready(() => {
    // jQuery for page scrolling feature - requires jQuery Easing plugin.
    $('a.page-scroll').bind('click', (event) => {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 500, 'easeInOutExpo');
        event.preventDefault();
    });

    // Closes the Responsive Menu on Menu Item Click.
    $('.navbar-collapse ul li a').click(() => {
        $('.navbar-toggle:visible').click();
    });

    // Remove the focused state after click, otherwise bootstrap will still highlight the link.
    $("a").mouseup(() => {
        $(this).blur();
    });

    // Google Analytics event tracking.
    $('.external').on('click', () => {
        GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent($(this).attr('href'));
    });
    $('.navbar-brand, .navbar-nav a').on('click', () => {
        GoogleAnalyticsHelpers.sendEvent('Home', 'Navigate', this.textContent);
    });
    $('.view-demo').on('click', () => {
        GoogleAnalyticsHelpers.sendEvent('Home', 'View Demo', this.textContent);
    });
    $('.connect-strava').on('click', () => {
        GoogleAnalyticsHelpers.sendEvent('Home', 'Connect Strava', this.textContent);
    });
});
