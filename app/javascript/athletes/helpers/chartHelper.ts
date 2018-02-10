import * as Chart from 'chart.js';

import { Helpers } from '../../common/helpers';
import { RgbColor } from '../../common/rgbColor';

export enum ChartType {
    Bar = 'bar',
    Doughnut = 'doughnut',
    Line = 'line',
    Pie = 'pie',
    Polar = 'polar',
    Radar = 'radar',
}

export namespace ChartHelpers {
    export function createChartWithMessage(id: string, message: string) {
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

    export function createChartWithNotEnoughDataMessage(id: string) {
        this.createChartWithMessage(id, 'Not Enough Data to Generate Chart');
    }

    export function createStravaActivityLink(chart: any, chartId: string) {
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

    export function createChart(
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

    export function createLineChart(id: string, chartData: Chart.ChartData, customChartOptions?: Chart.ChartOptions) {
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
        return ChartHelpers.createChart(id, 'line', chartData, chartOptions);
    }

    export function createPieChart(
        id: string,
        counts: number[],
        dataLabels: string[],
        legendLabels?: string[],
        chartType?: ChartType,
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
        return ChartHelpers.createChart(
            id, chartType === ChartType.Doughnut ? 'doughnut' : 'pie', chartData, chartOptions);
    }

    export function createBarChart(
        id: string,
        counts: number[],
        dataLabels: string[],
        legendLabels: string[],
        customChartOptions?: Chart.ChartOptions) {

        const colors = Helpers.getRgbColors();
        const chartData = {
            yLabels: counts,
            labels: legendLabels,
            datasets: [{
                data: counts,
                label: dataLabels,
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
                            return `Count: ${tooltipItem.yLabel}`;
                        }
                    },
                },
            },
        };

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return ChartHelpers.createChart(id, 'bar', chartData, chartOptions);
    }

    export function createStackedBarChart(
        id: string,
        counts: string[],
        datasets: object,
        legendLabels: string[],
        customChartOptions?: Chart.ChartOptions) {

        const chartData = {
            yLabels: counts,
            labels: legendLabels,
            datasets,
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
                    stacked: true,
                    ticks: {
                        autoSkip: false,
                    },
                }],
                yAxes: [{
                    stacked: true,
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
                mode: 'index',
                callbacks: {
                    title: (tooltipItem: Chart.ChartTooltipItem[], data: any) => {
                        const index = tooltipItem[0].index;
                        if (typeof index !== 'undefined') {
                            return `${data.yLabels[index]}`;
                        }
                    },
                    label: (tooltipItem: Chart.ChartTooltipItem, data: any) => {
                        const datasetIndex = tooltipItem.datasetIndex;
                        if (tooltipItem.yLabel && typeof datasetIndex !== 'undefined') {
                            return `${data.datasets[datasetIndex].label}: ${tooltipItem.yLabel}`;
                        }
                    },
                },
            },
        };

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return ChartHelpers.createChart(id, 'bar', chartData, chartOptions);
    }

    export function createBubbleChart(
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
        return ChartHelpers.createChart(id, 'bubble', chartData, chartOptions);
    }

    export function createHorizontalBarChart(
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
                            return `Count: ${tooltipItem.xLabel}`;
                        }
                    },
                },
            },
        };

        const chartOptions = customChartOptions ?
            { ...defaultChartOptions, ...customChartOptions } : defaultChartOptions;
        return ChartHelpers.createChart(id, 'horizontalBar', chartData, chartOptions);
    }
}
