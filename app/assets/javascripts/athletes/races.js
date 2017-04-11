function loadRacesByDistanceView(distanceText) {
    var constructDataTableHtml = function(races) {
        var table = '<div class="row">';
        table += '<div class="col-xs-12">';
        table += '<div class="box">';
        table += '<div class="box-header with-border>';
        table += '<i class="fa fa-bar-chart-o"></i><h3 class="box-title">Data Table</h3>';
        table += '<div class="box-body">';

        if (races === undefined) {
            table += constructLoadingIconHtml();
        } else {
            table += '<table class="dataTable table table-bordered table-striped">';
            table += createRaceDatatableHeader();
            table += '<tbody>';

            races.forEach(function(item) {
                table += createRaceDatatableRow(item);
            });

            table += '</tbody>';
            table += '</table>';
        }
        table += '</div></div></div></div></div>';
        return table;
    };
    var prepareView = function() {
        setContentHeader("Races - " + distanceText);
        appendToPageTitle(' |  Races  - ' + distanceText);

        resetNavigationItems();
        var navigationAnchor = $("a[id^='races-for-distance-" + distanceText.toLowerCase().replace(/ /g, '-').replace(/\//g, '-') + "']");
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
        pieCharts += constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon);
        pieCharts += constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon);
        pieCharts += '</div>';
        mainContent.append(pieCharts);
    };
    var createView = function() {
        var distance = distanceText.trim().replace(/\//g, '|').replace(/\s/g, '-').toLowerCase();
        pushStateToWindow(getBaseUrl() + '/races/' + distance);
        $.ajax({
            url: getApiBaseUrl() + '/races/' + distance,
            dataType: 'json',
            async: false,
            success: function(data) {

                var races = [];
                $.each(data, function(key, value) {
                    races.push(value);
                });

                var mainContent = $('#main-content');
                mainContent.empty();

                // Create a progression chart when distance is not 'Other'.
                var progressionChartId = 'progression-chart';
                var topRow = '<div class="row">';
                topRow += constructChartHtml(progressionChartId, 'Progression Chart', 8, false);
                topRow += constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, false);
                topRow += '</div>';
                mainContent.append(topRow);
                if (distanceText === 'Other') {
                    createChartMessage(progressionChartId, "Not Applicable");
                } else {
                    createProgressionChart(progressionChartId, races);
                }
                createYearDistributionChart('year-distribution-pie-chart', races);

                // Create data table.
                var table = constructDataTableHtml(races);
                mainContent.append(table);
                var setupDataTable = function() {
                    $(".dataTable").each(function() {
                        $(this).DataTable({
                            "columnDefs": [{
                                "targets": [2, 3, 5, 6, 7, 8], // Disable searching for Time, Pace, Elevation, Cadence and HRs.
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

                var pieCharts = '<div class="row">';
                pieCharts += constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, false);
                pieCharts += constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, false);
                pieCharts += '</div>';
                mainContent.append(pieCharts);
                createGearCountChart('gear-count-chart', races);
                createGearMileageChart('gear-mileage-chart', races);
            }
        });
    };

    prepareView();
    createView();
}

function loadRacesByYearView(year) {
    var constructDataTableHtml = function(races) {
        var table = '<div class="row">';
        table += '<div class="col-xs-12">';
        table += '<div class="box">';
        table += '<div class="box-header with-border>';
        table += '<i class="fa fa-bar-chart-o"></i><h3 class="box-title">Data Table</h3>';
        table += '<div class="box-body">';

        if (races === undefined) {
            table += constructLoadingIconHtml();
        } else {
            var allDistances = [
                '100 miles', '100k', '50 miles', '50k', 'Marathon', 'Half Marathon',
                '20k', '15k', '10k', '5k', '3000m', '1 mile', 'Other'
            ]; // Just hard code race distances here. No need to get from server side for now.
            var distancesToDisplay = [];
            allDistances.forEach(function(distance) {
                for (var index = 0; index < races.length; ++index) {
                    var raceDistance = races[index]["race_distance"];
                    if (distance === raceDistance && distancesToDisplay.indexOf(raceDistance) === -1) {
                        distancesToDisplay.push(raceDistance);
                        break;
                    }
                }
            });
            distancesToDisplay.forEach(function(distance) {
                table += '<h4>' + distance + '</h4>';
                table += '<table class="dataTable table table-bordered table-striped">';
                table += createRaceDatatableHeader();
                table += '<tbody>';
                races.forEach(function(item) {
                    if (distance === item['race_distance']) {
                        table += createRaceDatatableRow(item);
                    }
                });
                table += '</tbody>';
                table += '</table>';
            });
        }
        table += '</div></div></div></div></div>';
        return table;
    };
    var prepareView = function() {
        setContentHeader("Races - " + year);
        appendToPageTitle(' |  Races  - ' + year);

        resetNavigationItems();
        var navigationAnchor = $("a[id^='races-for-year-" + year + "']");
        setNavigationItem(navigationAnchor);

        var mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create an empty monthly distribution chart with loading icon.
        var showLoadingIcon = true;
        var barCharts = '<div class="row">';
        barCharts += constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6, showLoadingIcon);
        barCharts += constructChartHtml('monthly-distribution-chart', 'Monthly Distribution Chart', 6, showLoadingIcon);
        barCharts += '</div>';
        mainContent.append(barCharts);

        // Create empty data table with loading icon.
        var table = constructDataTableHtml();
        mainContent.append(table);

        // Create empty pie charts with loading icon.
        var pieCharts = '<div class="row">';
        pieCharts += constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon);
        pieCharts += constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon);
        pieCharts += '</div>';
        mainContent.append(pieCharts);
    };
    var createView = function() {
        pushStateToWindow(getBaseUrl() + '/races/' + year);
        $.ajax({
            url: getApiBaseUrl() + '/races/' + year,
            dataType: 'json',
            async: false,
            success: function(data) {

                var races = [];
                $.each(data, function(key, value) {
                    races.push(value);
                });

                var mainContent = $('#main-content');
                mainContent.empty();

                var barCharts = '<div class="row">';
                barCharts += constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6, false);
                barCharts += constructChartHtml('month-distribution-chart', 'Month Distribution Chart', 6, false);
                mainContent.append(barCharts);
                createRaceDistancesChart('distances-distribution-chart', races);
                createMonthDistributionChart('month-distribution-chart', races);

                // Create data table.
                var table = constructDataTableHtml(races);
                mainContent.append(table);
                var setupDataTable = function() {
                    $(".dataTable").each(function() {
                        $(this).DataTable({
                            "bFilter": false,
                            "bPaginate": false,
                            "iDisplayLength": 10,
                            "info": false,
                            "order": [
                                [0, "desc"]
                            ]
                        });
                    });
                };
                setupDataTable();

                var pieCharts = '<div class="row">';
                pieCharts += constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, false);
                pieCharts += constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, false);
                pieCharts += '</div>';
                mainContent.append(pieCharts);
                createGearCountChart('gear-count-chart', races);
                createGearMileageChart('gear-mileage-chart', races);
            }
        });
    };

    prepareView();
    createView();
}

