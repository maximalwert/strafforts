namespace AppHelpers {

    export function appendToPageTitle(content: string) {
        const pageTitle = document.title;
        const newTitle = pageTitle.substr(0, pageTitle.lastIndexOf(' | ')) + content;
        $(document).prop('title', newTitle);

        $('meta[property="og:title"]').attr('content', newTitle);
    }

    export function getBaseUrl(isApiCall?: boolean) {
        const athleteId = $('#athlete-id').text().trim();
        const urlPrefix = `${window.location.protocol}//${window.location.host}${isApiCall ? '/api' : ''}/athletes/${athleteId}`;
        return urlPrefix;
    }

    export function getApiBaseUrl() {
        return getBaseUrl(true);
    }

    export function pushStateToWindow(url: string) {
        window.history.pushState({}, '', url);
    }

    export function resetNavigationItems() {
        $('.treeview-menu li:not(.treeview-expander) a').each(function() {
            $(this).parent().removeClass('active');
            $(this).children('i').removeClass('fa-check-circle-o');
            $(this).children('i').addClass('fa-circle-o');
        });
    }

    export function setContentHeader(headerText: string) {
        $('.content-header h1').text(headerText);
        $('.content-header .breadcrumb li.active').text(headerText);
    }

    export function setNavigationItem(anchor: JQuery) {
        anchor.parent().closest('.treeview-expander').addClass('active');
        anchor.parent().addClass('active');
        anchor.children('i').removeClass('fa-circle-o');
        anchor.children('i').addClass('fa-check-circle-o');
    }
}
