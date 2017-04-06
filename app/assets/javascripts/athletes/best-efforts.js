function loadBestEffortsView(distanceText) {
    var constructDataTableHtml = function(bestEfforts) {
        var table = '<div class="row">';
        table += '<div class="col-xs-12">';
        table += '<div class="box">';
        table += '<div class="box-header with-border>';
        table += '<i class="fa fa-bar-chart-o"></i><h3 class="box-title">Data Table</h3>';
        table += '<div class="box-body">';

        if (bestEfforts === undefined) {
            table += constructLoadingIconHtml();
        } else {
            table += '<table class="dataTable table table-bordered table-striped">';
            table += createRaceDatatableHeader();
            table += '<tbody>';

            bestEfforts.forEach(function(item) {
                table += createRaceDatatableRow(item);
            });

            table += '</tbody>';
            table += '</table>';
        }
        table += '</div></div></div></div></div>';
        return table;
    };

    var prepareView = function() {
        setContentHeader("Estimated Best Efforts - " + distanceText);
        appendToPageTitle(' |  Best Efforts - ' + distanceText);

        resetNavigationItems();
        var navigationAnchor = $("a[id^='best-efforts-for-" + distanceText.toLowerCase().replace(/ /g, '-').replace(/\//g, '-') + "']");
        setNavigationItem(navigationAnchor);

        var mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create empty progression chart with loading icon.
        var showLoadingIcon = true;
        var topRow = '<div class="row">';
        topRow += constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon);
        topRow += constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon);
        topRow += '</div>';
        mainContent.append(topRow);

        // Create empty data table with loading icon.
        var table = constructDataTableHtml();
        mainContent.append(table);

        // Create empty pie charts with loading icon.
        var pieCharts = '<div class="row">';
        pieCharts += constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon);
        pieCharts += constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon);
        pieCharts += '</div>';
        mainContent.append(pieCharts);
    };

    var createView = function() {
        var distance = distanceText.trim().replace(/\//g, '|');
        $.ajax({
            url: window.location.pathname + '/best-efforts/' + distance,
            dataType: 'json',
            async: false,
            success: function(data) {

                var bestEfforts = [];
                $.each(data, function(key, value) {
                    bestEfforts.push(value);
                });

                var mainContent = $('#main-content');
                mainContent.empty();

                var progressionChartId = 'progression-chart';
                var topRow = '<div class="row">';
                topRow += constructChartHtml(progressionChartId, 'Progression Chart', 8, false);
                topRow += constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, false);
                topRow += '</div>';
                mainContent.append(topRow);
                createProgressionChart(progressionChartId, bestEfforts);
                createYearDistributionChart('year-distribution-pie-chart', bestEfforts);

                // Create data table.
                var table = constructDataTableHtml(bestEfforts);
                mainContent.append(table);
                var setupDataTable = function() {
                    $(".dataTable").each(function() {
                        $(this).DataTable({
                            "columnDefs": [{
                                "targets": [1, 3, 4, 6, 7], // Disable searching for WorkoutType, Time, Pace and HRs.
                                "searchable": false
                            }],
                            "iDisplayLength": 10,
                            "order": [
                                [0, "desc"]
                            ]
                        });
                    });
                };
                setupDataTable();

                var showLoadingIcon = false;
                var pieCharts = '<div class="row">';
                pieCharts += constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon);
                pieCharts += constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon);
                pieCharts += '</div>';
                mainContent.append(pieCharts);
                createWorkoutTypeChart('workout-type-chart', bestEfforts);
                createGearCountChart('gear-count-chart', bestEfforts);
            }
        });
    };

    prepareView();
    createView();
}

function createBestEffortsDatatableHeader() {
    var header = '<thead><tr>';
    header += '<th class="col-md-1">Date</th>';
    header += '<th class="col-md-1 text-center badge-cell">Type</th>';
    header += '<th class="col-md-4">Activity</th>';
    header += '<th class="col-md-1">Time</th>';
    header += '<th class="col-md-1">Pace</th>';
    header += '<th class="col-md-2 hidden-xs-sm-md">Shoes</th>';
    header += '<th class="col-md-1 text-center badge-cell hidden-xs-sm-md">Avg. HR</th>';
    header += '<th class="col-md-1 text-center badge-cell hidden-xs-sm-md">Max HR</th>';
    header += '</tr></thead>';
    return header;
}

function createBestEffortsDatatableRow(item) {
    var row = '<tr>';
    table += '<td>' + item['start_date'] + '</td>';
    table += '<td class="text-center badge-cell">';
    table += '<span class="label workout-type-' + item['workout_type_name'].replace(/ /g, "-") + '">' +
        item['workout_type_name'] + "</span>";
    table += '</td>';
    table += '<td><a class="strava-activity-link" href="https://www.strava.com/activities/' + item["activity_id"] +
        '" target="_blank">' + item["activity_name"] + '</a></td>';
    table += '<td>' + item["elapsed_time_formatted"] + '</td>';
    table += '<td>' + item["pace"] + '<small>' + item["pace_unit"] + '</small></td>';
    table += '<td class="hidden-xs-sm-md">' + item["gear_name"] + '</td>';
    table += '<td class="text-center badge-cell hidden-xs-sm-md">';
    table += '<span class="badge ' + item["average_hr_zone_class"] + '">' + item["average_heartrate"] + '</span>';
    table += '</td>';
    table += '<td class="text-center badge-cell hidden-xs-sm-md">';
    table += '<span class="badge ' + item["max_hr_zone_class"] + '">' + item["max_heartrate"] + '</span>';
    table += '</td>';
    table += '</tr>';
    return row;
}