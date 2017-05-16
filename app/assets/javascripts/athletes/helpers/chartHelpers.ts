/// <reference path="./../../typings/chart.js.d.ts" />

namespace ChartHelpers {
    export function createChartMessage(id: string, message?: string) {
        if (message) {
            message = 'Not Enough Data to Generate Chart';
        }

        let content = `
            <div class='text-center'>
                <h4>${message}</h4>
            </div>
        `;

        let container = $('#' + id).parent();
        container.empty();
        container.append(content);
    }

    export function constructChartHtml(id: string, title: string, width: number, withLoadingIcon: boolean) {
        let loadingIcon = '';
        if (withLoadingIcon) {
            loadingIcon= HtmlHelpers.getLoadingIcon();
        }

        let chart = `
            <div class="col-md-${width}">
                <div class="box">
                    <div class="box-header with-border>
                        <i class="fa fa-pie-chart"></i>
                        <h3 class="box-title">${title}</h3>
                        <div class="box-body">
                            <div class="chart">
                                <canvas id="${id}"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return chart;
    }

    export function createBarChart(id: string, counts: number[], dataLabels: string[], legendLabels: string[]) {

        let colors = Helpers.getRgbColors();
        let data = {
            yLabels: counts,
            labels: legendLabels.reverse(),
            datasets: [{
                data: counts.reverse(),
                label: dataLabels.reverse(),
                backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1)
            }]
        };

        let canvasElement = <HTMLCanvasElement>$('#' + id).get(0);
        let ctx = canvasElement.getContext('2d');
        ctx.canvas.height = 300;

        let linearOptions: Chart.LinearTickOptions = { beginAtZero: true };
        let chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    type: 'linear',
                    yAxes: [{
                        ticks: linearOptions
                    }]
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        title: (tooltipItem, data) => {
                            return data.datasets[0].label[tooltipItem[0].index];
                        },
                        label: (tooltipItem) => {
                            return `Count: ${tooltipItem.yLabel.toString()}`;
                        }
                    }
                }
            }
        });
    }

    export function createPieChart(id: string, counts: number[], dataLabels: string[], legendLabels?: string[]) {
        let colors = Helpers.getRgbColors();
        let data = {
            labels: (legendLabels) ? legendLabels : dataLabels,
            datasets: [{
                data: counts,
                label: dataLabels,
                backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1)
            }]
        };

        let canvasElement = <HTMLCanvasElement>$('#' + id).get(0);
        let ctx = canvasElement.getContext('2d');
        ctx.canvas.height = 300;

        let chart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    position: 'bottom',
                    onClick: (event) => {
                        event.stopPropagation();
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        title: (tooltipItem, data) => {
                            return data.datasets[0].label[tooltipItem[0].index];
                        },
                        label: (tooltipItem, data) => {
                            return `Count: ${data.datasets[0].data[tooltipItem.index]}`;
                        }
                    }
                }
            }
        });
    }

    export function createProgressionChart(id: string, items: any[]) {
        if (items.length > 1) {
            let activityNames = [];
            let dates = [];
            let runTimes = [];

            items.forEach((item) => {
                let activityName = item['activity_name'];
                let date = item['start_date'];
                let runTime = item['elapsed_time'];
                activityNames.push(activityName);
                dates.push(date);
                runTimes.push(runTime);
            });

            let data = {
                yLabels: runTimes,
                labels: dates,
                datasets: [{
                    label: activityNames,
                    fill: false,
                    lineTension: 0,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: '#FC4C02',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#FC4C02',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#FC4C02',
                    pointHoverBorderColor: '#E34402',
                    pointHoverBorderWidth: 2,
                    pointRadius: 4,
                    pointHitRadius: 10,
                    pointStyle: 'circle',
                    data: runTimes,
                    spanGaps: false
                }]
            };

            let canvasElement = <HTMLCanvasElement>$('#' + id).get(0);
            let ctx = canvasElement.getContext('2d');
            ctx.canvas.height = 300;

            let myLineChart = new Chart(ctx, {
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
                                callback: (value) => {
                                    return value.toString().toHHMMSS();
                                }
                            }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            title: (tooltipItem, data) => {
                                return data.datasets[0].label[tooltipItem[0].index];
                            },
                            label: (tooltipItem) => {
                                let time = Helpers.convertDurationToTime(tooltipItem.yLabel.toString());
                                let date = tooltipItem.xLabel;
                                return `Ran ${time} on ${date}`;
                            }
                        }
                    }
                }
            });
        } else {
            createChartMessage(id);
        }
    }

    export function createYearDistributionChart(id: string, items: any[]) {
        if (items.length > 1) {
            let years = {}; // Holds year and its count.
            items.forEach(function (item) {
                let startDate = item['start_date'];
                let dateParts = startDate.split('-');
                let year = new Date(dateParts[0], dateParts[1], dateParts[2]).getFullYear();
                if (year in years) {
                    years[year] += 1;
                } else {
                    years[year] = 1;
                }
            });

            let dataLabels = Object.keys(years);
            let legendLabels = [];
            let counts = [];
            $.each(years, (key) => {
                let value = years[key];
                counts.push(value);
                legendLabels.push(`${key} (${value})`);
            });
            createPieChart(id, counts, dataLabels, legendLabels);
        } else {
            createChartMessage(id);
        }
    }

    export function createWorkoutTypeChart(id: string, items: any[]) {
        if (items.length > 1) {
            let workoutTypes = {}; // Holds Workout Type and its count.
            items.forEach(function (bestEffort) {
                let workoutType = bestEffort['workout_type_name'];

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

            let dataLabels = ['Run', 'Race', 'Long Run', 'Workout'];
            let counts = [workoutTypes['run'], workoutTypes['race'], workoutTypes['long run'], workoutTypes['workout']];
            createPieChart(id, counts, dataLabels);
        } else {
            createChartMessage(id);
        }
    }

    export function createMonthDistributionChart(id: string, items: any[]) {
        if (items.length > 1) {
            let months = {}; // Holds month and its count.
            items.forEach((item) => {
                let startDate = item['start_date'];
                let dateParts = startDate.split('-');
                let monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                let month = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]).getMonth();
                let monthName = monthNames[month];
                if (monthName in months) {
                    months[monthName] += 1;
                } else {
                    months[monthName] = 1;
                }
            });

            let dataLabels = [];
            let legendLabels = [];
            let counts = [];
            $.each(months, (key) => {
                let value = parseInt(months[key], 10);
                legendLabels.push(`${key} (${value})`);
                counts.push(value);
                dataLabels.push(key);
            });
            createBarChart(id, counts, dataLabels, legendLabels);
        } else {
            createChartMessage(id);
        }
    }

    export function createRaceDistancesChart(id: string, items: any[]) {
        if (items.length > 1) {
            let raceDistances = {}; // Holds race distance and its count.
            items.forEach(function (item) {
                let raceDistance = item['race_distance'];
                if (raceDistance in raceDistances) {
                    raceDistances[raceDistance] += 1;
                } else {
                    raceDistances[raceDistance] = 1;
                }
            });

            let dataLabels = [];
            let legendLabels = [];
            let counts = [];
            $.each(raceDistances, (key) => {
                let value = parseInt(raceDistances[key], 10);
                legendLabels.push(`${key} (${value})`);
                counts.push(value);
                dataLabels.push(key);
            });

            createBarChart(id, counts, dataLabels, legendLabels);
        } else {
            createChartMessage(id);
        }
    }

    export function createGearCountChart(id: string, items: any[]) {
        if (items.length > 1) {
            let gears = {}; // Holds Gear and its count.
            items.forEach((item) => {
                let gearName = item['gear_name'];
                if (gearName in gears) {
                    gears[gearName] += 1;
                } else {
                    gears[gearName] = 1;
                }
            });

            let dataLabels = Object.keys(gears);
            let counts = [];
            $.each(gears, (key) => {
                let value = gears[key];
                counts.push(value);
            });

            createPieChart(id, counts, dataLabels);
        } else {
            createChartMessage(id);
        }
    }

    export function createGearMileageChart(id: string, items: any[]) {
        if (items.length > 1) {
            let gears = {}; // Holds Gear and its count.
            items.forEach((item) => {
                let gearName = item['gear_name'];
                if (gearName in gears) {
                    gears[gearName] += item['distance'];
                } else {
                    gears[gearName] = item['distance'];
                }
            });

            let gearLabels = Object.keys(gears);
            let gearMileages = [];
            $.each(gears, (key) => {
                let mileage = gears[key] / 1000;
                gearMileages.push(mileage);
            });

            let colors = Helpers.getRgbColors();
            let data = {
                labels: gearLabels,
                datasets: [{
                    data: gearMileages,
                    backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                    hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1)
                }]
            };

            let canvasElement = <HTMLCanvasElement>$('#' + id).get(0);
            let ctx = canvasElement.getContext('2d');
            ctx.canvas.height = 300;

            let linearOptions: Chart.LinearTickOptions = { beginAtZero: true };
            let chart = new Chart(ctx, {
                type: 'horizontalBar',
                data: data,
                options: {
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        xAxes: [{
                            ticks: linearOptions
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: (tooltipItem, data) => {
                                let mileage = tooltipItem.xLabel.toString().substring(0, 1);
                                return `Mileage: ${mileage}km`;
                            }
                        }
                    }
                }
            });
        } else {
            createChartMessage(id);
        }
    }
}
