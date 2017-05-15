/// <reference path="./../../common/googleAnalyticsHelpers.ts" />

namespace GoogleAnalytics {
    export function bindEvents() {
        let eventBinders = () => {
            $(document).on("click", ".external", (event) => {
                let href = $(event.currentTarget).attr('href');
                GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent(href);
            });
            $(document).on("click", ".logo", () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Logo');
            });
            $(document).on("click", ".breadcrumb a", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Breadcrumb', event.currentTarget.textContent);
            });
            $(document).on("click", ".sidebar-toggle", () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Navigation Sidebar');
            });
            $(document).on("click", ".sidebar-menu a[id^='best-efforts-for-'], .sidebar-menu a[id^='races-for-']", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Show Details', $(event.currentTarget).find('.item-text')[0].textContent);
            });
            $(document).on("click", ".sidebar-menu .treeview-header", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select Navigation Header', event.currentTarget.textContent);
            });
            $(document).on("click", ".nav-tabs li", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Navigation Tabs', event.currentTarget.textContent);
            });
            $(document).on("click", ".box-header a", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Box Header Links', event.currentTarget.textContent);
            });
            $(document).on("click", ".notifications-menu .dropdown-toggle", () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Notifications Menu');
            });
            $(document).on("click", ".user-menu .dropdown-toggle", () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle User Menu');
            });
            $(document).on("click", ".user-menu .athlete-link", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Athlete Profile on Strava', $(event.currentTarget).attr('href'));
            });
            $(document).on("click", ".user-menu .athlete-following", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', "View Athlete's Followings", $(event.currentTarget).attr('href'));
            });
            $(document).on("click", ".user-menu .athlete-follower", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', "View Athlete's Followers", $(event.currentTarget).attr('href'));
            });
            $(document).on("click", ".control-sidebar-toggle", () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Control Sidebar');
            });
            $(document).on("click", ".control-sidebar .nav-tabs a", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select Tab in Control Sidebar', $(event.currentTarget).attr('href'));
            });
            $(document).on("click", ".control-sidebar .sign-out", () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Sign Out');
            });
            $(document).on("click", ".control-sidebar button", (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Button in Control Sidebar', event.currentTarget.textContent);
            });
            $(document).on("click", ".control-sidebar .last-activity-retrieved", () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Last Activity Retrieved');
            });

            $('#main-content').delegate('.dataTables_wrapper .dataTables_filter input', 'click', () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Search DataTables');
            });
            $('#main-content').delegate('.dataTables_wrapper .paginate_button', 'click', () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Navigate DataTable Pages');
            });
            $('#main-content').delegate('.dataTables_wrapper .dataTables_length select', 'click', (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select DataTable number of entries', (<HTMLSelectElement>event.currentTarget).value);
            });
            $('#main-content').delegate('.dataTables_wrapper .datatable thead th', 'click', (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Sort DataTable Column', event.currentTarget.textContent);
            });
            $('#main-content').delegate('.strava-activity-link', 'click', () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Activity on Strava');
            });
            $('#main-content').delegate('.timeline .race-distance-label', 'click', (event) => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Filter Distance in Timeline', event.currentTarget.textContent);
            });
            $('#main-content').delegate('.show-races-timeline', 'click', () => {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Show All Distances');
            });
        };
        return eventBinders;
    }
}