function loadRacesTimeline() {
    var getRaceYears = function () {
        var years = [];
        $.ajax({
            url: getApiBaseUrl() + '/races/get_counts_by_year',
            dataType: 'json',
            async: false,
            success: function(data) {
                $.each(data, function(key, value) {
                    var year = value['race_year'];
                    if ($.inArray(year, years) === -1) {
                        years.push(year);
                    }
                });
            }
        });
        return years;
    };
    var createRacesTimelineForYear = function (year) {
        var content = '';
        $.ajax({
            url: getApiBaseUrl() + '/races/' + year,
            dataType: 'json',
            async: false,
            success: function(data) {
                var races = [];
                $.each(data, function(key, value) {
                    races.push(value);
                });
                races.forEach(function(item) {
                    content += '<li>';
                    content += '<i class="fa fa-trophy"></i>';
                    content += '<div class="timeline-item race-distance-' + item["race_distance"].toLowerCase().replace(/\s/g, '-') + '">';
                    content += '<span class="time"><i class="fa fa-clock-o"></i> ' + item['start_date'] + '</span>';
                    content += '<h3 class="timeline-header">';
                    content += '<a href="https://www.strava.com/activities/' + item["activity_id"] +
                        '" target="_blank">' + item["activity_name"] + '</a>';
                    content += '<span class="btn btn-xs race-distance-label">' + item["race_distance"] + '</span>';
                    content += '</h3>';
                    content += '<div class="timeline-body">';
                    content += '<div class="activity-data"><strong>Time: </strong>' + item["elapsed_time_formatted"] + '</div>';
                    content += '<div class="activity-data"><strong>Pace: </strong>' + item["pace"] + '<small>' + item["pace_unit"] + '</small></div>';
                    content += '<br /><div class="activity-data"><strong>Elevation: </strong>' + item["elevation"] + '<small>' + item["elevation_unit"] + '</small></div>';
                    if (item["cadence"] !== '') {
                        content += '<div class="activity-data"><strong>Cadence: </strong>' + item["cadence"] + '</div>';
                    }
                    content += '<br /><div class="activity-data"><strong>Gear: </strong>' + item["gear_name"] + '</div>';
                    content += '</div>';
                    content += '</div></li>';
                });
            }
        });
        return content;
    };
    var prepareView = function() {
        resetNavigationItems();
        setContentHeader('Races Timeline');
        appendToPageTitle(' | Races Timeline');

        var mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        var content = '<div class="row">';
        content += '<div class="col-xs-12">';
        content += constructLoadingIconHtml();
        content += '</div></div>';
        mainContent.append(content);
    };
    var createView = function() {
        pushStateToWindow(getBaseUrl() + '/timeline/races');

        var mainContent = $('#main-content');
        var content = '<div class="col-xs-12 text-center"> ';
        content += '<button class="btn btn-sm bg-strava hidden show-races-timeline">Show All Distances</button>';
        content += '</div>';
        content += '<div class="row">';
        content += '<div class="col-xs-12">';
        content += '<ul class="timeline">';

        var years = getRaceYears();
        if (years.length === 0) {
            mainContent.empty();
            mainContent.append(constructNoDataInfoBox());
        } else {
            years.forEach(function(year) {
                content += '<li class="time-label">';
                content += '<span class="bg-strava">' + year + '</span>';
                content += '</li>';
                content += createRacesTimelineForYear(year);
            });
            content += '</ul></div></div>';

            mainContent.empty();
            mainContent.append(content);
        }
    };

    prepareView();
    createView();
}

