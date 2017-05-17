/// <reference path="./../typings/google.analytics.d.ts" />
var GoogleAnalyticsHelpers;
(function (GoogleAnalyticsHelpers) {
    function sendEvent(category, action, label) {
        if (label) {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action,
                eventLabel: label.trim()
            });
        }
        else {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action
            });
        }
    }
    GoogleAnalyticsHelpers.sendEvent = sendEvent;
    function sendOutboundLinkClickingEvent(href) {
        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'Click',
            eventLabel: href.trim(),
            transport: 'beacon'
        });
    }
    GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent = sendOutboundLinkClickingEvent;
})(GoogleAnalyticsHelpers || (GoogleAnalyticsHelpers = {}));
var RgbColor = (function () {
    function RgbColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return RgbColor;
}());
/// <reference path="./../common/rgbColor.ts" />
var Helpers;
(function (Helpers) {
    function convertDurationToTime(duration) {
        var totalSeconds = parseInt(duration, 10); // Don't forget the second param.
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
        var hoursText = hours < 10 ? "0" + hours : hours.toString();
        var minutesText = minutes < 10 ? "0" + minutes : minutes.toString();
        var secondsText = seconds < 10 ? "0" + seconds : seconds.toString();
        var time = hoursText + ":" + minutesText + ":" + secondsText;
        return time;
    }
    Helpers.convertDurationToTime = convertDurationToTime;
    function getRgbColors() {
        var colors = [
            new RgbColor(189, 214, 186),
            new RgbColor(245, 105, 84),
            new RgbColor(0, 166, 90),
            new RgbColor(243, 156, 18),
            new RgbColor(64, 127, 127),
            new RgbColor(212, 154, 106),
            new RgbColor(78, 156, 104),
            new RgbColor(212, 166, 106),
            new RgbColor(245, 105, 84),
            new RgbColor(0, 166, 90),
            new RgbColor(243, 156, 18),
            new RgbColor(64, 127, 127),
            new RgbColor(212, 154, 106),
            new RgbColor(78, 156, 104),
        ];
        return colors;
    }
    Helpers.getRgbColors = getRgbColors;
    function convertToRgbaColors(rgbColors, alpha) {
        var colors = [];
        rgbColors.forEach(function (item, index) {
            var color = "rgba(" + rgbColors[index].r + ", " + rgbColors[index].g + ", " + rgbColors[index].b + ", " + alpha + ")";
            colors.push(color);
        });
        return colors;
    }
    Helpers.convertToRgbaColors = convertToRgbaColors;
})(Helpers || (Helpers = {}));
/// <reference path="./../typings/jquery.d.ts" />
var jQueryHelpers;
(function (jQueryHelpers) {
    function attachEventHandler(locator, actionName, callback) {
        $(locator).on(actionName, callback);
    }
    jQueryHelpers.attachEventHandler = attachEventHandler;
    function attachClickEventHandler(locator, callback) {
        attachEventHandler(locator, 'click', callback);
    }
    jQueryHelpers.attachClickEventHandler = attachClickEventHandler;
})(jQueryHelpers || (jQueryHelpers = {}));
/// <reference path="./../typings/jquery.d.ts" />
/// <reference path="./../common/googleAnalyticsHelpers.ts" />
/// <reference path="./../common/helpers.ts" />
/// <reference path="./../common/jQueryHelpers.ts" />
var _this = this;
/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */
// jQuery to collapse the navbar on scroll.
$(window).scroll(function () {
    if ($('.navbar').offset().top > 50) {
        $('.navbar-fixed-top').addClass('top-nav-collapse');
    }
    else {
        $('.navbar-fixed-top').removeClass('top-nav-collapse');
    }
});
$(document).ready(function () {
    // jQuery for page scrolling feature - requires jQuery Easing plugin.
    $('a.page-scroll').bind('click', function (event) {
        var anchor = $(event.currentTarget).attr('href');
        $('html, body').stop().animate({
            scrollTop: $(anchor).offset().top
        }, 500, 'easeInOutExpo');
        event.preventDefault();
    });
    // Closes the Responsive Menu on Menu Item Click.
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });
    // Remove the focused state after click, otherwise bootstrap will still highlight the link.
    $('a').mouseup(function () {
        $(_this).blur();
    });
    // Google Analytics event tracking.
    $('.external').on('click', function () {
        GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent($(_this).attr('href'));
    });
    $('.navbar-brand, .navbar-nav a').on('click', function () {
        GoogleAnalyticsHelpers.sendEvent('Home', 'Navigate', _this.textContent);
    });
    $('.view-demo').on('click', function () {
        GoogleAnalyticsHelpers.sendEvent('Home', 'View Demo', _this.textContent);
    });
    $('.connect-strava').on('click', function () {
        GoogleAnalyticsHelpers.sendEvent('Home', 'Connect Strava', _this.textContent);
    });
});
//# sourceMappingURL=home.js.map