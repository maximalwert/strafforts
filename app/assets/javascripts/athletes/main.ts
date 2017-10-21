/// <reference path="./../../../../node_modules/@types/hubspot-pace/index.d.ts" />
/// <reference path="./../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="./../../../../node_modules/@types/toastr/index.d.ts" />
/// <reference path="./../common/helpers.ts" />

const loadView = () => {
    const view = Helpers.getUrlParameter('view');
    const distance = Helpers.getUrlParameter('distance');
    const distanceText = distance ? distance.replace('-', ' ').replace('|', '/') : '';
    const year = Helpers.getUrlParameter('year');

    if (view === 'faq') {
        new Views.Faq().load();
    } else if (view === 'timeline') {
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

    // Bind page loading handlers.
    $(document).on('click', '.show-faq', (event) => {
        event.preventDefault();

        AppHelpers.pushStateToWindow('?view=faq');
        new Views.Faq().load();
    });
    $(document).on('click', '.show-overview', (event) => {
        event.preventDefault();

        AppHelpers.pushStateToWindow('');
        new Views.Overview().load();
    });
    $(document).on('click', '.show-races-timeline', (event) => {
        event.preventDefault();

        AppHelpers.pushStateToWindow('?view=timeline&type=races');
        new Views.RacesTimeline().load();
    });
    $(document).on('click', "a[id^='best-efforts-for-']", (event) => {
        event.preventDefault();

        const distance = $(event.currentTarget).find('.item-text').text().trim();
        const distanceFormattedForUrl = AppHelpers.formateDistanceForUrl(distance);

        AppHelpers.pushStateToWindow(`?view=best-efforts&distance=${distanceFormattedForUrl}`);
        new Views.BestEffortsByDistance(distance).load();
    });
    $(document).on('click', "a[id^='races-for-distance']", (event) => {
        event.preventDefault();

        const distance = $(event.currentTarget).find('.item-text').text().trim();
        const distanceFormattedForUrl = AppHelpers.formateDistanceForUrl(distance);

        AppHelpers.pushStateToWindow(`?view=races&distance=${distanceFormattedForUrl}`);
        new Views.RacesByDistance(distance).load();
    });
    $(document).on('click', "a[id^='races-for-year']", (event) => {
        event.preventDefault();

        const year = $(event.currentTarget).find('.item-text').text().trim();

        AppHelpers.pushStateToWindow(`?view=races&year=${year}`);
        new Views.RacesByYear(year).load();
    });
});

$(window).load(() => {
    new Views.NavigationSidebar().load();
    loadView();
});
