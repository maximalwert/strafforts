function loadOverviewPage(createNavigation) {
    prepareOverview();

    // Set the global configs to synchronous.
    $.ajaxSetup({
        async: false
    });

    if (createNavigation || createNavigation === undefined) {
        createNavigationItems('/best-efforts/get_counts', 'best_effort_type', 'best-efforts-for');
        createNavigationItems('/races/get_counts_by_distance', 'race_distance', 'races-for') ;
    }

    createOverviewDatatable('best-efforts');
    createOverviewDatatable('races');

    // Set JS back to asynchronous mode.
    $.ajaxSetup({
        async: true
    });
}

function prepareOverview() {
    resetNavigationItems();
    setContentHeader('Overview');
    setPageTitle('Strafforts - A Visualizer for Strava Estimated Best Efforts and Races');

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
    $.getJSON(window.location.pathname + url).then(function(data) {
        $.each(data, function(key, value) {
            var distanceText = value[itemName];
            var distanceId = value[itemName].replace(/\s/g, "-").replace(/\//g, "-").toLowerCase();
            var count = value['count'];
            var isMajor = value['is_major'];
            var menuItem = '<li>';
            menuItem += '<a id="' + elementIdPrefix + '-' + distanceId + '-navigation" data-turbolinks="false" href="#">';
            menuItem += '<i class="fa fa-circle-o"></i>';
            menuItem += '<span class="distance-text">';
            menuItem += distanceText;
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
    });
}
function createOverviewDatatable(type) {
    $.getJSON(window.location.pathname + '/' + type).then(function(data) {
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
        }
        else {
            distances.forEach(function (model) {
                var table = '<div class="box">';
                table += '<div class="box-header">';
                table += '<h3 class="box-title">' + model['distance'] + '</h3>';
                table += '<a class="pull-right" id="' + type + '-for-' + model['distance'].toLowerCase().replace(/\s/g, '-').replace(/\//g, '-') + '" data-turbolinks="false" href="#">';
                table += '<small> View Details</small>';
                table += '<span class="distance-text hidden">' + model['distance'] + '</span>';
                table += '</a>';
                table += '</div>';
                table += '<div class="box-body">';
                table += '<table class="dataTable table table-bordered table-striped">';
                table += '<thead>';
                table += '<tr>';
                table += '<th class="col-md-1">Date</th>';
                table += '<th class="col-md-1 text-center badge-cell">Type</th>';
                table += '<th class="col-md-4">Activity</th>';
                table += '<th class="col-md-1">Time</th>';
                table += '<th class="col-md-1">Pace</th>';
                table += '<th class="col-md-2">Shoes</th>';
                table += '<th class="col-md-1 text-center badge-cell">Avg. HR</th>';
                table += '<th class="col-md-1 text-center badge-cell">Max HR</th>';
                table += '</tr>';
                table += '</thead>';
                table += '<tbody>';
                model['items'].forEach(function (item) {
                    table += '<tr>';
                    table += '<td>' + item['start_date'] + '</td>';
                    table += '<td class="text-center badge-cell">';
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
                    table += '<td>' + item['gear_name'] + '</td>';
                    table += "<td class='text-center badge-cell'>";
                    table += "<span class='badge " + item['average_hr_zone_class'] + "'>" + item['average_heartrate'] + "</span>";
                    table += "</td>";
                    table += "<td class='text-center badge-cell'>";
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
    });
}
