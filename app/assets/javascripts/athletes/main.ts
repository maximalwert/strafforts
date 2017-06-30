/// <reference path="./../../../../node_modules/@types/hubspot-pace/index.d.ts" />
/// <reference path="./../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="./../../../../node_modules/@types/toastr/index.d.ts" />
/// <reference path="./../common/helpers.ts" />

declare var Pace: HubSpotPaceInterfaces.Pace;
Pace.on('hide', () => {
    $('body').removeClass('page-loading').addClass('page-loaded');
});

$(document).ready(() => {
    toastr.options = Toastr.getOptions();

    GoogleAnalytics.bindEvents().apply(null);
    EventBinders.bindAll().apply(null);

    new Views.NavigationSidebar().load();

    const view = Helpers.getUrlParameter('view');
    const distance = Helpers.getUrlParameter('distance');
    const distanceText = distance ? distance.replace('-', ' ').replace('|', '/') : '';
    const year = Helpers.getUrlParameter('year');

    if (view === 'timeline') {
        new Views.RacesTimeline().load();
    } else if (view === 'best-efforts' && distance) {
        new Views.BestEffortsByDistance(distanceText).load();
    } else if (view === 'races' && year && /^20\d\d$/g.test(year)) {
        new Views.RacesByYear(year).load();
    } else if (view === 'races' && distance) {
        new Views.RacesByDistance(distanceText).load();
    } else {
        new Views.Overview().load();
    }
});
