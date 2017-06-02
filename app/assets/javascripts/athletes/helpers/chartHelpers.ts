/// <reference path="./../../typings/chart.js.d.ts" />

namespace ChartHelpers {
    export function createChartMessage(id: string, message?: string) {
        if (!message) {
            message = 'Not Enough Data to Generate Chart';
        }

        const content = `
            <div class='text-center'>
                <h4>${message}</h4>
            </div>
        `;

        const container = $('#' + id).parent();
        container.empty();
        container.append(content);
    }

    export function constructChartHtml(id: string, title: string, width: number, withLoadingIcon: boolean = false) {
        let content = '';
        if (withLoadingIcon) {
            content = HtmlHelpers.getLoadingIcon();
        } else {
            content = `<canvas id="${id}" height="300"></canvas>`;
        }

        const chart = `
            <div class="col-md-${width}">
                <div class="box">
                    <div class="box-header with-border>
                        <i class="fa fa-pie-chart"></i>
                        <h3 class="box-title">${title}</h3>
                        <div class="box-body">
                            <div class="chart">
                                ${content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return chart;
    }

    export function createBarChart(id: string, counts: number[], dataLabels: string[], legendLabels: string[]) {

        const colors = Helpers.getRgbColors();
        const chartData = {
            yLabels: counts,
            labels: legendLabels.reverse(),
            datasets: [{
                data: counts.reverse(),
                label: dataLabels.reverse(),
                backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1),
            }],
        };

        const canvasElement = $('#' + id).get(0) as HTMLCanvasElement;
        const ctx = canvasElement.getContext('2d');

        const linearOptions: Chart.LinearTickOptions = { beginAtZero: true, stepSize: 1 };
        const chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                legend: {
                    display: false,
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    type: 'linear',
                    yAxes: [{
                        ticks: linearOptions,
                    }],
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        title: (tooltipItem: Chart.ChartTooltipItem[], data: any) => {
                            return data.datasets[0].label[tooltipItem[0].index];
                        },
                        label: (tooltipItem: Chart.ChartTooltipItem) => {
                            return `Count: ${tooltipItem.yLabel.toString()}`;
                        },
                    },
                },
            },
        });
    }

    export function createPieChart(id: string, counts: number[], dataLabels: string[], legendLabels?: string[]) {
        const colors = Helpers.getRgbColors();
        const chartData = {
            labels: (legendLabels) ? legendLabels : dataLabels,
            datasets: [{
                data: counts,
                label: dataLabels,
                backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1),
            }],
        };

        const canvasElement = $('#' + id).get(0) as HTMLCanvasElement;
        const ctx = canvasElement.getContext('2d');

        const chart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                legend: {
                    position: 'bottom',
                    onClick: (event: any) => {
                        event.stopPropagation();
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        title: (tooltipItem: Chart.ChartTooltipItem[], data: any) => {
                            return data.datasets[0].label[tooltipItem[0].index];
                        },
                        label: (tooltipItem: Chart.ChartTooltipItem, data: any) => {
                            return `Count: ${data.datasets[0].data[tooltipItem.index]}`;
                        },
                    },
                },
            },
        });
    }

    export function createProgressionChart(id: string, items: any[]) {
        if (items.length > 1) {
            const activityNames: string[] = [];
            const dates: string[] = [];
            const runTimes: number[] = [];

            items.forEach((item) => {
                const activityName = item.activity_name;
                const date = item.start_date;
                const runTime = item.elapsed_time;
                activityNames.push(activityName);
                dates.push(date);
                runTimes.push(runTime);
            });

            const chartData = {
                yLabels: runTimes,
                labels: dates,
                datasets: [{
                    label: activityNames,
                    fill: false,
                    lineTension: 0,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: '#FC4C02',
                    borderCapStyle: 'butt',
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
                    spanGaps: false,
                }],
            };

            const canvasElement = $('#' + id).get(0) as HTMLCanvasElement;
            const ctx = canvasElement.getContext('2d');

            const myLineChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    legend: {
                        display: false,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,
                            },
                            type: 'time',
                            time: {
                                unit: 'month',
                            },
                        }],
                        yAxes: [{
                            gridLines: {
                                display: true,
                                offsetGridLines: true,
                            },
                            ticks: {
                                callback: (value: any) => {
                                    return value.toString().toHHMMSS();
                                },
                            },
                        }],
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            title: (tooltipItem: Chart.ChartTooltipItem[], data: any) => {
                                return data.datasets[0].label[tooltipItem[0].index];
                            },
                            label: (tooltipItem: Chart.ChartTooltipItem) => {
                                const time = Helpers.convertDurationToTime(tooltipItem.yLabel.toString());
                                const date = tooltipItem.xLabel;
                                return `Ran ${time} on ${date}`;
                            },
                        },
                    },
                },
            });
        } else {
            createChartMessage(id);
        }
    }

    export function createYearDistributionChart(id: string, items: any[]) {
        if (items.length > 1) {
            const years: object = {}; // Holds year and its count.
            items.forEach((item) => {
                const startDate = item['start_date'];
                const dateParts = startDate.split('-');
                const year = new Date(dateParts[0], dateParts[1], dateParts[2]).getFullYear();
                if (year in years) {
                    years[year] += 1;
                } else {
                    years[year] = 1;
                }
            });

            const dataLabels: string[] = Object.keys(years);
            const legendLabels: string[] = [];
            const counts: number[] = [];
            $.each(years, (key) => {
                const value = years[key];
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
            const workoutTypes: any = {}; // Holds Workout Type and its count.
            items.forEach((bestEffort) => {
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

            const dataLabels = ['Run', 'Race', 'Long Run', 'Workout'];
            const counts = [workoutTypes.run, workoutTypes.race, workoutTypes['long run'], workoutTypes.workout];
            createPieChart(id, counts, dataLabels);
        } else {
            createChartMessage(id);
        }
    }

    export function createMonthDistributionChart(id: string, items: any[]) {
        if (items.length > 1) {
            const months: object = {}; // Holds month and its count.
            items.forEach((item) => {
                const startDate = item['start_date'];
                const dateParts = startDate.split('-');
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December',
                ];
                const month = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]).getMonth();
                const monthName = monthNames[month];
                if (monthName in months) {
                    months[monthName] += 1;
                } else {
                    months[monthName] = 1;
                }
            });

            const dataLabels: string[] = [];
            const legendLabels: string[] = [];
            const counts: number[] = [];
            $.each(months, (key) => {
                const value = parseInt(months[key], 10);
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
            const raceDistances: object = {}; // Holds race distance and its count.
            items.forEach((item) => {
                const raceDistance = item['race_distance'];
                if (raceDistance in raceDistances) {
                    raceDistances[raceDistance] += 1;
                } else {
                    raceDistances[raceDistance] = 1;
                }
            });

            const dataLabels: string[] = [];
            const legendLabels: string[] = [];
            const counts: number[] = [];
            $.each(raceDistances, (key) => {
                const value = parseInt(raceDistances[key], 10);
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
            const gears: object = {}; // Holds Gear and its count.
            items.forEach((item) => {
                const gearName = item['gear_name'];
                if (gearName in gears) {
                    gears[gearName] += 1;
                } else {
                    gears[gearName] = 1;
                }
            });

            const dataLabels = Object.keys(gears);
            const counts: number[] = [];
            $.each(gears, (key) => {
                const value = gears[key];
                counts.push(value);
            });

            createPieChart(id, counts, dataLabels);
        } else {
            createChartMessage(id);
        }
    }

    export function createGearMileageChart(id: string, items: any[]) {
        if (items.length > 1) {
            const gears: object = {}; // Holds Gear and its count.
            items.forEach((item) => {
                const gearName = item['gear_name'];
                if (gearName in gears) {
                    gears[gearName] += item['distance'];
                } else {
                    gears[gearName] = item['distance'];
                }
            });

            const gearLabels = Object.keys(gears);
            const gearMileages: number[] = [];
            $.each(gears, (key) => {
                const mileage = gears[key] / 1000;
                gearMileages.push(mileage);
            });

            const colors = Helpers.getRgbColors();
            const data = {
                labels: gearLabels,
                datasets: [{
                    data: gearMileages,
                    backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                    hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1),
                }],
            };

            const canvasElement = $('#' + id).get(0) as HTMLCanvasElement;
            const ctx = canvasElement.getContext('2d');

            const linearOptions: Chart.LinearTickOptions = { beginAtZero: true };
            const chart = new Chart(ctx, {
                type: 'horizontalBar',
                data,
                options: {
                    legend: {
                        display: false,
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        xAxes: [{
                            ticks: linearOptions,
                        }],
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: (tooltipItem: Chart.ChartTooltipItem) => {
                                const mileage = parseFloat(tooltipItem.xLabel).toFixed(1);
                                return `Mileage: ${mileage} km`;
                            },
                        },
                    },
                },
            });
        } else {
            createChartMessage(id);
        }
    }
}
