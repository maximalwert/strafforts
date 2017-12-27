import { Helpers } from '../../common/helpers';
import { RgbColor } from '../../common/rgbColor';
import { AppHelpers } from './appHelpers';

declare const Chart: any;

export class ChartCreator {

    private items: object[];

    constructor(items: object[]) {
        this.items = items;
    }

    public createChartWithMessage(id: string, message: string) {
        const content = `
                <div class='text-center'>
                    <h4>${message}</h4>
                </div>
            `;

        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = content;
        }
    }

    public createProgressionChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const activityIds: string[] = [];
        const activityNames: string[] = [];
        const dates: string[] = [];
        const runTimes: number[] = [];

        this.items.forEach((item) => {
            const activityId = item['activity_id'];
            const activityName = item['activity_name'];
            const date = item['start_date'];
            const runTime = item['elapsed_time'];
            activityIds.push(activityId);
            activityNames.push(activityName);
            dates.push(date);
            runTimes.push(runTime);
        });

        const chartData: Chart.ChartData = {
            yLabels: runTimes,
            labels: dates,
            datasets: [{
                label: activityNames,
                activityIds,
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
                        const index = tooltipItem[0].index;
                        if (typeof index !== 'undefined') {
                            return data.datasets[0].label[index];
                        }
                    },
                    label: (tooltipItem: Chart.ChartTooltipItem) => {
                        if (tooltipItem.yLabel) {
                            const time = Helpers.convertDurationToTime(tooltipItem.yLabel.toString());
                            const date = tooltipItem.xLabel;
                            return `Ran ${time} on ${date}`;
                        }
                    },
                },
            },
        };

        const chart = this.createLineChart(id, chartData, customChartOptions);
        this.createStravaActivityLink(chart, id);
    }

    public createYearDistributionChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const years: object = {}; // Holds year and its count.
        this.items.forEach((item) => {
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
        const dataLabels = Object.keys(years);
        const legendLabels: string[] = [];
        for (const key in years) {
            if (years.hasOwnProperty(key)) {
                const value = years[key];

                counts.push(value);
                legendLabels.push(`${key}: (${value})`);
            }
        }

        this.createPieChart(id, counts, dataLabels, legendLabels);
    }

    public createWorkoutTypeChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const workoutTypes: object = {}; // Holds Workout Type and its count.
        this.items.forEach((item) => {
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

        const colors: RgbColor[] = [];
        const counts: number[] = [];
        const dataLabels: string[] = [];
        const legendLabels: string[] = [];
        for (const key in workoutTypes) {
            if (workoutTypes.hasOwnProperty(key)) {
                const name = Helpers.convertToTitleCase(key);
                const value = workoutTypes[key];

                switch (name) {
                    case 'Race':
                        colors.push(new RgbColor(245, 105, 84));
                        break;
                    case 'Workout':
                        colors.push(new RgbColor(243, 156, 18));
                        break;
                    case 'Long Run':
                        colors.push(new RgbColor(0, 166, 90));
                        break;
                    default:
                        colors.push(new RgbColor(189, 214, 186));
                        break;
                }
                counts.push(value);
                dataLabels.push(name);
                legendLabels.push(`${name}: (${value})`);
            }
        }

        this.createPieChart(id, counts, dataLabels, legendLabels, colors);
    }

    public createMonthDistributionChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const months: object = {}; // Holds month and its count.
        this.items.forEach((item) => {
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
        const dataLabels = Object.keys(months);
        const legendLabels: string[] = [];
        for (const key in months) {
            if (months.hasOwnProperty(key)) {
                const value = parseInt(months[key], 10);

                counts.push(value);
                legendLabels.push(`${key}: (${value})`);
            }
        }

        this.createBarChart(id, counts, dataLabels, legendLabels);
    }

    public createRaceDistancesChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const raceDistances: object = {}; // Holds race distance and its count.
        this.items.forEach((item) => {
            const raceDistance = item['race_distance'];
            if (raceDistance in raceDistances) {
                raceDistances[raceDistance] += 1;
            } else {
                raceDistances[raceDistance] = 1;
            }
        });

        const counts: number[] = [];
        const dataLabels = Object.keys(raceDistances);
        const legendLabels: string[] = [];
        for (const key in raceDistances) {
            if (raceDistances.hasOwnProperty(key)) {
                const value = parseInt(raceDistances[key], 10);
                counts.push(value);

                if (key.toLowerCase() === 'other distances') {
                    // Hack to use 'Other' instead 'Other Distances' in distance bar charts.
                    legendLabels.push(`Other: (${value})`);
                } else {
                    legendLabels.push(`${key}: (${value})`);
                }
            }
        }

        this.createBarChart(id, counts, dataLabels, legendLabels);
    }

    public createGearCountChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const gears: object = {}; // Holds Gear and its count.
        this.items.forEach((item) => {
            const gearName = item['gear_name'];
            if (gearName in gears) {
                gears[gearName] += 1;
            } else {
                gears[gearName] = 1;
            }
        });

        const counts: number[] = [];
        const dataLabels = Object.keys(gears);
        const legendLabels: string[] = [];
        for (const key in gears) {
            if (gears.hasOwnProperty(key)) {
                const value = gears[key];

                counts.push(value);
                legendLabels.push(`${key}: (${value})`);
            }
        }

        this.createPieChart(id, counts, dataLabels, legendLabels);
    }

    public createGearMileageChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const gears: object = {}; // Holds Gear and its mileage.
        let distanceUnit: string;
        this.items.forEach((item) => {
            distanceUnit = item['distance_unit'];
            const distance = item['distance'];
            const gearName = item['gear_name'];
            if (gearName in gears) {
                gears[gearName] += distance;
            } else {
                gears[gearName] = distance;
            }
        });

        const gearLabels = Object.keys(gears);
        const gearMileages: number[] = [];
        for (const key in gears) {
            if (gears.hasOwnProperty(key)) {
                const mileage = gears[key];
                gearMileages.push(mileage);
            }
        }

        const customChartOptions: Chart.ChartOptions = {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: (tooltipItem: Chart.ChartTooltipItem) => {
                        if (tooltipItem.xLabel) {
                            const mileage = parseFloat(tooltipItem.xLabel).toFixed(1);
                            return `Mileage: ${mileage} ${distanceUnit}`;
                        }
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

        this.createHorizontalBarChart(id, chartData, customChartOptions);
    }

    public createHeartRatesChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const boundaryOffset = 5;
        const radius = 10;

        const activityIds: string[] = [];
        const activityNames: string[] = [];
        const averageHeartRates: number[] = [];
        const bubbleColors: RgbColor[] = [];
        const dates: string[] = [];
        const maxHeartRates: number[] = [];
        const points: object[] = [];

        this.items.forEach((item) => {
            const averageHeartRate = item['average_heartrate'];
            const maxHeartRate = item['max_heartrate'];

            if (averageHeartRate > 0 && maxHeartRate > 0) {
                const activityId = item['activity_id'];
                const activityName = item['activity_name'];
                const date = item['start_date'];
                activityIds.push(activityId);
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

        // Not enough items with HR data to generate chart.
        if (points.length < 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const chartData = {
            datasets: [{
                data: points,
                label: activityNames,
                activityIds,
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
                        const index = tooltipItem[0].index;
                        if (typeof index !== 'undefined') {
                            return data.datasets[0].label[index];
                        }
                    },
                    label: (tooltipItem: Chart.ChartTooltipItem) => {
                        if (tooltipItem.xLabel && tooltipItem.yLabel) {
                            const averageHeartRate = tooltipItem.xLabel.toString();
                            const maxHeartRate = tooltipItem.yLabel.toString();
                            return `Avg. HR: ${averageHeartRate} - Max. HR: ${maxHeartRate}`;
                        }
                    },
                },
            },
        };

        const chart = this.createBubbleChart(id, chartData, customChartOptions);
        this.createStravaActivityLink(chart, id);
    }

    public createAverageHrZonesChart(id: string) {
        if (this.items.length <= 1) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

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
        let totalNaCount: number = 0;
        this.items.forEach((item) => {
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
                    totalNaCount += 1;
                    break;
            }
        });

        const counts: number[] = [];
        const legendLabels: string[] = [];
        let totalCount: number = 0;
        for (const key in averageHrZones) {
            if (averageHrZones.hasOwnProperty(key)) {
                const value = averageHrZones[key];

                counts.push(value);
                legendLabels.push(`${key}: (${value})`);
                totalCount += value;
            }
        }

        // Not enough items with HR data to generate chart.
        if (totalCount === totalNaCount) {
            this.createChartWithNotEnoughDataMessage(id);
            return;
        }

        const chartData = {
            labels: legendLabels,
            datasets: [{
                data: counts,
                label: averageHrZoneNames,
                backgroundColor: Helpers.convertToRgbaColors(barColors, 0.6),
                hoverBackgroundColor: Helpers.convertToRgbaColors(barColors, 1),
            }],
        };
        const customChartOptions: Chart.ChartOptions = {
            tooltips: {
                callbacks: {
                    title: (tooltipItem: Chart.ChartTooltipItem[], data: any) => {
                        const index = tooltipItem[0].index;
                        if (typeof index !== 'undefined') {
                            return data.datasets[0].label[index];
                        }
                    },
                    label: (tooltipItem: Chart.ChartTooltipItem) => {
                        if (tooltipItem.xLabel) {
                            return `Count: ${tooltipItem.xLabel.toString()}`;
                        }
                    },
                },
            },
        };
        this.createHorizontalBarChart(id, chartData, customChartOptions);
    }

    private createChartWithNotEnoughDataMessage(id: string) {
        this.createChartWithMessage(id, 'Not Enough Data to Generate Chart');
    }

    private createChart(
        id: string,
        chartType: string,
        chartData: Chart.ChartData,
        chartOptions: Chart.ChartOptions) {

        let chart;
        const canvasElement = document.getElementById(id + '-canvas') as HTMLCanvasElement;
        const context = canvasElement.getContext('2d');
        if (context) {
            chart = new Chart(context, {
                type: chartType,
                data: chartData,
                options: chartOptions,
            });
        }
        return chart;
    }

    private createBarChart(
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
                        callback: (value: any) => {
                            if (value % 1 === 0) {
                                return value;
                            }
                        },
                    },
                }],
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    title: (tooltipItem: Chart.ChartTooltipItem[], data: any) => {
                        const index = tooltipItem[0].index;
                        if (typeof index !== 'undefined') {
                            return data.datasets[0].label[index];
                        }
                    },
                    label: (tooltipItem: Chart.ChartTooltipItem) => {
                        if (tooltipItem.yLabel) {
                            return `Count: ${tooltipItem.yLabel.toString()}`;
                        }
                    },
                },
            },
        };

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return this.createChart(id, 'bar', chartData, chartOptions);
    }

    private createBubbleChart(
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

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return this.createChart(id, 'bubble', chartData, chartOptions);
    }

    private createHorizontalBarChart(
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
                        callback: (value: any) => {
                            if (value % 1 === 0) {
                                return value;
                            }
                        },
                    },
                }],
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: (tooltipItem: Chart.ChartTooltipItem) => {
                        if (tooltipItem.xLabel) {
                            return `Count: ${tooltipItem.xLabel.toString()}`;
                        }
                    },
                },
            },
        };

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return this.createChart(id, 'horizontalBar', chartData, chartOptions);
    }

    private createLineChart(
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

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return this.createChart(id, 'line', chartData, chartOptions);
    }

    private createPieChart(
        id: string,
        counts: number[],
        dataLabels: string[],
        legendLabels?: string[],
        colors?: RgbColor[],
        customChartOptions?: Chart.ChartOptions) {

        colors = colors ? colors : Helpers.getRgbColors();
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
                        const index = tooltipItem[0].index;
                        if (typeof index !== 'undefined') {
                            return data.datasets[0].label[index];
                        }
                    },
                    label: (tooltipItem: Chart.ChartTooltipItem, data: any) => {
                        const index = tooltipItem.index;
                        if (typeof index !== 'undefined') {
                            return `Count: ${data.datasets[0].data[index]}`;
                        }
                    },
                },
            },
        };

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return this.createChart(id, 'pie', chartData, chartOptions);
    }

    private createStravaActivityLink(chart: any, chartId: string) {
        // Only do this when it's not a touch device.
        if (Helpers.isTouchDevice()) {
            return;
        }

        const canvasElement = document.getElementById(chartId + '-canvas') as HTMLCanvasElement;
        canvasElement.onclick = (event) => {
            const activePoints = chart.getElementAtEvent(event);
            if (activePoints.length === 1) {
                const index = activePoints[0]._index;
                const activityLink = `https://www.strava.com/activities/${chart.data.datasets[0].activityIds[index]}`;
                window.open(activityLink, '_blank');
            }
        };
    }
}