function createRaceDatatableHeader() {
    var header = '<thead><tr>';
    header += '<th class="col-md-1">Date</th>';
    header += '<th class="col-md-3">Activity</th>';
    header += '<th class="col-md-1">Time</th>';
    header += '<th class="col-md-1">Pace</th>';
    header += '<th class="col-md-2 hidden-xs-sm-md">Gear</th>';
    header += '<th class="col-md-1 hidden-xs-sm-md">Elevation</th>';
    header += '<th class="col-md-1 hidden-xs-sm-md">Cadence</th>';
    header += '<th class="col-md-1 text-center badge-cell hidden-xs-sm-md">Avg. HR</th>';
    header += '<th class="col-md-1 text-center badge-cell hidden-xs-sm-md">Max HR</th>';
    header += '</tr></thead>';
    return header;
}

function createRaceDatatableRow(item) {
    var row = '<tr>';
    row += '<td>' + item['start_date'] + '</td>';
    row += '<td>';
    row += '<a class="strava-logo-link" href="https://www.strava.com/activities/' + item["activity_id"] +
        '" target="_blank"><span></span></a>';
    row += '<a href="https://www.strava.com/activities/' + item["activity_id"] +
        '" target="_blank">' + item["activity_name"] + '</a>';
    row += '</td>';
    row += '<td>' + item["elapsed_time_formatted"] + '</td>';
    row += '<td>' + item["pace"] + '<small>' + item["pace_unit"] + '</small></td>';
    row += '<td class="hidden-xs-sm-md">' + item["gear_name"] + '</td>';
    row += '<td class=" hidden-xs-sm-md">' + item["elevation"] + '<small> ' + item["elevation_unit"] + '</small></td>';
    row += '<td class=" hidden-xs-sm-md">' + item["cadence"] + '</td>';
    row += '<td class="text-center badge-cell hidden-xs-sm-md">';
    row += '<span class="badge ' + item["average_hr_zone_class"] + '">' + item["average_heartrate"] + '</span>';
    row += '</td>';
    row += '<td class="text-center badge-cell hidden-xs-sm-md">';
    row += '<span class="badge ' + item["max_hr_zone_class"] + '">' + item["max_heartrate"] + '</span>';
    row += '</td>';
    row += '</tr>';
    return row;
}
