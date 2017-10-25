// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery2
//= require jquery_ujs
//= require bootstrap

//= require autotrack/autotrack

// Google Analytics tracking code with autotrack.
(function (i, s, o, g, r, a, m) {
i['GoogleAnalyticsObject'] = r;
i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
},
i[r].l = 1 * new Date();
a = s.createElement(o),
m = s.getElementsByTagName(o)[0];
a.async = 1;
a.src = g;
m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', document.getElementsByTagName('body')[0].getAttribute('data-ga-tracking-id'), 'auto');

// Replace the following lines with the plugins you want to use.
ga('require', 'cleanUrlTracker', {
  trailingSlash: 'remove'
});
ga('require', 'maxScrollTracker');
ga('require', 'mediaQueryTracker', {
  definitions: [
    {
      name: 'Breakpoint',
      dimensionIndex: 1,
      items: [
        {name: 'sm', media: 'all'},
        {name: 'md', media: '(min-width: 768px)'},
        {name: 'lg', media: '(min-width: 1200px)'}
      ]
    },
    {
      name: 'Pixel Density',
      dimensionIndex: 2,
      items: [
        {name: '1x',   media: 'all'},
        {name: '1.5x', media: '(min-resolution: 144dpi)'},
        {name: '2x',   media: '(min-resolution: 192dpi)'}
      ]
    },
    {
      name: 'Orientation',
      dimensionIndex: 3,
      items: [
        {name: 'landscape', media: '(orientation: landscape)'},
        {name: 'portrait',  media: '(orientation: portrait)'}
      ]
    }
  ]
});
ga('require', 'outboundLinkTracker', {
  events: ['click', 'auxclick', 'contextmenu']
});
ga('require', 'pageVisibilityTracker', {
  sendInitialPageview: true,
});

ga('send', 'pageview');
