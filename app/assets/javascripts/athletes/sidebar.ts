namespace Sidebar {

    export function bindEvents() {
        let eventBinders = () => {
            // Disable double cliking for logo and navigation items.
            $(document).on('dblclick', ".main-header .logo, a[id^='best-efforts-for-'], a[id^='races-for-']", (event) => {
                event.preventDefault();
            });

            // Disable clicking for 'Estimated Best Efforts', 'Race by Distance' and 'Race by Year' treeview headers.
            $('.sidebar-menu .disabled').click(false);

            // Reload Overview page.
            $(document).on('click', '.show-overview', () => {
                Overview.load();
            });

            // Load Races Overview upon clicking 'Races' tab button if not yet created.
            $(document).on('click', "a[href^='#pane-races']", () => {
                if ($('#pane-races .loading-icon-panel').length) {
                    Overview.loadRaces();
                }
            });

            // Load Races Timeline view.
            $(document).on('click', '.show-races-timeline', () => {
                RacesTimeline.load();
            });

            // Bind race distance selection buttons in Races Timeline view.
            $(document).on('click', '.race-distance-label', (event) => {
                let distance = $(event.currentTarget).text().toLowerCase().replace(/\s/g, '-');

                $('.timeline-item').parent().hide();
                $('.timeline-item.race-distance-' + distance).parent().fadeIn(500);
                $('#main-content .show-races-timeline').removeClass('hidden').fadeIn(500);
            });

            $(document).on('click', "a[id^='best-efforts-for-']", (event) => {
                let distance = $(event.currentTarget).find('.item-text').text();
                BestEffortsView.load(distance);
            });
            $(document).on('click', "a[id^='races-for-distance']", (event) => {
                let distance = $(event.currentTarget).find('.item-text').text();
                loadRacesByDistanceView(distance);
            });
            $(document).on('click', "a[id^='races-for-year']", (event) => {
                let year = $(event.currentTarget).find('.item-text').text();
                loadRacesByYearView(year);
            });

            // Append PR/Contributions welcome badges upon clicking settings toggle button.
            $(document).on('click', '.control-sidebar-toggle', () => {
                if (!$('.link-contributions-welcome').length) {
                    let badges = HtmlHelpers.getContributionWelcomeBadges();
                    $('#control-sidebar-data-tab form').append(badges);
                }
            });
        };
        return eventBinders;
    }

}