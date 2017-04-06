function createChartMessage(id, message) {
    if (message === undefined) {
        message = "Not Enough Data to Generate Chart";
    }

    var loadingIcon = "<div class='text-center'>";
    loadingIcon += "<h4>";
    loadingIcon += message;
    loadingIcon += "</h4>";
    loadingIcon += "</div>";

    var container = $("#" + id).parent();
    container.empty();
    container.append(loadingIcon);
}

function constructChartHtml(id, title, width, withLoadingIcon) {
    var chart = '<div class="col-md-' + width + '">';
    chart += '<div class="box">';
    chart += '<div class="box-header with-border>';
    chart += '<i class="fa fa-pie-chart"></i><h3 class="box-title">' + title + '</h3>';
    chart += '<div class="box-body">';
    if (withLoadingIcon) {
        chart += constructLoadingIconHtml();
    } else {
        chart += '<div class="chart">';
        chart += '<canvas id="' + id + '"></canvas>';
        chart += '</div>';
    }
    chart += '</div></div></div></div>';
    return chart;
}

function constructNoDataInfoBox() {
    var infoBox = '<div class="notification-alert">';
    infoBox += '<div class="modal">';
    infoBox += '<div class="modal-dialog">';
    infoBox += '<div class="modal-content">';
    infoBox += '<div class="modal-header"><h4 class="modal-title">Nothing Yet!</h4></div>';
    infoBox += '<div class="modal-body">';
    infoBox += "<p>If you have just connected Strafforts with your Strava account, " +
        "please be patient while your data is being processed. " +
        "For newly connected athletes, our background worker process runs <b>every minute</b> to fetch the data.</p>";
    infoBox += '</div></div></div></div></div>';
    return infoBox;
}

function createBarChart(id, counts, dataLabels, legendLabels) {

    var colors = getRgbColors();
    var data = {
        yLabels: counts,
        labels: (typeof legendLabels != 'undefined') ? legendLabels.reverse() : dataLabels.reverse(),
        datasets: [{
            data: counts.reverse(),
            label: dataLabels.reverse(),
            backgroundColor: convertToRgbaColors(colors, 0.6),
            hoverBackgroundColor: convertToRgbaColors(colors, 1)
        }]
    };

    var ctx = $("#" + id).get(0).getContext("2d");
    ctx.canvas.height = 300;

    var chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
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
                        return 'Count: ' + tooltipItem.yLabel.toString();
                    }
                }
            }
        }
    });
}

function createPieChart(id, counts, dataLabels, legendLabels) {
    var colors = getRgbColors();
    var data = {
        labels: (typeof legendLabels != 'undefined') ? legendLabels : dataLabels,
        datasets: [{
            data: counts,
            label: dataLabels,
            backgroundColor: convertToRgbaColors(colors, 0.6),
            hoverBackgroundColor: convertToRgbaColors(colors, 1)
        }]
    };

    var ctx = $("#" + id).get(0).getContext("2d");
    ctx.canvas.height = 300;

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
            maintainAspectRatio: false,
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    title: function(tooltipItem, data) {
                        return data.datasets[0].label[tooltipItem[0].index];
                    },
                    label: function(tooltipItem, data) {
                        return "Count: " + data.datasets[0].data[tooltipItem.index];
                    }
                }
            }
        }
    });
}

function createProgressionChart(id, items) {
    if (items.length > 1) {
        var activityNames = [];
        var dates = [];
        var runTimes = [];

        items.forEach(function(item) {
            var activityName = item["activity_name"];
            var date = item["start_date"];
            var runTime = item['elapsed_time'];
            activityNames.push(activityName);
            dates.push(date);
            runTimes.push(runTime);
        });

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

        var ctx = $("#" + id).get(0).getContext("2d");
        ctx.canvas.height = 300;

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
        createChartMessage(id);
    }
}

function createYearDistributionChart(id, items) {
    if (items.length > 1) {
        var years = {}; // Holds year and its count.
        items.forEach(function(item) {
            var startDate = item['start_date'];
            var dateParts = startDate.split("-");
            var year = new Date(dateParts[0], dateParts[1], dateParts[2]).getFullYear();
            if (year in years) {
                years[year] += 1;
            } else {
                years[year] = 1;
            }
        });

        var dataLabels = Object.keys(years);
        var legendLabels = [];
        var counts = [];
        $.each(years, function(key) {
            var value = years[key];
            counts.push(value);
            legendLabels.push(key + " (" + value + ")");
        });
        createPieChart(id, counts, dataLabels, legendLabels);
    } else {
        createChartMessage(id);
    }
}

