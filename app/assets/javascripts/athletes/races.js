function loadRacesByDistanceView(distance) {
    var constructDataTableHtml = function (races) {
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
            table += '<thead><tr>';
            table += '<th class="col-md-1">Date</th>';
            table += '<th class="col-md-3">Activity</th>';
            table += '<th class="col-md-1">Time</th>';
            table += '<th class="col-md-1">Pace</th>';
            table += '<th class="col-md-2 hidden-sm">Shoes</th>';
            table += '<th class="col-md-1 hidden-sm">Elevation</th>';
            table += '<th class="col-md-1 hidden-sm">Cadence</th>';
            table += '<th class="col-md-1 text-center badge-cell">Avg. HR</th>';
            table += '<th class="col-md-1 text-center badge-cell">Max HR</th>';
            table += '</tr></thead>';
            table += '<tbody>';

            races.forEach(function(item) {
                table += '<tr>';
                table += '<td>' + item['start_date'] + '</td>';
                table += '<td>';
                table += '<a class="strava-logo-link" href="https://www.strava.com/activities/' + item["activity_id"] +
                    '" target="_blank"><span></span></a>';
                table += '<a href="https://www.strava.com/activities/' + item["activity_id"] +
                    '" target="_blank">' + item["activity_name"] + '</a>';
                table += '</td>';
                table += '<td>' + item["elapsed_time_formatted"] + '</td>';
                table += '<td>' + item["pace"] + '<small>' + item["pace_unit"] + '</small></td>';
                table += '<td class="hidden-sm">' + item["gear_name"] + '</td>';
                table += '<td class="hidden-sm">' + item["elevation"] + '<small> ' + item["elevation_unit"] + '</small></td>';
                table += '<td class="hidden-sm">' + item["cadence"] + '</td>';
                table += '<td class="text-center badge-cell">';
                table += '<span class="badge ' + item["average_hr_zone_class"] + '">' + item["average_heartrate"] + '</span>';
                table += '</td>';
                table += '<td class="text-center badge-cell">';
                table += '<span class="badge ' + item["max_hr_zone_class"] + '">' + item["max_heartrate"] + '</span>';
                table += '</td>';
                table += '</tr>';
            });
            table += '</tbody>';
            table += '</table>';
        }
        table += '</div></div></div></div></div>';
        return table;
    };
    var prepareView = function()
    {
        setContentHeader("Races - " + distance);
        appendToPageTitle(' |  Races  - '+ distance);

        resetNavigationItems();
        var navigationAnchor = $("a[id^='races-for-distance-" + distance.toLowerCase().replace(/ /g, '-').replace(/\//g, '-') + "']");
        setNavigationItem(navigationAnchor);

        var mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create empty progression chart with loading icon.
        var showLoadingIcon = true;
        var progressionChart = '<div class="row">';
        progressionChart += constructChartHtml('progression-chart', 'Progression Chart', 12, showLoadingIcon);
        progressionChart += '</div>';
        mainContent.append(progressionChart);

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
    var createView = function () {
        $.ajax({
            url: window.location.pathname + '/races/' + distance.trim().replace(/\//g, '|'),
            dataType: 'json',
            async: false,
            success: function(data) {

                var races = [];
                $.each(data, function(key, value) {
                    races.push(value);
                });

                var mainContent = $('#main-content');
                mainContent.empty();

                var createProgressionChart = function (id, items) {
                    if (items.length > 1) {
                        var activityNames = [];
                        var dates = [];
                        var runTimes = [];

                        items.forEach(function(race) {
                            var activityName = race["activity_name"];
                            var date = race["start_date"];
                            var runTime = race['elapsed_time'];
                            activityNames.push(activityName);
                            dates.push(date);
                            runTimes.push(runTime);
                        });

                        var ctx = $("#" + id).get(0).getContext("2d");
                        ctx.canvas.height = 300;

                        var data = {
                            yLabels: runTimes,
                            labels: dates,
                            datasets: [{
                                label: activityNames,
                                fill: false,
                                lineTension: 0.2,
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "#FC4C02",
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: "#FC4C02",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "#FC4C02",
                                pointHoverBorderColor: "#E34402",
                                pointHoverBorderWidth: 2,
                                pointRadius: 4,
                                pointHitRadius: 10,
                                pointStyle: 'circle',
                                data: runTimes,
                                spanGaps: false
                            }]
                        };
                        var myLineChart = new Chart(ctx, {
                            type: 'line',
                            data: data,
                            options: {
                                legend: {
                                    display: false
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        gridLines: {
                                            display: false
                                        },
                                        type: 'time',
                                        time: {
                                            unit: 'month'
                                        }
                                    }],
                                    yAxes: [{
                                        gridLines: {
                                            display: true,
                                            offsetGridLines: true
                                        },
                                        ticks: {
                                            callback: function(value, index, values) {
                                                return value.toString().toHHMMSS();
                                            }
                                        }
                                    }]
                                },
                                tooltips: {
                                    enabled: true,
                                    mode: 'single',
                                    callbacks: {
                                        title: function(tooltipItem, data) {
                                            return data.datasets[0].label[tooltipItem[0].index];
                                        },
                                        label: function(tooltipItem) {
                                            var text = "Ran " + tooltipItem.yLabel.toString().toHHMMSS();
                                            text += " on " + tooltipItem.xLabel;
                                            return text;
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        createNoEnoughDataMessage(id);
                    }
                };
                var progressionChart = '<div class="row">';
                progressionChart += constructChartHtml('progression-chart', 'Progression Chart', 12, false);
                progressionChart += '</div>';
                mainContent.append(progressionChart);
                createProgressionChart('progression-chart', races);

                // Create data table.
                var table = constructDataTableHtml(races);
                mainContent.append(table);
                var setupDataTable = function () {
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
    var constructDataTableHtml = function (races) {
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
                '20k', '15k', '10k', '5k', '3000m', '1 mile'
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
                table += '<thead><tr>';
                table += '<th class="col-md-1">Date</th>';
                table += '<th class="col-md-3">Activity</th>';
                table += '<th class="col-md-1">Time</th>';
                table += '<th class="col-md-1">Pace</th>';
                table += '<th class="col-md-2 hidden-sm">Shoes</th>';
                table += '<th class="col-md-1 hidden-sm">Elevation</th>';
                table += '<th class="col-md-1 hidden-sm">Cadence</th>';
                table += '<th class="col-md-1 text-center badge-cell">Avg. HR</th>';
                table += '<th class="col-md-1 text-center badge-cell">Max HR</th>';
                table += '</tr></thead>';
                table += '<tbody>';
                races.forEach(function(item) {
                    if (distance === item['race_distance']) {
                        table += '<tr>';
                        table += '<td>' + item['start_date'] + '</td>';
                        table += '<td>';
                        table += '<a class="strava-logo-link" href="https://www.strava.com/activities/' + item["activity_id"] +
                            '" target="_blank"><span></span></a>';
                        table += '<a href="https://www.strava.com/activities/' + item["activity_id"] +
                            '" target="_blank">' + item["activity_name"] + '</a>';
                        table += '</td>';
                        table += '<td>' + item["elapsed_time_formatted"] + '</td>';
                        table += '<td>' + item["pace"] + '<small>' + item["pace_unit"] + '</small></td>';
                        table += '<td class="hidden-sm">' + item["gear_name"] + '</td>';
                        table += '<td class="hidden-sm">' + item["elevation"] + '<small> ' + item["elevation_unit"] + '</small></td>';
                        table += '<td class="hidden-sm">' + item["cadence"] + '</td>';
                        table += '<td class="text-center badge-cell">';
                        table += '<span class="badge ' + item["average_hr_zone_class"] + '">' + item["average_heartrate"] + '</span>';
                        table += '</td>';
                        table += '<td class="text-center badge-cell">';
                        table += '<span class="badge ' + item["max_hr_zone_class"] + '">' + item["max_heartrate"] + '</span>';
                        table += '</td>';
                        table += '</tr>';
                    }
                });
                table += '</tbody>';
                table += '</table>';
            });
        }
        table += '</div></div></div></div></div>';
        return table;
    };
    var prepareView = function()
    {
        setContentHeader("Races - " + year);
        appendToPageTitle(' |  Races  - '+ year);

        resetNavigationItems();
        var navigationAnchor = $("a[id^='races-for-year-" + year + "']");
        setNavigationItem(navigationAnchor);

        var mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create an empty monthly distribution chart with loading icon.
        var showLoadingIcon = true;
        var monthlyDistributionCharts = '<div class="row">';
        monthlyDistributionCharts += constructChartHtml('monthly-distribution-chart', 'Monthly Distribution Chart', 6, showLoadingIcon);
        monthlyDistributionCharts += '</div>';
        mainContent.append(monthlyDistributionCharts);

        // Create empty data table with loading icon.
        var table = constructDataTableHtml();
        mainContent.append(table);

        // Create empty pie charts with loading icon.
        var showLoadingIcon = true;
        var pieCharts = '<div class="row">';
        pieCharts += constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon);
        pieCharts += constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon);
        pieCharts += '</div>';
        mainContent.append(pieCharts);
    };
    var createView = function () {
        $.ajax({
            url: window.location.pathname + '/races/' + year,
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
                var setupDataTable = function () {
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
