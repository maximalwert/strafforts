import './../vendor/donorbox.js';

import { Helpers } from './../common/helpers';
import { AppHelpers } from './helpers/appHelpers';
import { EventBinders } from './helpers/eventBinders';
import { GoogleAnalytics } from './helpers/googleAnalytics';
import { Toastr } from './helpers/toastr';
import { ViewType } from './helpers/viewTypes';
import BestEffortsByDistanceView from './views/bestEffortsByDistance';
import FaqView from './views/faq';
import NavigationSidebar from './views/navigationSidebar';
import Overview from './views/overview';
import PersonalBestsByDistanceView from './views/personalBestsByDistance';
import RacesByDistanceView from './views/racesByDistance';
import RacesByYearView from './views/racesByYear';
import RacesTimelineView from './views/racesTimeline';
import UpgradeToProView from './views/upgradeToPro';

const loadView = () => {
    const view = Helpers.getUrlParameter('view');
    const distance = Helpers.getUrlParameter('distance');
    const distanceText = distance ? distance.replace('-', ' ').replace('|', '/') : '';
    const year = Helpers.getUrlParameter('year');

    if (view === 'faq') {
        new UpgradeToProView().load();
    } else if (view === ViewType.Timeline) {
        new RacesTimelineView().load();
    } else if (view === ViewType.BestEfforts) {
        new BestEffortsByDistanceView(distanceText).load();
    } else if (view === ViewType.PersonalBests && distance) {
        new PersonalBestsByDistanceView(distanceText).load();
    } else if (view === ViewType.Races && year && /^20\d\d$/g.test(year)) {
        new RacesByYearView(year).load();
    } else if (view === ViewType.Races && distance) {
        new RacesByDistanceView(distanceText).load();
    } else {
        new Overview().load();
    }
};

$(document).ready(() => {
    // Handle browser back event.
    window.onpopstate = (event) => {
        loadView();
    };

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

        AppHelpers.pushStateToWindow(`?view=${ViewType.Timeline}&type=races`);
        new RacesTimelineView().load();
    });
    $(document).on('click', '.show-best-efforts', (event) => {
        event.preventDefault();

        AppHelpers.pushStateToWindow(`?view=${ViewType.BestEfforts}`);
        new BestEffortsByDistanceView().load();
    });
    $(document).on('click', "a[id^='personal-bests-for-']", (event) => {
        event.preventDefault();

        const distance = $(event.currentTarget).find('.item-text').text().trim();
        const distanceFormattedForUrl = AppHelpers.formatDistanceForUrl(distance);
        const count = $(event.currentTarget).find('small').text().trim();

        AppHelpers.pushStateToWindow(`?view=${ViewType.PersonalBests}&distance=${distanceFormattedForUrl}`);
        new PersonalBestsByDistanceView(distance, count).load();
    });
    $(document).on('click', "a[id^='races-for-distance']", (event) => {
        event.preventDefault();

        const distance = $(event.currentTarget).find('.item-text').text().trim();
        const distanceFormattedForUrl = AppHelpers.formatDistanceForUrl(distance);
        const count = $(event.currentTarget).find('small').text().trim();

        AppHelpers.pushStateToWindow(`?view=${ViewType.Races}&distance=${distanceFormattedForUrl}`);
        new RacesByDistanceView(distance, count).load();
    });
    $(document).on('click', "a[id^='races-for-year']", (event) => {
        event.preventDefault();

        const year = $(event.currentTarget).find('.item-text').text().trim();
        const count = $(event.currentTarget).find('small').text().trim();

        AppHelpers.pushStateToWindow(`?view=${ViewType.Races}&year=${year}`);
        new RacesByYearView(year, count).load();
    });
});

$(window).load(() => {
    new NavigationSidebar().load();
    loadView();
});