function createWorkoutTypeChart(id, items) {
    if (items.length > 1) {
        var workoutTypes = {}; // Holds Workout Type and its count.
        items.forEach(function(bestEffort) {
            var workoutType = bestEffort["workout_type_name"];

            // No workout type is a normal run.
            if (workoutType === null) {
                workoutType = 0;
            }

            if (workoutType in workoutTypes) {
                workoutTypes[workoutType] += 1;
            } else {
                workoutTypes[workoutType] = 1;
            }
        });

        var dataLabels = ["Run", "Race", "Long Run", "Workout"];
        var counts = [workoutTypes['run'], workoutTypes['race'], workoutTypes['long run'], workoutTypes['workout']];
        createPieChart(id, counts, dataLabels);
    } else {
        createChartMessage(id);
    }
}

function createMonthDistributionChart(id, items) {
    if (items.length > 1) {
        var months = {}; // Holds month and its count.
        items.forEach(function(item) {
            var startDate = item['start_date'];
            var dateParts = startDate.split("-");
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var month = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]).getMonth();
            var monthName = monthNames[month];
            if (monthName in months) {
                months[monthName] += 1;
            } else {
                months[monthName] = 1;
            }
        });

        var dataLabels = [];
        var legendLabels = [];
        var counts = [];
        $.each(months, function(key) {
            var value = parseInt(months[key], 10);
            legendLabels.push(key + ' (' + value + ')');
            counts.push(value);
            dataLabels.push(key);
        });
        createBarChart(id, counts, dataLabels, legendLabels);
    } else {
        createChartMessage(id);
    }
}

function createRaceDistancesChart(id, items) {
    if (items.length > 1) {
        var raceDistances = {}; // Holds race distance and its count.
        items.forEach(function(item) {
            var raceDistance = item['race_distance'];
            if (raceDistance in raceDistances) {
                raceDistances[raceDistance] += 1;
            } else {
                raceDistances[raceDistance] = 1;
            }
        });

        var dataLabels = [];
        var legendLabels = [];
        var counts = [];
        $.each(raceDistances, function(key) {
            var value = parseInt(raceDistances[key], 10);
            legendLabels.push(key + ' (' + value + ')');
            counts.push(value);
            dataLabels.push(key);
        });

        createBarChart(id, counts, dataLabels, legendLabels);
    } else {
        createChartMessage(id);
    }
}

function createGearCountChart(id, items) {
    if (items.length > 1) {
        var gears = {}; // Holds Gear and its count.
        items.forEach(function(item) {
            var gearName = item['gear_name'];
            if (gearName in gears) {
                gears[gearName] += 1;
            } else {
                gears[gearName] = 1;
            }
        });

        var dataLabels = Object.keys(gears);
        var counts = [];
        $.each(gears, function(key) {
            var value = gears[key];
            counts.push(value);
        });

        createPieChart(id, counts, dataLabels);
    } else {
        createChartMessage(id);
    }
}

function createGearMileageChart(id, items) {
    if (items.length > 1) {
        var gears = {}; // Holds Gear and its count.
        items.forEach(function(item) {
            var gearName = item['gear_name'];
            if (gearName in gears) {
                gears[gearName] += item['distance'];
            } else {
                gears[gearName] = item['distance'];
            }
        });

        var gearLabels = Object.keys(gears);
        var gearMileages = [];
        $.each(gears, function(key) {
            var mileage = gears[key] / 1000;
            gearMileages.push(mileage);
        });

        var colors = getRgbColors();
        var data = {
            labels: gearLabels,
            datasets: [{
                data: gearMileages,
                backgroundColor: convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: convertToRgbaColors(colors, 1)
            }]
        };

        var ctx = $("#" + id).get(0).getContext("2d");
        ctx.canvas.height = 300;

        var chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: data,
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                responsive: true,
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        title: function(tooltipItem, data) {
                            return tooltipItem[0].yLabel + ' - ' + tooltipItem[0].xLabel.toFixed(1) + "km";
                        },
                        label: function() {
                            return '';
                        }
                    }
                }
            }
        });
    } else {
        createChartMessage(id);
    }
}
