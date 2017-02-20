function loadRacesView(distanceText) {
    var constructProgressionChartHtml = function (withLoadingIcon) {
        var chart = "<div class='row'><div class='col-xs-12'>";
        chart += "<div class='box'>";
        chart += "<div class='box-header with-border>";
        chart += "<i class='fa fa-bar-chart-o'></i><h3 class='box-title'>Progression Chart</h3>";
        chart += "<div class='box-body'>";
        if (withLoadingIcon) {
            chart += constructLoadingIconHtml();
        } else {
            chart += "<div class='chart'>";
            chart += "<canvas id='progression-chart'></canvas>";
            chart += "</div>";
        }
        chart += "</div></div></div></div>";
        return chart;
    };
    var constructDataTableHtml = function (races) {
        var table = "<div class='row'>";
        table += "<div class='col-xs-12'>";
        table += "<div class='box'>";
        table += "<div class='box-header with-border>";
        table += "<i class='fa fa-bar-chart-o'></i><h3 class='box-title'>Data Table</h3>";
        table += "<div class='box-body'>";

        if (races === undefined) {
            table += constructLoadingIconHtml();
        } else {
            table += "<table class='dataTable table table-bordered table-striped'>";
            table += "<thead><tr>";
            table += "<th class='col-md-1'>Date</th>";
            table += "<th class='col-md-4'>Activity</th>";
            table += "<th class='col-md-1'>Time</th>";
            table += "<th class='col-md-2'>Shoes</th>";
            table += "<th class='col-md-1'>Elevation</th>";
            table += "<th class='col-md-1'>Cadence</th>";
            table += "<th class='col-md-1 text-center badge-cell'>Avg. HR</th>";
            table += "<th class='col-md-1 text-center badge-cell'>Max HR</th>";
            table += "</tr></thead>";
            table += "<tbody>";

            races.forEach(function(item) {
                table += "<tr>";
                table += "<td>" + item["start_date"] + "</td>";
                table += "<td>";
                table += "<a class='strava-logo-link' href='https://www.strava.com/activities/" + item['activity_id'] +
                    "' target='_blank'><span></span></a>";
                table += "<a href='https://www.strava.com/activities/" + item['activity_id'] +
                    "' target='_blank'>" + item['activity_name'] + "</a>";
                table += "</td>";
                table += "<td>" + item['elapsed_time_formatted'] + "</td>";
                table += "<td>" + item['gear_name'] + "</td>";
                table += "<td>" + item['elevation'] + "</td>";
                table += "<td>" + item['cadence'] + "</td>";
                table += "<td class='text-center badge-cell'>";
                table += "<span class='badge " + item['average_hr_zone_class'] + "'>" + item['average_heartrate'] + "</span>";
                table += "</td>";
                table += "<td class='text-center badge-cell'>";
                table += "<span class='badge " + item['max_hr_zone_class'] + "'>" + item['max_heartrate'] + "</span>";
                table += "</td>";
                table += "</tr>";
            });
            table += "</tbody>";
            table += "</table>";
        }
        table += "</div></div></div></div></div>";
        return table;
    };
    var constructPieChartsHtml = function (withLoadingIcon) {
        var chart = "<div class='row'>";
        chart += "<div class='col-md-6'>";
        chart += "<div class='box'>";
        chart += "<div class='box-header with-border>";
        chart += "<i class='fa fa-bar-chart-o'></i><h3 class='box-title'>Gear Chart</h3>";
        chart += "<div class='box-body'>";
        if (withLoadingIcon) {
            chart += constructLoadingIconHtml();
        } else {
            chart += "<div class='chart'>";
            chart += "<canvas id='gear-chart'></canvas>";
            chart += "</div>";
        }
        chart += "</div></div></div></div></div>";
        return chart;
    };
    var prepareView = function()
    {
        setContentHeader("Races - " + distanceText);
        setPageTitle('Strafforts - A Visualizer for Strava Estimated Best Efforts and Races |  Races  - '+ distanceText);

        resetNavigationItems();
        var navigationAnchor = $("a[id^='races-for-" + distanceText.toLowerCase().replace(/ /g, '-').replace(/\//g, '-') + "']");
        setNavigationItem(navigationAnchor);

        var mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create empty progression chart with loading icon.
        var showLoadingIcon = true;
        var progressionChart = constructProgressionChartHtml(showLoadingIcon);
        mainContent.append(progressionChart);

        // Create empty data table with loading icon.
        var table = constructDataTableHtml();
        mainContent.append(table);

        // Create empty pie charts with loading icon.
        var pieCharts = constructPieChartsHtml(showLoadingIcon);
        mainContent.append(pieCharts);
    };
    var createView = function () {
        // Set the global configs to synchronous.
        $.ajaxSetup({
            async: false
        });

        var distance = distanceText.trim().replace(/\//g, '|');
        $.getJSON(window.location.pathname + '/races/' + distance).then(function(data) {
            var races = [];
            $.each(data, function(key, value) {
                races.push(value);
            });

            var mainContent = $('#main-content');
            mainContent.empty();

            // Create progression chart.
            var progressionChart = constructProgressionChartHtml(false);
            var createProgressionChart = function (races) {
                var activityNames = [];
                var dates = [];
                var runTimes = [];

                races.forEach(function(race) {
                    var activityName = race["activity_name"];
                    var date = race["start_date"];
                    var runTime = race['elapsed_time'];
                    activityNames.push(activityName);
                    dates.push(date);
                    runTimes.push(runTime);
                });

                var ctx = $("#progression-chart").get(0).getContext("2d");
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
                                label: function(tooltipItem, data) {
                                    var text = "Ran " + tooltipItem.yLabel.toString().toHHMMSS();
                                    text += " on " + tooltipItem.xLabel;
                                    return text;
                                }
                            }
                        }
                    }
                });
            };
            mainContent.append(progressionChart);
            createProgressionChart(races);

            // Create data table.
            var table = constructDataTableHtml(races);
            mainContent.append(table);
            var setupDataTable = function () {
                $(".dataTable").each(function() {
                    $(this).DataTable({
                        "columnDefs": [{
                            "targets": [2, 3, 4, 5, 6], // Disable searching for WorkoutType, Time, Elevation, Cadence and HRs.
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

            // Create pie charts.
            var pieCharts = constructPieChartsHtml(false);
            var createGearChart = function (races) {
                var gears = {}; // Holds Workout Type and its count.
                races.forEach(function(race) {
                    var gearName = race['gear_name'];
                    if (gearName in gears) {
                        gears[gearName] += 1;
                    } else {
                        gears[gearName] = 1;
                    }
                });

                var ctx = $("#gear-chart").get(0).getContext("2d");
                ctx.canvas.height = 300;

                var gearLabels = Object.keys(gears);
                var gearCount = [];
                for (var key in gears) {
                    var value = gears[key];
                    gearCount.push(value);
                }
                var data = {
                    labels: gearLabels,
                    datasets: [{
                        data: gearCount,
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
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            };
            mainContent.append(pieCharts);
            createGearChart(races);
        });

        // Set JS back to asynchronous mode.
        $.ajaxSetup({
            async: true
        });
    };

    prepareView();
    createView();
}
