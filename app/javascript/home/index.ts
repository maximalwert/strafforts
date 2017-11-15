import { Helpers } from './../common/helpers';

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
    $('.homepage').on('click', '.btn', (event) => {
        const actionName = event.currentTarget.textContent ? event.currentTarget.textContent : 'Click Button';
        Helpers.sendGoogleAnalyticsEvent('Home', actionName, event.currentTarget);
    });
    $('.homepage').on('click', '.btn-connect-with-strava', (event) => {
        Helpers.sendGoogleAnalyticsEvent('Home', 'Connect with Strava', event.currentTarget);
    });
    $('.navbar').on('click', '.navbar-toggle', (event) => {
        Helpers.sendGoogleAnalyticsEvent('Home', 'Toggle Navigation Menu', event.currentTarget);
    });
    $('.navbar').on('click', '.navbar-brand, .navbar-nav a', (event) => {
        Helpers.sendGoogleAnalyticsEvent('Home', 'Navigate', event.currentTarget);
    });
    $('.error-page').on('click', '.btn', (event) => {
        const actionName = event.currentTarget.textContent ? event.currentTarget.textContent : 'Click Button';
        const errorCode = parseInt($('body').attr('data-error-code'), 10);
        Helpers.sendGoogleAnalyticsEvent('Error', actionName, event.currentTarget, errorCode);
    });
});
