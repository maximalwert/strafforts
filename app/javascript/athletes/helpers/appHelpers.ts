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

    export function setNavigationItem(anchor: JQuery) {
        anchor.parent().closest('.treeview-expander').addClass('active');
        anchor.parent().addClass('active');
        anchor.children('i').removeClass('fa-circle-o');
        anchor.children('i').addClass('fa-check-circle-o');
    }
}
