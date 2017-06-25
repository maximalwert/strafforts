/// <reference path="./../../common/googleAnalyticsHelpers.ts" />

namespace GoogleAnalytics {
    export function bindEvents() {
        const eventBinders = () => {
            $(document).on('click', 'a.external', (event) => {
                GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent('App - Outbound Links', event.currentTarget as HTMLAnchorElement);
            });

            // App - Header.
            $('.main-header').on('click', '.logo', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Header', 'Click Logo', event.currentTarget);
            });
            $('.main-header').on('click', '.sidebar-toggle', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Header', 'Toggle Navigation Sidebar', event.currentTarget);
            });
            $('.main-header').on('click', '.user-menu .dropdown-toggle', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Header', 'Toggle User Menu', event.currentTarget);
            });
            $('.main-header').on('click', '.social-sharing-toggle', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Header', 'Toggle Profile Sharing Modal', event.currentTarget);
            });
            $('.main-header').on('click', '.control-sidebar-toggle', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Header', 'Toggle Settings Sidebar', event.currentTarget);
            });

            // App - Navigation Sidebar.
            $('.main-sidebar .sidebar-menu').on('click', '.show-overview', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Navigation Sidebar', 'Show Overview', event.currentTarget);
            });
            $('.main-sidebar .sidebar-menu').on('click', '.show-races-timeline', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Navigation Sidebar', 'Show Race Timeline', event.currentTarget);
            });
            $('.main-sidebar .sidebar-menu').on('click', 'a[id^="best-efforts-for-"]', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Navigation Sidebar', 'Show Best Efforts Details', event.currentTarget);
            });
            $('.main-sidebar .sidebar-menu').on('click', 'a[id^="races-for-"]', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Navigation Sidebar', 'Show Races Details', event.currentTarget);
            });
            $('.main-sidebar .sidebar-menu').on('click', '.show-other-distance', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Navigation Sidebar', 'Show Other Distances', event.currentTarget);
            });

            // App - Content.
            $('.content-wrapper').on('click', '.breadcrumb a', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Click Breadcrumb', event.currentTarget);
            });
            $('#main-content').on('click', '.nav-tabs li', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Click Navigation Tab', event.currentTarget);
            });
            $('#main-content').on('click', '.box-header a', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Click View Details', event.currentTarget);
            });
            $('#main-content').delegate('.dataTables_wrapper .dataTables_filter input', 'click', (event) => {
                setTimeout(() => {
                    $(event.currentTarget).attr('title', (event.currentTarget as HTMLInputElement).value);
                    GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Search in DataTable', event.currentTarget);
                }, 3000);
            });
            $('#main-content').delegate('.dataTables_wrapper .paginate_button', 'click', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Navigate in DataTable', event.currentTarget);
            });
            $('#main-content').delegate('.dataTables_wrapper .dataTables_length select', 'change', (event) => {
                const value = parseInt((event.currentTarget as HTMLSelectElement).value, 10);
                $(event.currentTarget).attr('title', 'Change DataTable Pagination');
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Change DataTable Pagination',  event.currentTarget, value);
            });
            $('#main-content').delegate('.dataTables_wrapper .dataTable thead th', 'click', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Sort DataTable Column', event.currentTarget);
            });
            $('#main-content').delegate('.timeline-wrapper .timeline-item .btn', 'click', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Filter Timeline by Header', event.currentTarget);
            });
            $('#main-content').delegate('timeline-wrapper .filter-buttons .btn', 'click', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Main Content', 'Filter Timeline', event.currentTarget);
            });

            // App - Settings Sidebar.
            $('.control-sidebar').on('click', '.sign-out', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Settings Sidebar', 'Sign Out', event.currentTarget);
            });
            $('.control-sidebar').on('click', '.nav-tabs a', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Settings Sidebar', 'Select Tab in Settings', event.currentTarget);
            });
            $('.control-sidebar').on('click', '.show-hear-rate-zones', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Settings Sidebar', 'Show Heart Rate Zones', event.currentTarget);
            });
            $('.control-sidebar').on('click', 'button', (event) => {
                GoogleAnalyticsHelpers.sendEvent('App - Settings Sidebar', 'Click Button in Settings', event.currentTarget);
            });
        };
        return eventBinders;
    }
}
