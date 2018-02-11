import { HtmlHelpers } from '../helpers/htmlHelpers';
import BestEffortsByDistanceView from '../views/bestEffortsByDistance';
import NavigationSidebar from '../views/navigationSidebar';
import Overview from '../views/overview';
import { AppHelpers } from './appHelpers';

export namespace EventBinders {

    export function bindAll() {
        const eventBinders = () => {
            // Enable Bootstrap tooltip.
            ($('[data-toggle="tooltip"]') as any).tooltip({
                trigger : 'hover',
            });
            $('[data-toggle="tooltip"]').on('click', (event) => {
                ($(event.currentTarget) as any).tooltip('hide');
            });

            // Disable double clicking for logo and navigation items.
            const selectors = '.main-header .logo, a[id^="personal-bests-for-"], a[id^="races-for-"]';
            $(document).on('dblclick', selectors, (event) => {
                event.preventDefault();
            });

            // Disable clicking for 'PBs by Distance', 'Race by Distance' and 'Race by Year' treeview headers.
            $('.sidebar-menu .disabled').click(false);

            // Always load Overview panes upon clicking.
            $(document).on('click', "a[href^='#pane-races']", () => {
                new Overview().loadRacesPanel();
                new NavigationSidebar().load();
            });
            $(document).on('click', "a[href^='#pane-personal-bests']", () => {
                new Overview().loadPersonalBestsPanel();
                new NavigationSidebar().load();
            });

            $(document).on('click',
                '.best-efforts-filter-buttons .btn-race-distance',
                (event) => {
                $('.best-efforts-filter-buttons .btn-race-distance').removeClass('active');
                $(event.currentTarget).addClass('active');

                const distance = $(event.currentTarget).attr('data-race-distance');
                const distanceFormattedForUrl = AppHelpers.formatDistanceForUrl(distance);

                AppHelpers.pushStateToWindow(`?view=best-efforts&distance=${distanceFormattedForUrl}`);
                new BestEffortsByDistanceView(distance).load();
                new NavigationSidebar().load();
            });

            // Bind race filter buttons in Races Timeline view.
            $(document).on('click', '.timeline-wrapper .filter-buttons .btn:not(.show-all)',
                (event) => {
                // Set the filter button to active upon clicking.
                $('.filter-buttons .btn').removeClass('active');
                $('.filter-buttons .show-all').removeClass('hidden').fadeIn();
                $(event.currentTarget).addClass('active');
            });

            $(document).on('click',
                '.timeline-wrapper .filter-buttons .btn-race-distance, .timeline-wrapper .timeline-header .btn',
                (event) => {
                const distance = $(event.currentTarget).attr('data-race-distance');

                // Show all year labels.
                $('.time-label').fadeIn();

                // Show only timeline items of this distance.
                $('.timeline-item').parent().hide();
                $(`.timeline-item[data-race-distance='${distance}']`).parent().fadeIn();
            });

            $(document).on('click', '.timeline-header .btn', (event) => {
                const distance = $(event.currentTarget).attr('data-race-distance');

                // Update the state of filter buttons.
                $('.filter-buttons .btn').removeClass('active');
                $('.filter-buttons .show-all').removeClass('hidden').fadeIn();
                $(`.filter-buttons [data-race-distance='${distance}']`).addClass('active');
            });

            $(document).on('click', '.timeline-wrapper .filter-buttons .btn-race-year', (event) => {
                const year = $(event.currentTarget).attr('data-race-year');

                // Show only time labels, items of this year.
                $('.time-label').hide();
                $(`.time-label[data-race-year='${year}']`).fadeIn();
                $('.timeline-item').parent().hide();
                $(`.timeline-item[data-race-year='${year}']`).parent().fadeIn();
            });

            // Append PR/Contributions welcome badges upon clicking settings toggle button.
            $(document).on('click', '.control-sidebar-toggle', () => {
                if (!$('.link-contributions-welcome').length) {
                    const badges = HtmlHelpers.getContributionWelcomeBadges();
                    $('#control-sidebar-data-tab').append(badges);
                }
            });

            // Settings' event listeners.
            $(document).on('submit', '.form-save-profile', (event) => {
                saveProfile(event);
            });
            $(document).on('change', '#is_public', (event) => {
                const element = event.currentTarget as HTMLInputElement;
                if (element.checked) {
                    $('#publicize-profile-warning').addClass('hidden');
                } else {
                    $('#publicize-profile-warning').removeClass('hidden');
                }
            });
            $(document).on('submit', '.form-fetch-latest-activities', (event) => {
                // Only fetch if the button is currently enabled.
                if (!$('.form-fetch-latest-activities .submit-form').is(':disabled')) {
                    fetchLatestActivities(event);
                }
            });
            $(document).on('submit', '.form-reset-profile', (event) => {
                // Only reset if the button is currently enabled.
                if (!$('.reset-profile .btn-danger').is(':disabled')) {
                    resetProfile(event);
                }
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
                $('#publicize-profile-warning').addClass('hidden');
            },
            error: (xhr, ajaxOptions, thrownError) => {
                toastr.error(xhr.status + '\n' + thrownError);
            },
        });
    }

    function fetchLatestActivities(event: JQueryEventObject) {
        event.preventDefault();

        $.ajax({
            url: $('.form-fetch-latest-activities').attr('action'),
            data: '',
            cache: false,
            type: 'post',
            success: () => {
                $('.form-fetch-latest-activities .submit-form').prop('disabled', true);
                toastr.success(`Your latest activities have been queued for fetching!`);
            },
            error: (xhr, ajaxOptions, thrownError) => {
                toastr.error(xhr.status + '\n' + thrownError);
            },
        });
    }

    function resetProfile(event: JQueryEventObject) {
        event.preventDefault();

        $('.form-reset-profile .submit-form').prop('disabled', true);

        $.ajax({
            url: $('.form-reset-profile').attr('action'),
            data: '',
            cache: false,
            type: 'post',
        });

        $('.last-activity-retrieved').addClass('hidden');
        $('.last-activity-na').removeClass('hidden');

        // Disable both 'Fetch Latest' and 'Reset' buttons.
        $('.form-fetch-latest-activities .submit-form').prop('disabled', true);
        $('.reset-profile .btn-danger').prop('disabled', true);

        ($('#confirm-reset-profile') as any).modal('toggle');

        toastr.success(`Your account will be reset shortly!<br /><br />
            A full re-synchronization of all your activities will be queued.`);
    }
}
