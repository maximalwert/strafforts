/// <reference path="./../../typings/chart.js.d.ts" />

namespace ChartHelpers {

    function createChart(
        id: string,
        chartType: string,
        chartData: Chart.ChartData,
        chartOptions: Chart.ChartOptions) {

        const canvasElement = $('#' + id).get(0) as HTMLCanvasElement;
        const context = canvasElement.getContext('2d');
        const chart = new Chart(context, {
            type: chartType,
            data: chartData,
            options: chartOptions,
        });
    }

    function createBarChart(
        id: string,
        counts: number[],
        dataLabels: string[],
        legendLabels: string[],
        customChartOptions?: Chart.ChartOptions) {

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
        const defaultChartOptions = {
            legend: {
                display: false,
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                type: 'linear',
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                    },
                }],
                yAxes: [{
                    ticks: {
                        autoSkip: false,
                        beginAtZero: true,
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
                        return `Count: ${tooltipItem.yLabel.toString()}`;
                    },
                },
            },
        };

        const chartOptions = customChartOptions ? { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        createChart(id, 'bar', chartData, chartOptions);
    }

    function createBubbleChart(
        id: string,
        chartData: Chart.ChartData,
        customChartOptions?: Chart.ChartOptions) {

        const defaultChartOptions = {
            legend: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
        };

        const chartOptions = customChartOptions ? { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        createChart(id, 'bubble', chartData, chartOptions);
    }

    function createHorizontalBarChart(
        id: string,
        chartData: Chart.ChartData,
        customChartOptions?: Chart.ChartOptions) {

        const defaultChartOptions = {
            legend: {
                display: false,
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        beginAtZero: true,
                    },
                }],
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: (tooltipItem: Chart.ChartTooltipItem) => {
                        return `Count: ${tooltipItem.xLabel.toString()}`;
                    },
                },
            },
        };

        const chartOptions = customChartOptions ? { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        createChart(id, 'horizontalBar', chartData, chartOptions);
    }

    function createPieChart(
        id: string,
        counts: number[],
        dataLabels: string[],
        legendLabels?: string[],
        customChartOptions?: Chart.ChartOptions) {

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
        const defaultChartOptions = {
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
        };

        const chartOptions = customChartOptions ? { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        createChart(id, 'pie', chartData, chartOptions);
    }

    function createLineChart(
        id: string,
        chartData: Chart.ChartData,
        customChartOptions?: Chart.ChartOptions) {

        const defaultChartOptions = {
            legend: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: false,
            },
        };

        const chartOptions = customChartOptions ? { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        createChart(id, 'line', chartData, chartOptions);
    }

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
        const content = withLoadingIcon ? HtmlHelpers.getLoadingIcon() : `<canvas id="${id}" height="300"></canvas>`;
        const chart = `
            <div class="col-md-${width}">
                <div class="box">
                    <div class="box-header with-border>
                        <i class="fa fa-pie-chart"></i>
                        <h3 class="box-title">${title}</h3>
                    </div>
                    <div class="box-body">
                        <div class="chart">
                            ${content}
                        </div>
                    </div>
                </div>
            </div>
        `;
        return chart;
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

            const chartData: Chart.ChartData = {
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
            const customChartOptions: Chart.ChartOptions = {
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                        },
                        type: 'time',
                        ticks: {
                            autoSkip: true,
                        },
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
            };

            createLineChart(id, chartData, customChartOptions);
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

            const counts: number[] = [];
            const dataLabels: string[] = Object.keys(years);
            const legendLabels: string[] = [];
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
            items.forEach((item) => {
                let workoutType = item['workout_type_name'];

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

            const counts: number[] = [];
            const dataLabels: string[] = [];
            const legendLabels: string[] = [];
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

            const counts: number[] = [];
            const dataLabels: string[] = [];
            const legendLabels: string[] = [];
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

            const gears: object = {}; // Holds Gear and its mileage.
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

            const customChartOptions: Chart.ChartOptions = {
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
            };

            const colors = Helpers.getRgbColors();
            const chartData = {
                labels: gearLabels,
                datasets: [{
                    data: gearMileages,
                    backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                    hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1),
                }],
            };
            createHorizontalBarChart(id, chartData, customChartOptions);
        } else {
            createChartMessage(id);
        }
    }

    export function createHeartRatesChart(id: string, items: any[]) {
        if (items.length > 1) {

            const maxColors = 4;
            const boundaryOffset = 5;
            const radius = 10;

            const activityNames: string[] = [];
            const averageHeartRates: number[] = [];
            const bubbleColors: RgbColor[] = [];
            const dates: string[] = [];
            const maxHeartRates: number[] = [];
            const points: object[] = [];

            items.forEach((item) => {
                const averageHeartRate = item['average_heartrate'];
                const maxHeartRate = item['max_heartrate'];

                if (averageHeartRate > 0 && maxHeartRate > 0) {
                    const activityName = item['activity_name'];
                    const date = item['start_date'];
                    activityNames.push(activityName);
                    dates.push(date);

                    const point = {
                        x: averageHeartRate,
                        y: maxHeartRate,
                        r: radius,
                    };
                    averageHeartRates.push(averageHeartRate);
                    maxHeartRates.push(maxHeartRate);
                    points.push(point);

                    const bubbleColor = Helpers.getRgbColorBasedOnHrZone(item['average_hr_zone']);
                    bubbleColors.push(bubbleColor);
                }
            });

            const chartData = {
                datasets: [{
                    data: points,
                    label: activityNames,
                    backgroundColor: Helpers.convertToRgbaColors(bubbleColors, 0.6),
                    hoverBackgroundColor: Helpers.convertToRgbaColors(bubbleColors, 1),
                }],
            };

            const xAxesLinearTickOptions: Chart.LinearTickOptions = {
                 min: Math.min(...averageHeartRates) - boundaryOffset,
                 max: Math.max(...averageHeartRates) + boundaryOffset,
            };
            const yAxesLinearTickOptions: Chart.LinearTickOptions = {
                min: Math.min(...maxHeartRates) - boundaryOffset,
                max: Math.max(...maxHeartRates) + boundaryOffset,
            };
            const customChartOptions: Chart.ChartOptions = {
                scales: {
                    type: 'linear',
                    xAxes: [{
                        ticks: xAxesLinearTickOptions,
                        scaleLabel: {
                            display: true,
                            labelString: 'Average Heart Rate',
                        },
                    }],
                    yAxes: [{
                        ticks: yAxesLinearTickOptions,
                        scaleLabel: {
                            display: true,
                            labelString: 'Max Heart Rate',
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
                            const averageHeartRate = tooltipItem.xLabel.toString();
                            const maxHeartRate = tooltipItem.yLabel.toString();
                            return `Avg. HR: ${averageHeartRate} - Max. HR: ${maxHeartRate}`;
                        },
                    },
                },
            };
            createBubbleChart(id, chartData, customChartOptions);
        } else {
            createChartMessage(id);
        }
    }

    export function createAverageHrZonesChart(id: string, items: any[]) {
        if (items.length > 1) {

            const averageHrZoneNames: string[] = [
                'Zone 1',
                'Zone 2',
                'Zone 3',
                'Zone 4',
                'Zone 5',
                'Zone N/A',
            ];
            const averageHrZones: object = {
                'Zone 1': 0,
                'Zone 2': 0,
                'Zone 3': 0,
                'Zone 4': 0,
                'Zone 5': 0,
                'Zone N/A': 0,
            };
            const barColors: RgbColor[] = [
                Helpers.getRgbColorBasedOnHrZone('1'),
                Helpers.getRgbColorBasedOnHrZone('2'),
                Helpers.getRgbColorBasedOnHrZone('3'),
                Helpers.getRgbColorBasedOnHrZone('4'),
                Helpers.getRgbColorBasedOnHrZone('5'),
                Helpers.getRgbColorBasedOnHrZone('na'),
            ];

            // Get counts of each zone.
            const counts: number[] = [];
            items.forEach((item) => {
                switch (item['average_hr_zone']) {
                    case '1':
                        averageHrZones['Zone 1'] += 1;
                        break;
                    case '2':
                        averageHrZones['Zone 2'] += 1;
                        break;
                    case '3':
                        averageHrZones['Zone 3'] += 1;
                        break;
                    case '4':
                        averageHrZones['Zone 4'] += 1;
                        break;
                    case '5':
                        averageHrZones['Zone 5'] += 1;
                        break;
                    default:
                        averageHrZones['Zone N/A'] += 1;
                        break;
                }
            });
            $.each(averageHrZones, (name) => {
                const value = averageHrZones[name];
                counts.push(value);
            });

            const chartData = {
                labels: averageHrZoneNames,
                datasets: [{
                    data: counts,
                    backgroundColor: Helpers.convertToRgbaColors(barColors, 0.6),
                    hoverBackgroundColor: Helpers.convertToRgbaColors(barColors, 1),
                }],
            };
            createHorizontalBarChart(id, chartData);
        } else {
            createChartMessage(id);
        }
    }
}
