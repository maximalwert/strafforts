namespace EventBinders {

    export function bindAll() {
        const eventBinders = () => {
            // Disable double cliking for logo and navigation items.
            $(document).on('dblclick', ".main-header .logo, a[id^='best-efforts-for-'], a[id^='races-for-']", (event) => {
                event.preventDefault();
            });

            // Disable clicking for 'Estimated Best Efforts', 'Race by Distance' and 'Race by Year' treeview headers.
            $('.sidebar-menu .disabled').click(false);

            // Reload Overview page.
            $(document).on('click', '.show-overview', () => {
                const overview = new Views.Overview();
                overview.load();
            });

            // Load Races Overview upon clicking 'Races' tab button if not yet created.
            $(document).on('click', "a[href^='#pane-races']", () => {
                if ($('#pane-races .loading-icon-panel').length) {
                    const overview = new Views.Overview();
                    overview.loadRacesPanel();
                }
            });

            // Bind other view loading events.
            $(document).on('click', '.show-races-timeline', () => {
                const racesTimeline = new Views.RacesTimeline();
                racesTimeline.load();
            });
            $(document).on('click', "a[id^='best-efforts-for-']", (event) => {
                const distance = $(event.currentTarget).find('.item-text').text().trim();
                const bestEffortsByDistanceView = new Views.BestEffortsByDistance(distance);
                bestEffortsByDistanceView.load();
            });
            $(document).on('click', "a[id^='races-for-distance']", (event) => {
                const distance = $(event.currentTarget).find('.item-text').text().trim();
                const racesByDistanceView = new Views.RacesByDistance(distance);
                racesByDistanceView.load();
            });
            $(document).on('click', "a[id^='races-for-year']", (event) => {
                const year = $(event.currentTarget).find('.item-text').text().trim();
                const racesByYearView = new Views.RacesByYear(year);
                racesByYearView.load();
            });

            // Bind race distance selection buttons in Races Timeline view.
            $(document).on('click', '.race-distance-label', (event) => {
                const distance = $(event.currentTarget).text().toLowerCase().replace(/\s/g, '-');

                $('.timeline-item').parent().hide();
                $('.timeline-item.race-distance-' + distance).parent().fadeIn(500);
                $('#main-content .show-races-timeline').removeClass('hidden').fadeIn(500);
            });

            // Append PR/Contributions welcome badges upon clicking settings toggle button.
            $(document).on('click', '.control-sidebar-toggle', () => {
                if (!$('.link-contributions-welcome').length) {
                    const badges = HtmlHelpers.getContributionWelcomeBadges();
                    $('#control-sidebar-data-tab form').append(badges);
                }
            });

            // Settings' event listeners.
            $(document).on('submit', '.form-save-profile', (event) => {
                saveProfile(event);
            });
            $(document).on('submit', '.form-reset-last-activity-retrieved', (event) => {
                resetLastRetrieveActivity(event);
            });
        };
        return eventBinders;
    }

    function saveProfile(event: JQueryEventObject) {
        event.preventDefault();

        const isPublicCheckbox: HTMLInputElement = $('#is_public')[0] as HTMLInputElement;
        const isPublic = isPublicCheckbox.checked;
        const profileData = {
            is_public: isPublic,
        };

        $.ajax({
            url: $('.form-save-profile').attr('action'),
            data: profileData,
            cache: false,
            type: 'post',
            success: () => {
                toastr.success('Saved Successfully!');
            },
            error: (xhr, ajaxOptions, thrownError) => {
                toastr.error(xhr.status + '\n' + thrownError);
            },
        });
    }

    function resetLastRetrieveActivity(event: JQueryEventObject) {
        event.preventDefault();

        $.ajax({
            url: $('.form-reset-last-activity-retrieved').attr('action'),
            data: '',
            cache: false,
            type: 'post',
            success: () => {
                toastr.success('Saved Successfully!');
                $('.last-activity-retrieved').addClass('hidden');
                $('.last-activity-na').removeClass('hidden');
            },
            error: (xhr, ajaxOptions, thrownError) => {
                toastr.error(xhr.status + '\n' + thrownError);
            },
        });
    }
}
