/// <reference path="./../../../../node_modules/@types/hubspot-pace/index.d.ts" />
/// <reference path="./../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="./../../../../node_modules/@types/toastr/index.d.ts" />
/// <reference path="./../common/helpers.ts" />

declare var Pace: HubSpotPaceInterfaces.Pace;
Pace.on('hide', () => {
    $('body').removeClass('page-loading').addClass('page-loaded');
});

const loadView = () => {
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
};

$(document).ready(() => {
    toastr.options = Toastr.getOptions();

    GoogleAnalytics.bindEvents().apply(null);
    EventBinders.bindAll().apply(null);

    new Views.NavigationSidebar().load();

    loadView();

    // Update window state upon navigation bar clicking,
    // which will trigger window.onpopstate change that will then load the view.
    // In this way, browser's back button would never work (in a less confusing way).
    $(document).on('click', '.show-races-timeline', () => {
        new Views.RacesTimeline().updateWindowState();
    });
    $(document).on('click', "a[id^='best-efforts-for-']", (event) => {
        const distance = $(event.currentTarget).find('.item-text').text().trim();
        new Views.BestEffortsByDistance(distance).updateWindowState();
    });
    $(document).on('click', "a[id^='races-for-distance']", (event) => {
        const distance = $(event.currentTarget).find('.item-text').text().trim();
        new Views.RacesByDistance(distance).updateWindowState();
    });
    $(document).on('click', "a[id^='races-for-year']", (event) => {
        const year = $(event.currentTarget).find('.item-text').text().trim();
        new Views.RacesByYear(year).updateWindowState();
    });
    window.onpopstate = (event) => {
        loadView();
    };
});
