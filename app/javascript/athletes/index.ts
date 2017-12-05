import './../vendor/donorbox.js';

import { Helpers } from './../common/helpers';
import { AppHelpers } from './helpers/appHelpers';
import { EventBinders } from './helpers/eventBinders';
import { GoogleAnalytics } from './helpers/googleAnalytics';
import { Toastr } from './helpers/toastr';
import BestEffortsByDistanceView from './views/bestEffortsByDistance';
import FaqView from './views/faq';
import NavigationSidebar from './views/navigationSidebar';
import Overview from './views/overview';
import RacesByDistanceView from './views/racesByDistance';
import RacesByYearView from './views/racesByYear';
import RacesTimelineView from './views/racesTimeline';

const loadView = () => {
    const view = Helpers.getUrlParameter('view');
    const distance = Helpers.getUrlParameter('distance');
    const distanceText = distance ? distance.replace('-', ' ').replace('|', '/') : '';
    const year = Helpers.getUrlParameter('year');

    if (view === 'faq') {
        new FaqView().load();
    } else if (view === 'timeline') {
        new RacesTimelineView().load();
    } else if (view === 'best-efforts' && distance) {
        new BestEffortsByDistanceView(distanceText).load();
    } else if (view === 'races' && year && /^20\d\d$/g.test(year)) {
        new RacesByYearView(year).load();
    } else if (view === 'races' && distance) {
        new RacesByDistanceView(distanceText).load();
    } else {
        new Overview().load();
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
        new FaqView().load();
    });
    $(document).on('click', '.show-overview', (event) => {
        event.preventDefault();

        AppHelpers.pushStateToWindow('');
        new Overview().load();
    });
    $(document).on('click', '.show-races-timeline', (event) => {
        event.preventDefault();

        AppHelpers.pushStateToWindow('?view=timeline&type=races');
        new RacesTimelineView().load();
    });
    $(document).on('click', "a[id^='best-efforts-for-']", (event) => {
        event.preventDefault();

        const distance = $(event.currentTarget).find('.item-text').text().trim();
        const count = $(event.currentTarget).find('small').text().trim();
        const distanceFormattedForUrl = AppHelpers.formateDistanceForUrl(distance);

        AppHelpers.pushStateToWindow(`?view=best-efforts&distance=${distanceFormattedForUrl}`);
        new BestEffortsByDistanceView(distance, count).load();
    });
    $(document).on('click', "a[id^='races-for-distance']", (event) => {
        event.preventDefault();

        const distance = $(event.currentTarget).find('.item-text').text().trim();
        const distanceFormattedForUrl = AppHelpers.formateDistanceForUrl(distance);

        AppHelpers.pushStateToWindow(`?view=races&distance=${distanceFormattedForUrl}`);
        new RacesByDistanceView(distance).load();
    });
    $(document).on('click', "a[id^='races-for-year']", (event) => {
        event.preventDefault();

        const year = $(event.currentTarget).find('.item-text').text().trim();

        AppHelpers.pushStateToWindow(`?view=races&year=${year}`);
        new RacesByYearView(year).load();
    });
});

$(window).load(() => {
    new NavigationSidebar().load();
    loadView();
});
