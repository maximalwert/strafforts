function loadOverviewPage(createNavigation) {
    prepareOverview();

    if (createNavigation || createNavigation === undefined) {
        createNavigationItems('/best-efforts/get_counts', 'best_effort_type', 'best-efforts-for');
        createNavigationItems('/races/get_counts_by_distance', 'race_distance', 'races-for-distance');
        createNavigationItems('/races/get_counts_by_year', 'race_year', 'races-for-year');
    }

    createOverviewDatatable('best-efforts');
    createOverviewDatatable('races');

    // Disable clicking for 'Estimated Best Efforts', 'Race by Distance' and 'Race by Year' treeview headers.
    $('.sidebar-menu .disabled').click(false);
}

function prepareOverview() {
    pushStateToWindow(getBaseUrl());
    resetNavigationItems();
    setContentHeader('Overview');
    appendToPageTitle(' | Overview');

    var mainContent = $('#main-content');
    mainContent.empty(); // Empty main content.

    var content = '<div class="row">';
    content += '<div class="col-xs-12">';
    content += '<div class="nav-tabs-custom">';
    content += '<ul class="nav nav-tabs">';
    content += '<li class="active"><a href="#pane-best-efforts" data-toggle="tab">Best Efforts</a></li>';
    content += '<li><a href="#pane-races" data-toggle="tab">Races</a></li>';
    content += '</ul>';
    content += '<div class="tab-content">';
    content += '<div class="tab-pane active" id="pane-best-efforts">';
    content += constructLoadingIconHtml();
    content += '</div>';
    content += '<div class="tab-pane" id="pane-races">';
    content += constructLoadingIconHtml();
    content += '</div>';
    content += '</div></div></div></div>';

    mainContent.append(content);
}

function createNavigationItems(url, itemName, elementIdPrefix) {
    $.ajax({
        url: getApiBaseUrl() + url,
        dataType: 'json',
        async: false,
        success: function(data) {
            if (data.length === 0) {
                $('#treeview-menu-' + elementIdPrefix).closest('.treeview').empty();
            } else {
                $.each(data, function(key, value) {
                    var itemText = value[itemName];
                    var itemId = value[itemName].replace(/\s/g, "-").replace(/\//g, "-").toLowerCase();
                    var count = value['count'];
                    var isMajor = value['is_major'];
                    var menuItem = '<li>';
                    menuItem += '<a id="' + elementIdPrefix + '-' + itemId + '-navigation" data-turbolinks="false" href="#">';
                    menuItem += '<i class="fa fa-circle-o"></i>';
                    menuItem += '<span class="item-text">';
                    menuItem += itemText;
                    menuItem += '</span>';
                    menuItem += '<span class="pull-right-container">';
                    menuItem += '<small class="pull-right">' + count + '</small>';
                    menuItem += '</span>';
                    menuItem += '</a>';
                    menuItem += '</li>';

                    if (isMajor) {
                        $('#treeview-menu-' + elementIdPrefix).before(menuItem);
                    } else {
                        $('#treeview-menu-' + elementIdPrefix + ' .treeview-menu').append(menuItem);
                    }
                });
            }
        }
    });
}

function createOverviewDatatable(type) {
    $.ajax({
        url: getApiBaseUrl() +  '/' + type,
        dataType: 'json',
        async: false,
        success: function(data) {
            var distances = [];
            $.each(data, function(key, value) {
                var model = {
                    'distance': key,
                    'items': value
                };
                distances.push(model);
            });

            var pane = $('#pane-' + type);
            pane.empty();

            if (distances.length === 0) {
                var infoBox = constructNoDataInfoBox();
                pane.append(infoBox);
            } else {
                distances.forEach(function(model) {
                    var table = '<div class="box">';
                    table += '<div class="box-header">';
                    table += '<h3 class="box-title">' + model['distance'] + '</h3>';
                    table += '<a class="pull-right" id="' + type + '-for-distance-' + model['distance'].toLowerCase().replace(/\s/g, '-').replace(/\//g, '-') + '" data-turbolinks="false" href="#">';
                    table += '<small> View Details</small>';
                    table += '<span class="item-text hidden">' + model['distance'] + '</span>';
                    table += '</a>';
                    table += '</div>';
                    table += '<div class="box-body">';
                    table += '<table class="dataTable table table-bordered table-striped">';
                    table += '<thead>';
                    table += '<tr>';
                    table += '<th class="col-md-1">Date</th>';
                    table += '<th class="col-md-1 text-center badge-cell hidden-xs-sm-md">Type</th>';
                    table += '<th class="col-md-4">Activity</th>';
                    table += '<th class="col-md-1">Time</th>';
                    table += '<th class="col-md-1">Pace</th>';
                    table += '<th class="col-md-2 hidden-xs-sm-md">Shoes</th>';
                    table += '<th class="col-md-1 text-center badge-cell hidden-xs-sm-md">Avg. HR</th>';
                    table += '<th class="col-md-1 text-center badge-cell hidden-xs-sm-md">Max HR</th>';
                    table += '</tr>';
                    table += '</thead>';
                    table += '<tbody>';
                    model['items'].forEach(function(item) {
                        table += '<tr>';
                        table += '<td>' + item['start_date'] + '</td>';
                        table += '<td class="text-center badge-cell hidden-xs-sm-md">';
                        table += '<span class="label workout-type-' + item['workout_type_name'].replace(/\s/g, '-') + '">';
                        table += item['workout_type_name'];
                        table += '</span>';
                        table += '</td>';
                        table += '<td>';
                        table += '<a class="strava-activity-link" href="https://www.strava.com/activities/' + item['activity_id'] + '" target="_blank">';
                        table += item['activity_name'];
                        table += '</a>';
                        table += '</td>';
                        table += '<td>' + item['elapsed_time_formatted'] + '</td>';
                        table += '<td>' + item["pace"] + '<small>' + item["pace_unit"] + '</small></td>';
                        table += '<td class="hidden-xs-sm-md">' + item['gear_name'] + '</td>';
                        table += "<td class='text-center badge-cell hidden-xs-sm-md'>";
                        table += "<span class='badge " + item['average_hr_zone_class'] + "'>" + item['average_heartrate'] + "</span>";
                        table += "</td>";
                        table += "<td class='text-center badge-cell hidden-xs-sm-md'>";
                        table += "<span class='badge " + item['max_hr_zone_class'] + "'>" + item['max_heartrate'] + "</span>";
                        table += '</td>';
                        table += '</tr>';
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
