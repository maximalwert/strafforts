//= require jquery.easing.min

/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll.
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin.
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 500, 'easeInOutExpo');
        event.preventDefault();
    });
});

$(document).ready(function() {
    // Closes the Responsive Menu on Menu Item Click.
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Remove the focused state after click,
    // otherwise bootstrap will still highlight the link.
    $("a").mouseup(function() {
        $(this).blur();
    });

    // Google Analytics event tracking.
    $('.external').on('click', function() {
        handleOutboundLinkClicks($(this).attr('href'));
    });
    $('.navbar-brand, .navbar-nav a').on('click', function() {
        sendGaEvent('Home', 'Navigate', this.textContent);
    });
    $('.view-demo').on('click', function() {
        sendGaEvent('Home', 'View Demo', this.textContent);
    });
    $('.connect-strava').on('click', function() {
        sendGaEvent('Home', 'Connect Strava', this.textContent);
    });
});
