namespace Overview {
    export function load(createNavigation?: boolean) {
        let baseUrl = AppHelpers.getBaseUrl();
        AppHelpers.pushStateToWindow(baseUrl);
        AppHelpers.resetNavigationItems();
        AppHelpers.setContentHeader('Overview');
        AppHelpers.appendToPageTitle(' | Overview');

        createEmptyOverviewPanels();

        if (createNavigation) {
            createNavigationItems('/best-efforts/get_counts', 'best_effort_type', 'best-efforts-for');
            createNavigationItems('/races/get_counts_by_distance', 'race_distance', 'races-for-distance');
            createNavigationItems('/races/get_counts_by_year', 'race_year', 'races-for-year');
        }

        createOverviewDatatable('best-efforts');
    }

    export function createOverviewDatatableForRaces() {
        createOverviewDatatable('races');
    }

    export function loadWithNavigation() {
        load(true);
    }

    function createEmptyOverviewPanels() {
        let mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        let content = `
        <div class="row">
            <div class="col-xs-12">
                <div class="nav-tabs-custom">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#pane-best-efforts" data-toggle="tab">Best Efforts</a>
                        </li>
                        <li>
                            <a href="#pane-races" data-toggle="tab">Races</a>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="pane-best-efforts">${HtmlHelpers.getLoadingIconHtml()}</div>
                        <div class="tab-pane" id="pane-races">${HtmlHelpers.getLoadingIconHtml()}</div>
                    </div>
                </div>
            </div>
        </div>`;
        mainContent.append(content);
    }

    function createNavigationItems(url: string, itemName: string, elementIdPrefix: string) {
        let fullUrl = AppHelpers.getApiBaseUrl() + url;
        $.ajax({
            url: fullUrl,
            dataType: 'json',
            async: false,
            success: (data) => {
                if (data.length === 0) {
                    $(`#treeview-menu-${elementIdPrefix}`).closest('.treeview').empty();
                } else {
                    $.each(data, (key, value) => {
                        let itemText = value[itemName];
                        let itemId = value[itemName].replace(/\s/g, "-").replace(/\//g, "-").toLowerCase();
                        let elementId = `${elementIdPrefix}-${itemId}-navigation`
                        let count = value['count'];

                        let menuItem = `
                        <li>
                            <a id="${elementId}" href="#">
                                <i class="fa fa-circle-o"></i>
                                <span class="item-text">${itemText}</span>
                                <span class="pull-right-container">
                                    <small class="pull-right">${count}</small>
                                </span>
                            </a>
                        </li>`;

                        let isMajor = value['is_major'];
                        if (isMajor) {
                            $(`#treeview-menu-${elementIdPrefix}`).before(menuItem);
                        } else {
                            $(`#treeview-menu-${elementIdPrefix} .treeview-menu`).append(menuItem);
                        }
                    });
                }
            }
        });
    }

    function createOverviewDatatable(type: string) {
        let fullUrl = AppHelpers.getApiBaseUrl() + '/' + type;
        $.ajax({
            url: fullUrl,
            dataType: 'json',
            async: false,
            success: (data) => {
                let distances = [];
                $.each(data, (key, value) => {
                    let model = {
                        'distance': key,
                        'items': value
                    };
                    distances.push(model);
                });

                let pane = $('#pane-' + type);
                pane.empty();

                if (distances.length === 0) {
                    let infoBox = HtmlHelpers.getNoDataInfoBox();
                    pane.append(infoBox);
                } else {
                    distances.forEach((model) => {
                        let linkId = `${type}-for-distance-${model['distance'].toLowerCase().replace(/\s/g, '-').replace(/\//g, '-')}`;
                        let table = `
                        <div class="box">
                            <div class="box-header">
                                <h3 class="box-title">
                                    ${model['distance']}
                                </h3>
                                <a class="pull-right" id="${linkId}" href="#">
                                    <small> View Details</small>
                                    <span class="item-text hidden">
                                        ${model['distance']}
                                    </span>
                                </a>
                            </div>
                        <div class="box-body">
                            <table class="dataTable table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th class="col-md-1">Date</th>
                                    <th class="col-md-1 text-center badge-cell hidden-md-down">Type</th>
                                    <th class="col-md-4">Activity</th>
                                    <th class="col-md-1">Time</th>
                                    <th class="col-md-1 hidden-xs-down">Pace</th>
                                    <th class="col-md-2 hidden-lg-down">Gear</th>
                                    <th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
                                    <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>
                                </tr>
                            </thead>
                            <tbody>`;

                        model['items'].forEach((item) => {
                            table += `
                            <tr>
                                <td>${item['start_date']}</td>
                                <td class="text-center badge-cell hidden-md-down">
                                    <span class="label workout-type-${item['workout_type_name'].replace(/\s/g, '-')}">
                                        ${item['workout_type_name']}
                                    </span>
                                </td>
                                <td>
                                    <a class="strava-activity-link" href="https://www.strava.com/activities/${item['activity_id']}" target="_blank">
                                        ${item['activity_name']}
                                    </a>
                                </td>
                                <td>${item['elapsed_time_formatted']}</td>
                                <td class="hidden-xs-down">
                                    ${item["pace"]}<small>${item["pace_unit"]}</small>
                                </td>
                                <td class="hidden-lg-down">${item['gear_name']}</td>
                                <td class='text-center badge-cell hidden-md-down'>
                                    <span class="badge ${item['average_hr_zone_class']}">${item['average_heartrate']}</span>
                                </td>
                                <td class='text-center badge-cell hidden-md-down'>
                                    <span class="badge ${item['max_hr_zone_class']}">${item['max_heartrate']}</span>
                                </td>
                            </tr>`;
                        });

                        table += '</tbody>';
                        table += '</table>';
                        table += '</div></div>';
                        pane.append(table);
                    });
                }
            }
        });
    }
}
