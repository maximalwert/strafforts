import { Helpers } from './../../common/helpers';
import { ViewType } from './viewTypes';

export namespace AppHelpers {

    export function appendToPageTitle(content: string) {
        const pageTitle = document.title;
        const newTitle = pageTitle.substr(0, pageTitle.lastIndexOf(' | ')) + content;
        $(document).prop('title', newTitle);

        $('meta[property="og:title"]').attr('content', newTitle);
    }

    export function getBaseUrl(isApiCall?: boolean) {
        const athleteId = $('#athlete-id').text().trim();
        const urlPrefix = `${Helpers.getBaseUrl()}${isApiCall ? '/api' : ''}/athletes/${athleteId}`;
        return urlPrefix;
    }

    export function getApiBaseUrl() {
        return getBaseUrl(true);
    }

    export function formatDistanceForUrl(distance: string) {
        return distance.trim().replace(/\//g, '_').replace(/\s/g, '-').toLowerCase();
    }

    export function pushStateToWindow(relativeUrl: string) {
        const url = AppHelpers.getBaseUrl() + relativeUrl;
        window.history.pushState({ url }, '', url);
    }

    export function resetNavigationItems() {
        $('.treeview-menu li:not(.treeview-expander) a').each(function() {
            $(this).parent().removeClass('active');
            $(this).children('i').removeClass('fa-check-circle-o');
            $(this).children('i').addClass('fa-circle-o');
        });
        $('.treeview-menu .treeview-expander').each(function() {
            $(this).removeClass('active');
        });
    }

    export function setContentHeader(headerText: string) {
        const header = $('.content-header h1');
        if (header.length) {
            header.text(headerText);
        } else {
            $('.content-header .breadcrumb').before(`<h1>${headerText}</h1>`);
        }

        const activeBreadcrumb = $('.content-header .breadcrumb li.active');
        if (activeBreadcrumb.length) {
            activeBreadcrumb.text(headerText);
        } else {
            $('.content-header .breadcrumb').append(`<li class="active">${headerText}</li>`);
        }
    }

    export function setActiveNavigationItem() {
        const viewName = Helpers.getUrlParameter('view');

        if (viewName) {
            const navigationAnchor = determineNavigationAnchor(viewName);

            if (navigationAnchor && navigationAnchor.length === 1) {
                navigationAnchor.parent().closest('.treeview-expander').addClass('active');
                navigationAnchor.parent().addClass('active');
                navigationAnchor.children('i').removeClass('fa-circle-o');
                navigationAnchor.children('i').addClass('fa-check-circle-o');
            }
        }
    }

    function determineNavigationAnchor(viewName: string) {
        let navigationAnchor: JQuery | null = null;

        const distance = Helpers.getUrlParameter('distance');
        const distanceId = distance ? distance.replace('_', '-') : undefined;
        const year = Helpers.getUrlParameter('year');

        // Determine the view type first.
        // If it's personal bests, races by distances or races by year,
        // set the active navigation item by URL.
        if (viewName === ViewType.PersonalBests && distanceId) {
            navigationAnchor = $(`.main-sidebar a[id^="personal-bests-for-distance-${distanceId}"]`);
        }

        if (viewName === ViewType.Races) {
            if (distanceId) {
                navigationAnchor = $(`.main-sidebar a[id^="races-for-distance-${distanceId}"]`);
            }

            if (year && /^20\d\d$/g.test(year)) {
                navigationAnchor = $(`.main-sidebar a[id^="races-for-year-${year}"]`);
            }
        }

        return navigationAnchor;
    }
}
