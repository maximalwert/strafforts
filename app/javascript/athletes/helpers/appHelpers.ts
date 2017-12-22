import { Helpers } from './../../common/helpers';

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

    export function formateDistanceForUrl(distance: string) {
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
            let navigationAnchor: JQuery | null = null;

            const distance = Helpers.getUrlParameter('distance');
            const distanceId = distance ? distance.replace('_', '-') : undefined;
            const year = Helpers.getUrlParameter('year');

            // Determine the view type first.
            // If it's best efforts, races by distances or races by year,
            // set the active navigation item by URL.
            if (viewName === 'best-efforts' && distanceId) {
                navigationAnchor = $(`a[id^="best-efforts-for-distance-${distanceId}"]`);
            }

            if (viewName === 'races' && distanceId) {
                navigationAnchor = $(`a[id^="races-for-distance-${distanceId}"]`);
            }

            if (viewName === 'races' && year && /^20\d\d$/g.test(year)) {
                navigationAnchor = $(`a[id^="races-for-year-${year}"]`);
            }

            if (navigationAnchor && navigationAnchor.length === 1) {
                navigationAnchor.parent().closest('.treeview-expander').addClass('active');
                navigationAnchor.parent().addClass('active');
                navigationAnchor.children('i').removeClass('fa-circle-o');
                navigationAnchor.children('i').addClass('fa-check-circle-o');
            }
        }
    }
}
