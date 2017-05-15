namespace BestEffortsView {
    export function load(distance: string) {
        prepareView(distance);
        createView(distance);
    }

    function prepareView(distance: string) {
        let navigationAnchor = $(`a[id^='best-efforts-for-${distance.toLowerCase().replace(/ /g, '-').replace(/\//g, '-')}']`);

        AppHelpers.setContentHeader(`Estimated Best Efforts - ${distance}`);
        AppHelpers.appendToPageTitle(` |  Best Efforts - ${distance}`);
        AppHelpers.resetNavigationItems();
        AppHelpers.setNavigationItem(navigationAnchor);

        let mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create empty tables and charts with loading icon.
        let showLoadingIcon = true;
        let content = `
            <div class="row">
                ${constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon)}
                ${constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon)}
            </div>
            ${constructDataTableHtml()}
            <div class="row">'
                ${constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon)}
                ${constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
            </div>
        `;
        mainContent.append(content);
    };

    function createView(distance: string) {
        distance = distance.trim().replace(/\//g, '|').replace(/\s/g, '-').toLowerCase();
        AppHelpers.pushStateToWindow(`${AppHelpers.getBaseUrl()}/best-efforts/${distance}`);
        $.ajax({
            url: `${AppHelpers.getApiBaseUrl()}/best-efforts/${distance}`,
            dataType: 'json',
            async: false,
            success: (data) => {

                let bestEfforts = [];
                $.each(data, (key, value) => {
                    bestEfforts.push(value);
                });

                // Create all tables and charts.
                let mainContent = $('#main-content');
                mainContent.empty();

                let showLoadingIcon = false;
                let content = `
                    <div class="row">
                        ${constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon)}
                        ${constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon)}
                    </div>
                    ${constructDataTableHtml(bestEfforts)}
                    <div class="row">'
                        ${constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon)}
                        ${constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                    </div>
                `;
                mainContent.append(content);

                // Setup all tables and charts.
                createProgressionChart('progression-chart', bestEfforts);
                createYearDistributionChart('year-distribution-pie-chart', bestEfforts);
                $(".dataTable").each(function () {
                    $(this).DataTable({
                        'columnDefs': [{
                            'targets': [1, 3, 4, 6, 7], // Disable searching for WorkoutType, Time, Pace and HRs.
                            'searchable': false
                        }],
                        'iDisplayLength': 10,
                        'order': [
                            [0, 'desc']
                        ]
                    });
                });
                createWorkoutTypeChart('workout-type-chart', bestEfforts);
                createGearCountChart('gear-count-chart', bestEfforts);
            }
        });
    };

    function constructDataTableHtml(bestEfforts?: any[]) {
        let table = HtmlHelpers.getLoadingIconHtml();

        if (bestEfforts) {
            let rows = '';
            bestEfforts.forEach((item) => {
                rows += createBestEffortsDatatableRow(item);
            });

            table = `
                <table class="dataTable table table-bordered table-striped">
                    ${createBestEffortsDatatableHeader()}
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            `;
        }

        let dataTable = `
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header with-border>
                            <i class="fa fa-bar-chart-o"></i><h3 class="box-title">Data Table</h3>
                            <div class="box-body">
                                ${table}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return dataTable;
    };

    function createBestEffortsDatatableHeader() {
        let header = `
            <thead>
                <tr>
                    <th class="col-md-1">Date</th>
                    <th class="col-md-1 text-center badge-cell hidden-xs-down">Type</th>
                    <th class="col-md-4">Activity</th>
                    <th class="col-md-1">Time</th>
                    <th class="col-md-1 hidden-xs-down">Pace</th>
                    <th class="col-md-2 hidden-lg-down">Gear</th>
                    <th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
                    <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>
                </tr>
            </thead>
        `;
        return header;
    }

    function createBestEffortsDatatableRow(item: any) {
        let row = `
            <tr>
                <td>${item['start_date']}</td>
                <td class="text-center badge-cell hidden-xs-down">
                    <span class="label workout-type-${item['workout_type_name'].replace(/ /g, "-")}">${item['workout_type_name']}</span>
                </td>
                <td>
                    <a class="strava-activity-link" href="https://www.strava.com/activities/${item['activity_id']}" target="_blank">
                        ${item['activity_name']}
                    </a>
                </td>
                <td>
                    ${item['elapsed_time_formatted']}
                </td>
                <td class="hidden-xs-down">
                    ${item['pace']}<small>${item['pace_unit']}</small>
                </td>
                <td class="hidden-lg-down">
                    ${item['gear_name']}
                </td>
                <td class="text-center badge-cell hidden-md-down">
                    <span class="badge ${item['average_hr_zone_class']}">
                        ${item['average_heartrate']}
                    </span>
                </td>
                <td class="text-center badge-cell hidden-md-down">
                    <span class="badge ${item['max_hr_zone_class']}">
                        ${item['max_heartrate']}
                    </span>
                </td>
            </tr>
        `;
        return row;
    }
}
