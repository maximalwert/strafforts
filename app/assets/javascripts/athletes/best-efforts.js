function loadBestEffortsView(distanceText) {
    var constructDataTableHtml = function (bestEfforts) {
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
            table += '<thead><tr>';
            table += '<th class="col-md-1">Date</th>';
            table += '<th class="col-md-1 text-center badge-cell">Type</th>';
            table += '<th class="col-md-4">Activity</th>';
            table += '<th class="col-md-1">Time</th>';
            table += '<th class="col-md-1">Pace</th>';
            table += '<th class="col-md-2 hidden-sm">Shoes</th>';
            table += '<th class="col-md-1 text-center badge-cell">Avg. HR</th>';
            table += '<th class="col-md-1 text-center badge-cell">Max HR</th>';
            table += '</tr></thead>';
            table += '<tbody>';

            bestEfforts.forEach(function(item) {
                table += '<tr>';
                table += '<td>' + item['start_date'] + '</td>';
                table += '<td class="text-center badge-cell">';
                table += '<span class="label workout-type-' + item['workout_type_name'].replace(/ /g, "-") + '">' +
                    item['workout_type_name'] + "</span>";
                table += '</td>';
                table += '<td>' + '<a class="strava-activity-link" href="https://www.strava.com/activities/' + item["activity_id"] +
                    '" target="_blank">' + item["activity_name"] + '</a>' + '</td>';
                table += '<td>' + item["elapsed_time_formatted"] + '</td>';
                table += '<td>' + item["pace"] + '<small>' + item["pace_unit"] + '</small></td>';
                table += '<td class="hidden-sm">' + item["gear_name"] + '</td>';
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
        setContentHeader("Estimated Best Efforts - " + distanceText);
        appendToPageTitle(' |  Best Efforts - '+ distanceText);

        resetNavigationItems();
        var navigationAnchor = $("a[id^='best-efforts-for-" + distanceText.toLowerCase().replace(/ /g, '-').replace(/\//g, '-') + "']");
        setNavigationItem(navigationAnchor);

        var mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create empty progression chart with loading icon.
        var showLoadingIcon = true;
        var progressionChart = constructChartHtml('progression-chart', 'Progression Chart', 12, showLoadingIcon);
        mainContent.append(progressionChart);

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

    var createView = function () {
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

                var createProgressionChart = function (id, items) {
                    if (items.length > 1) {
                        var activityNames = [];
                        var dates = [];
                        var runTimes = [];

                        items.forEach(function(bestEffort) {
                            var activityName = bestEffort["activity_name"];
                            var date = bestEffort["start_date"];
                            var runTime = bestEffort['elapsed_time'];
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
                                lineTension: 0,
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
                                            callback: function(value) {
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
                var progressionChart = constructChartHtml('progression-chart', 'Progression Chart', 12, false);
                mainContent.append(progressionChart);
                createProgressionChart('progression-chart', bestEfforts);

                // Create data table.
                var table = constructDataTableHtml(bestEfforts);
                mainContent.append(table);
                var setupDataTable = function () {
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

                var createWorkoutTypeChart = function (id, items) {
                    if (items.length > 1) {
                        var workoutTypes = {}; // Holds Workout Type and its count.
                        items.forEach(function(bestEffort) {
                            var workoutType = bestEffort["workout_type_name"];

                            // No workout type is a normal run.
                            if (workoutType == null) {
                                workoutType = 0;
                            }

                            if (workoutType in workoutTypes) {
                                workoutTypes[workoutType] += 1;
                            } else {
                                workoutTypes[workoutType] = 1;
                            }
                        });

                        var ctx = $("#" + id).get(0).getContext("2d");
                        ctx.canvas.height = 300;

                        var data = {
                            labels: [
                                "Run",
                                "Race",
                                "Long Run",
                                "Workout"
                            ],
                            datasets: [{
                                data: [workoutTypes['run'], workoutTypes['race'], workoutTypes['long run'], workoutTypes['workout']],
                                backgroundColor: [
                                    "rgba(189, 214, 186, 0.7)",
                                    "rgba(245, 105, 84, 0.7)",
                                    "rgba(0, 166, 90, 0.7)",
                                    "rgba(243, 156, 18, 0.7)"
                                ],
                                hoverBackgroundColor: [
                                    "rgba(189, 214, 186, 1)",
                                    "rgba(245, 105, 84, 1)",
                                    "rgba(0, 166, 90, 1)",
                                    "rgba(243, 156, 18, 1)"
                                ]
                            }]
                        };

                        var chart = new Chart(ctx, {
                            type: 'pie',
                            data: data,
                            options: {
                                legend: {
                                    position: 'bottom',
                                    onClick: function(e) {
                                        e.stopPropagation();
                                    }
                                },
                                maintainAspectRatio: false,
                                responsive: true
                            }
                        });
                    } else {
                        createNoEnoughDataMessage(id);
                    }
                };
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
