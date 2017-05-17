var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RgbColor = (function () {
    function RgbColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return RgbColor;
}());
/// <reference path="./../common/rgbColor.ts" />
var Helpers;
(function (Helpers) {
    function convertDurationToTime(duration) {
        var totalSeconds = parseInt(duration, 10); // Don't forget the second param.
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
        var hoursText = hours < 10 ? "0" + hours : hours.toString();
        var minutesText = minutes < 10 ? "0" + minutes : minutes.toString();
        var secondsText = seconds < 10 ? "0" + seconds : seconds.toString();
        var time = hoursText + ":" + minutesText + ":" + secondsText;
        return time;
    }
    Helpers.convertDurationToTime = convertDurationToTime;
    function getRgbColors() {
        var colors = [
            new RgbColor(189, 214, 186),
            new RgbColor(245, 105, 84),
            new RgbColor(0, 166, 90),
            new RgbColor(243, 156, 18),
            new RgbColor(64, 127, 127),
            new RgbColor(212, 154, 106),
            new RgbColor(78, 156, 104),
            new RgbColor(212, 166, 106),
            new RgbColor(245, 105, 84),
            new RgbColor(0, 166, 90),
            new RgbColor(243, 156, 18),
            new RgbColor(64, 127, 127),
            new RgbColor(212, 154, 106),
            new RgbColor(78, 156, 104),
        ];
        return colors;
    }
    Helpers.getRgbColors = getRgbColors;
    function convertToRgbaColors(rgbColors, alpha) {
        var colors = [];
        rgbColors.forEach(function (item, index) {
            var color = "rgba(" + rgbColors[index].r + ", " + rgbColors[index].g + ", " + rgbColors[index].b + ", " + alpha + ")";
            colors.push(color);
        });
        return colors;
    }
    Helpers.convertToRgbaColors = convertToRgbaColors;
})(Helpers || (Helpers = {}));
/// <reference path="./../typings/hubspot-pace.d.ts" />
/// <reference path="./../typings/jquery.d.ts" />
/// <reference path="./../typings/toastr.d.ts" />
/// <reference path="./../common/helpers.ts" />
Pace.on('hide', function () {
    $('body').removeClass('page-loading').addClass('page-loaded');
});
$(document).ready(function () {
    toastr.options = Toastr.getOptions();
    GoogleAnalytics.bindEvents().apply(null);
    EventBinders.bindAll().apply(null);
    var overview = new Views.Overview();
    overview.createNavigationItems();
    overview.load();
});
/// <reference path="./../typings/google.analytics.d.ts" />
var GoogleAnalyticsHelpers;
(function (GoogleAnalyticsHelpers) {
    function sendEvent(category, action, label) {
        if (label) {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action,
                eventLabel: label.trim()
            });
        }
        else {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action
            });
        }
    }
    GoogleAnalyticsHelpers.sendEvent = sendEvent;
    function sendOutboundLinkClickingEvent(href) {
        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'Click',
            eventLabel: href.trim(),
            transport: 'beacon'
        });
    }
    GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent = sendOutboundLinkClickingEvent;
})(GoogleAnalyticsHelpers || (GoogleAnalyticsHelpers = {}));
/// <reference path="./../../common/googleAnalyticsHelpers.ts" />
var GoogleAnalytics;
(function (GoogleAnalytics) {
    function bindEvents() {
        var eventBinders = function () {
            $(document).on('click', '.external', function (event) {
                var href = $(event.currentTarget).attr('href');
                GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent(href);
            });
            $(document).on('click', '.logo', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Logo');
            });
            $(document).on('click', '.breadcrumb a', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Breadcrumb', event.currentTarget.textContent);
            });
            $(document).on('click', '.sidebar-toggle', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Navigation Sidebar');
            });
            $(document).on('click', ".sidebar-menu a[id^='best-efforts-for-'], .sidebar-menu a[id^='races-for-']", function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Show Details', $(event.currentTarget).find('.item-text')[0].textContent);
            });
            $(document).on('click', '.sidebar-menu .treeview-header', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select Navigation Header', event.currentTarget.textContent);
            });
            $(document).on('click', '.nav-tabs li', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Navigation Tabs', event.currentTarget.textContent);
            });
            $(document).on('click', '.box-header a', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Box Header Links', event.currentTarget.textContent);
            });
            $(document).on('click', '.notifications-menu .dropdown-toggle', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Notifications Menu');
            });
            $(document).on('click', '.user-menu .dropdown-toggle', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle User Menu');
            });
            $(document).on('click', '.user-menu .athlete-link', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Athlete Profile on Strava', $(event.currentTarget).attr('href'));
            });
            $(document).on('click', '.user-menu .athlete-following', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', "View Athlete's Followings", $(event.currentTarget).attr('href'));
            });
            $(document).on('click', '.user-menu .athlete-follower', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', "View Athlete's Followers", $(event.currentTarget).attr('href'));
            });
            $(document).on('click', '.control-sidebar-toggle', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Control Sidebar');
            });
            $(document).on('click', '.control-sidebar .nav-tabs a', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select Tab in Control Sidebar', $(event.currentTarget).attr('href'));
            });
            $(document).on('click', '.control-sidebar .sign-out', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Sign Out');
            });
            $(document).on('click', '.control-sidebar button', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Button in Control Sidebar', event.currentTarget.textContent);
            });
            $(document).on('click', '.control-sidebar .last-activity-retrieved', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Last Activity Retrieved');
            });
            $('#main-content').delegate('.dataTables_wrapper .dataTables_filter input', 'click', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Search DataTables');
            });
            $('#main-content').delegate('.dataTables_wrapper .paginate_button', 'click', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Navigate DataTable Pages');
            });
            $('#main-content').delegate('.dataTables_wrapper .dataTables_length select', 'click', function (event) {
                var value = event.currentTarget.value;
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select DataTable number of entries', value);
            });
            $('#main-content').delegate('.dataTables_wrapper .datatable thead th', 'click', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Sort DataTable Column', event.currentTarget.textContent);
            });
            $('#main-content').delegate('.strava-activity-link', 'click', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Activity on Strava');
            });
            $('#main-content').delegate('.timeline .race-distance-label', 'click', function (event) {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Filter Distance in Timeline', event.currentTarget.textContent);
            });
            $('#main-content').delegate('.show-races-timeline', 'click', function () {
                GoogleAnalyticsHelpers.sendEvent('Athletes', 'Show All Distances');
            });
        };
        return eventBinders;
    }
    GoogleAnalytics.bindEvents = bindEvents;
})(GoogleAnalytics || (GoogleAnalytics = {}));
var AppHelpers;
(function (AppHelpers) {
    function appendToPageTitle(content) {
        var pageTitle = document.title;
        var newTitle = pageTitle.substr(0, pageTitle.lastIndexOf(' | ')) + content;
        $(document).prop('title', newTitle);
    }
    AppHelpers.appendToPageTitle = appendToPageTitle;
    function getBaseUrl(isApiCall) {
        var athleteId = $('#athlete-id').text().trim();
        var urlPrefix = window.location.protocol + "//" + window.location.host + (isApiCall ? '/api' : '') + "/athletes/" + athleteId;
        return urlPrefix;
    }
    AppHelpers.getBaseUrl = getBaseUrl;
    function getApiBaseUrl() {
        return getBaseUrl(true);
    }
    AppHelpers.getApiBaseUrl = getApiBaseUrl;
    function pushStateToWindow(url) {
        window.history.pushState({}, '', url);
    }
    AppHelpers.pushStateToWindow = pushStateToWindow;
    function resetNavigationItems() {
        $('.treeview-menu a').each(function () {
            $(this).parent().removeClass('active');
            $(this).children('i').removeClass('fa-check-circle-o');
            $(this).children('i').addClass('fa-circle-o');
        });
    }
    AppHelpers.resetNavigationItems = resetNavigationItems;
    function setContentHeader(headerText) {
        $('.content-header h1').text(headerText);
        $('.content-header .breadcrumb li.active').text(headerText);
    }
    AppHelpers.setContentHeader = setContentHeader;
    function setNavigationItem(anchor) {
        anchor.parent().addClass('active');
        anchor.children('i').removeClass('fa-circle-o');
        anchor.children('i').addClass('fa-check-circle-o');
    }
    AppHelpers.setNavigationItem = setNavigationItem;
})(AppHelpers || (AppHelpers = {}));
/// <reference path="./../../typings/chart.js.d.ts" />
var ChartHelpers;
(function (ChartHelpers) {
    function createChartMessage(id, message) {
        if (!message) {
            message = 'Not Enough Data to Generate Chart';
        }
        var content = "\n            <div class='text-center'>\n                <h4>" + message + "</h4>\n            </div>\n        ";
        var container = $('#' + id).parent();
        container.empty();
        container.append(content);
    }
    ChartHelpers.createChartMessage = createChartMessage;
    function constructChartHtml(id, title, width, withLoadingIcon) {
        if (withLoadingIcon === void 0) { withLoadingIcon = false; }
        var loadingIcon = '';
        if (withLoadingIcon) {
            loadingIcon = HtmlHelpers.getLoadingIcon();
        }
        var chart = "\n            <div class=\"col-md-" + width + "\">\n                <div class=\"box\">\n                    <div class=\"box-header with-border>\n                        <i class=\"fa fa-pie-chart\"></i>\n                        <h3 class=\"box-title\">" + title + "</h3>\n                        <div class=\"box-body\">\n                            <div class=\"chart\">\n                                <canvas id=\"" + id + "\"></canvas>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ";
        return chart;
    }
    ChartHelpers.constructChartHtml = constructChartHtml;
    function createBarChart(id, counts, dataLabels, legendLabels) {
        var colors = Helpers.getRgbColors();
        var chartData = {
            yLabels: counts,
            labels: legendLabels.reverse(),
            datasets: [{
                    data: counts.reverse(),
                    label: dataLabels.reverse(),
                    backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                    hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1)
                }]
        };
        var canvasElement = $('#' + id).get(0);
        var ctx = canvasElement.getContext('2d');
        ctx.canvas.height = 300;
        var linearOptions = { beginAtZero: true };
        var chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
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
                        title: function (tooltipItem, data) {
                            return data.datasets[0].label[tooltipItem[0].index];
                        },
                        label: function (tooltipItem) {
                            return "Count: " + tooltipItem.yLabel.toString();
                        }
                    }
                }
            }
        });
    }
    ChartHelpers.createBarChart = createBarChart;
    function createPieChart(id, counts, dataLabels, legendLabels) {
        var colors = Helpers.getRgbColors();
        var chartData = {
            labels: (legendLabels) ? legendLabels : dataLabels,
            datasets: [{
                    data: counts,
                    label: dataLabels,
                    backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                    hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1)
                }]
        };
        var canvasElement = $('#' + id).get(0);
        var ctx = canvasElement.getContext('2d');
        ctx.canvas.height = 300;
        var chart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                legend: {
                    position: 'bottom',
                    onClick: function (event) {
                        event.stopPropagation();
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        title: function (tooltipItem, data) {
                            return data.datasets[0].label[tooltipItem[0].index];
                        },
                        label: function (tooltipItem, data) {
                            return "Count: " + data.datasets[0].data[tooltipItem.index];
                        }
                    }
                }
            }
        });
    }
    ChartHelpers.createPieChart = createPieChart;
    function createProgressionChart(id, items) {
        if (items.length > 1) {
            var activityNames_1 = [];
            var dates_1 = [];
            var runTimes_1 = [];
            items.forEach(function (item) {
                var activityName = item.activity_name;
                var date = item.start_date;
                var runTime = item.elapsed_time;
                activityNames_1.push(activityName);
                dates_1.push(date);
                runTimes_1.push(runTime);
            });
            var chartData = {
                yLabels: runTimes_1,
                labels: dates_1,
                datasets: [{
                        label: activityNames_1,
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
                        data: runTimes_1,
                        spanGaps: false
                    }]
            };
            var canvasElement = $('#' + id).get(0);
            var ctx = canvasElement.getContext('2d');
            ctx.canvas.height = 300;
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
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
                                    callback: function (value) {
                                        return value.toString().toHHMMSS();
                                    }
                                }
                            }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            title: function (tooltipItem, data) {
                                return data.datasets[0].label[tooltipItem[0].index];
                            },
                            label: function (tooltipItem) {
                                var time = Helpers.convertDurationToTime(tooltipItem.yLabel.toString());
                                var date = tooltipItem.xLabel;
                                return "Ran " + time + " on " + date;
                            }
                        }
                    }
                }
            });
        }
        else {
            createChartMessage(id);
        }
    }
    ChartHelpers.createProgressionChart = createProgressionChart;
    function createYearDistributionChart(id, items) {
        if (items.length > 1) {
            var years_1 = {}; // Holds year and its count.
            items.forEach(function (item) {
                var startDate = item['start_date'];
                var dateParts = startDate.split('-');
                var year = new Date(dateParts[0], dateParts[1], dateParts[2]).getFullYear();
                if (year in years_1) {
                    years_1[year] += 1;
                }
                else {
                    years_1[year] = 1;
                }
            });
            var dataLabels = Object.keys(years_1);
            var legendLabels_1 = [];
            var counts_1 = [];
            $.each(years_1, function (key) {
                var value = years_1[key];
                counts_1.push(value);
                legendLabels_1.push(key + " (" + value + ")");
            });
            createPieChart(id, counts_1, dataLabels, legendLabels_1);
        }
        else {
            createChartMessage(id);
        }
    }
    ChartHelpers.createYearDistributionChart = createYearDistributionChart;
    function createWorkoutTypeChart(id, items) {
        if (items.length > 1) {
            var workoutTypes_1 = {}; // Holds Workout Type and its count.
            items.forEach(function (bestEffort) {
                var workoutType = bestEffort['workout_type_name'];
                // No workout type is a normal run.
                if (workoutType === null) {
                    workoutType = 0;
                }
                if (workoutType in workoutTypes_1) {
                    workoutTypes_1[workoutType] += 1;
                }
                else {
                    workoutTypes_1[workoutType] = 1;
                }
            });
            var dataLabels = ['Run', 'Race', 'Long Run', 'Workout'];
            var counts = [workoutTypes_1.run, workoutTypes_1.race, workoutTypes_1['long run'], workoutTypes_1.workout];
            createPieChart(id, counts, dataLabels);
        }
        else {
            createChartMessage(id);
        }
    }
    ChartHelpers.createWorkoutTypeChart = createWorkoutTypeChart;
    function createMonthDistributionChart(id, items) {
        if (items.length > 1) {
            var months_1 = {}; // Holds month and its count.
            items.forEach(function (item) {
                var startDate = item['start_date'];
                var dateParts = startDate.split('-');
                var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December',
                ];
                var month = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]).getMonth();
                var monthName = monthNames[month];
                if (monthName in months_1) {
                    months_1[monthName] += 1;
                }
                else {
                    months_1[monthName] = 1;
                }
            });
            var dataLabels_1 = [];
            var legendLabels_2 = [];
            var counts_2 = [];
            $.each(months_1, function (key) {
                var value = parseInt(months_1[key], 10);
                legendLabels_2.push(key + " (" + value + ")");
                counts_2.push(value);
                dataLabels_1.push(key);
            });
            createBarChart(id, counts_2, dataLabels_1, legendLabels_2);
        }
        else {
            createChartMessage(id);
        }
    }
    ChartHelpers.createMonthDistributionChart = createMonthDistributionChart;
    function createRaceDistancesChart(id, items) {
        if (items.length > 1) {
            var raceDistances_1 = {}; // Holds race distance and its count.
            items.forEach(function (item) {
                var raceDistance = item['race_distance'];
                if (raceDistance in raceDistances_1) {
                    raceDistances_1[raceDistance] += 1;
                }
                else {
                    raceDistances_1[raceDistance] = 1;
                }
            });
            var dataLabels_2 = [];
            var legendLabels_3 = [];
            var counts_3 = [];
            $.each(raceDistances_1, function (key) {
                var value = parseInt(raceDistances_1[key], 10);
                legendLabels_3.push(key + " (" + value + ")");
                counts_3.push(value);
                dataLabels_2.push(key);
            });
            createBarChart(id, counts_3, dataLabels_2, legendLabels_3);
        }
        else {
            createChartMessage(id);
        }
    }
    ChartHelpers.createRaceDistancesChart = createRaceDistancesChart;
    function createGearCountChart(id, items) {
        if (items.length > 1) {
            var gears_1 = {}; // Holds Gear and its count.
            items.forEach(function (item) {
                var gearName = item['gear_name'];
                if (gearName in gears_1) {
                    gears_1[gearName] += 1;
                }
                else {
                    gears_1[gearName] = 1;
                }
            });
            var dataLabels = Object.keys(gears_1);
            var counts_4 = [];
            $.each(gears_1, function (key) {
                var value = gears_1[key];
                counts_4.push(value);
            });
            createPieChart(id, counts_4, dataLabels);
        }
        else {
            createChartMessage(id);
        }
    }
    ChartHelpers.createGearCountChart = createGearCountChart;
    function createGearMileageChart(id, items) {
        if (items.length > 1) {
            var gears_2 = {}; // Holds Gear and its count.
            items.forEach(function (item) {
                var gearName = item['gear_name'];
                if (gearName in gears_2) {
                    gears_2[gearName] += item['distance'];
                }
                else {
                    gears_2[gearName] = item['distance'];
                }
            });
            var gearLabels = Object.keys(gears_2);
            var gearMileages_1 = [];
            $.each(gears_2, function (key) {
                var mileage = gears_2[key] / 1000;
                gearMileages_1.push(mileage);
            });
            var colors = Helpers.getRgbColors();
            var data = {
                labels: gearLabels,
                datasets: [{
                        data: gearMileages_1,
                        backgroundColor: Helpers.convertToRgbaColors(colors, 0.6),
                        hoverBackgroundColor: Helpers.convertToRgbaColors(colors, 1)
                    }]
            };
            var canvasElement = $('#' + id).get(0);
            var ctx = canvasElement.getContext('2d');
            ctx.canvas.height = 300;
            var linearOptions = { beginAtZero: true };
            var chart = new Chart(ctx, {
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
                            label: function (tooltipItem) {
                                var mileage = parseFloat(tooltipItem.xLabel).toFixed(1);
                                return "Mileage: " + mileage + " km";
                            }
                        }
                    }
                }
            });
        }
        else {
            createChartMessage(id);
        }
    }
    ChartHelpers.createGearMileageChart = createGearMileageChart;
})(ChartHelpers || (ChartHelpers = {}));
var EventBinders;
(function (EventBinders) {
    function bindAll() {
        var eventBinders = function () {
            // Disable double cliking for logo and navigation items.
            $(document).on('dblclick', ".main-header .logo, a[id^='best-efforts-for-'], a[id^='races-for-']", function (event) {
                event.preventDefault();
            });
            // Disable clicking for 'Estimated Best Efforts', 'Race by Distance' and 'Race by Year' treeview headers.
            $('.sidebar-menu .disabled').click(false);
            // Reload Overview page.
            $(document).on('click', '.show-overview', function () {
                var overview = new Views.Overview();
                overview.load();
            });
            // Load Races Overview upon clicking 'Races' tab button if not yet created.
            $(document).on('click', "a[href^='#pane-races']", function () {
                if ($('#pane-races .loading-icon-panel').length) {
                    var overview = new Views.Overview();
                    overview.loadRacesPanel();
                }
            });
            // Bind other view loading events.
            $(document).on('click', '.show-races-timeline', function () {
                var racesTimeline = new Views.RacesTimeline();
                racesTimeline.load();
            });
            $(document).on('click', "a[id^='best-efforts-for-']", function (event) {
                var distance = $(event.currentTarget).find('.item-text').text().trim();
                var bestEffortsByDistanceView = new Views.BestEffortsByDistance(distance);
                bestEffortsByDistanceView.load();
            });
            $(document).on('click', "a[id^='races-for-distance']", function (event) {
                var distance = $(event.currentTarget).find('.item-text').text().trim();
                var racesByDistanceView = new Views.RacesByDistance(distance);
                racesByDistanceView.load();
            });
            $(document).on('click', "a[id^='races-for-year']", function (event) {
                var year = $(event.currentTarget).find('.item-text').text().trim();
                var racesByYearView = new Views.RacesByYear(year);
                racesByYearView.load();
            });
            // Bind race distance selection buttons in Races Timeline view.
            $(document).on('click', '.race-distance-label', function (event) {
                var distance = $(event.currentTarget).text().toLowerCase().replace(/\s/g, '-');
                $('.timeline-item').parent().hide();
                $('.timeline-item.race-distance-' + distance).parent().fadeIn(500);
                $('#main-content .show-races-timeline').removeClass('hidden').fadeIn(500);
            });
            // Append PR/Contributions welcome badges upon clicking settings toggle button.
            $(document).on('click', '.control-sidebar-toggle', function () {
                if (!$('.link-contributions-welcome').length) {
                    var badges = HtmlHelpers.getContributionWelcomeBadges();
                    $('#control-sidebar-data-tab form').append(badges);
                }
            });
            // Settings' event listeners.
            $(document).on('submit', '.form-save-profile', function (event) {
                saveProfile(event);
            });
            $(document).on('submit', '.form-reset-last-activity-retrieved', function (event) {
                resetLastRetrieveActivity(event);
            });
        };
        return eventBinders;
    }
    EventBinders.bindAll = bindAll;
    function saveProfile(event) {
        event.preventDefault();
        var isPublicCheckbox = $('#is_public')[0];
        var isPublic = isPublicCheckbox.checked;
        var profileData = {
            is_public: isPublic
        };
        $.ajax({
            url: $('.form-save-profile').attr('action'),
            data: profileData,
            cache: false,
            type: 'post',
            success: function () {
                toastr.success('Saved Successfully!');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                toastr.error(xhr.status + '\n' + thrownError);
            }
        });
    }
    function resetLastRetrieveActivity(event) {
        event.preventDefault();
        $.ajax({
            url: $('.form-reset-last-activity-retrieved').attr('action'),
            data: '',
            cache: false,
            type: 'post',
            success: function () {
                toastr.success('Saved Successfully!');
                $('.last-activity-retrieved').addClass('hidden');
                $('.last-activity-na').removeClass('hidden');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                toastr.error(xhr.status + '\n' + thrownError);
            }
        });
    }
})(EventBinders || (EventBinders = {}));
var HtmlHelpers;
(function (HtmlHelpers) {
    function getContributionWelcomeBadges() {
        var html = "\n        <p class=\"link-contributions-welcome\">\n            <a href=\"https://github.com/yizeng/strafforts/blob/master/docs/development-guide.md\" target=\"_blank\">\n                <img src=\"https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square\" alt=\"Contributions Welcome\">\n            </a>\n            <a href=\"https://github.com/yizeng/strafforts/pulls\" target=\"_blank\">\n                <img src=\"https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square\" alt=\"PRs Welcome\">\n            </a>\n        </p>";
        return html;
    }
    HtmlHelpers.getContributionWelcomeBadges = getContributionWelcomeBadges;
    function getLoadingIcon() {
        var html = "\n        <div class='loading-icon-panel text-center'>\n            <button type='button' class='btn btn-default btn-lrg' title='Loading Data...'>\n                <i class='fa fa-spin fa-refresh'></i>\n            </button>\n        </div>";
        return html;
    }
    HtmlHelpers.getLoadingIcon = getLoadingIcon;
    function getNoDataInfoBox() {
        var title = 'Nothing Yet!';
        var link = 'https://support.strava.com/hc/en-us/articles/216919557-Using-Strava-Run-Type-Tags-to-analyze-your-Runs';
        var messageBody = "\n        <p>\n            If you have just connected Strafforts with your Strava account,\n            please be patient while your data is being processed.\n        </p>\n        <p>\n            To make your races show up in Strafforts, you need to tag them as \"Race\" in Strava.\n            See <a href=\"" + link + "\" target=\"_blank\">\"Using Strava Run Type Tags to analyze your Runs\"</a>\n            for more details.\n        </p>";
        var html = "\n        <div class=\"notification-alert\">\n            <div class=\"modal\">\n                <div class=\"modal-dialog modal-lg\">\n                    <div class=\"modal-content\">\n                        <div class=\"modal-header\">\n                            <h3 class=\"modal-title\">" + title + "</h3>\n                        </div>\n                        <div class=\"modal-body\">\n                            " + messageBody + "\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>";
        return html;
    }
    HtmlHelpers.getNoDataInfoBox = getNoDataInfoBox;
    function getDatatableHeaderForBestEfforts() {
        var header = "\n            <thead>\n                <tr>\n                    <th class=\"col-md-1\">Date</th>\n                    <th class=\"col-md-1 text-center badge-cell hidden-xs-down\">Type</th>\n                    <th class=\"col-md-4\">Activity</th>\n                    <th class=\"col-md-1\">Time</th>\n                    <th class=\"col-md-1 hidden-xs-down\">Pace</th>\n                    <th class=\"col-md-2 hidden-lg-down\">Gear</th>\n                    <th class=\"col-md-1 text-center badge-cell hidden-md-down\">Avg. HR</th>\n                    <th class=\"col-md-1 text-center badge-cell hidden-md-down\">Max HR</th>\n                </tr>\n            </thead>\n        ";
        return header;
    }
    HtmlHelpers.getDatatableHeaderForBestEfforts = getDatatableHeaderForBestEfforts;
    function getDatatableHeaderForRaces() {
        var header = "\n            <thead>\n                <tr>\n                <th class=\"col-md-1\">Date</th>\n                <th class=\"col-md-3\">Activity</th>\n                <th class=\"col-md-1\">Time</th>\n                <th class=\"col-md-1 hidden-xs-down\">Pace</th>\n                <th class=\"col-md-2 hidden-lg-down\">Gear</th>\n                <th class=\"col-md-1 hidden-md-down\">Elevation</th>\n                <th class=\"col-md-1 hidden-md-down\">Cadence</th>\n                <th class=\"col-md-1 text-center badge-cell hidden-md-down\">Avg. HR</th>\n                <th class=\"col-md-1 text-center badge-cell hidden-md-down\">Max HR</th>\n                </tr>\n            </thead>\n        ";
        return header;
    }
    HtmlHelpers.getDatatableHeaderForRaces = getDatatableHeaderForRaces;
    function getDatatableRowForBestEfforts(item) {
        var row = "\n            <tr>\n                <td>" + item['start_date'] + "</td>\n                <td class=\"text-center badge-cell hidden-xs-down\">\n                    <span class=\"label workout-type-" + item['workout_type_name'].replace(/ /g, '-') + "\">" + item['workout_type_name'] + "</span>\n                </td>\n                <td>\n                    <a class=\"strava-activity-link\" href=\"https://www.strava.com/activities/" + item['activity_id'] + "\" target=\"_blank\">\n                        " + item['activity_name'] + "\n                    </a>\n                </td>\n                <td>\n                    " + item['elapsed_time_formatted'] + "\n                </td>\n                <td class=\"hidden-xs-down\">\n                    " + item['pace'] + "<small>" + item['pace_unit'] + "</small>\n                </td>\n                <td class=\"hidden-lg-down\">\n                    " + item['gear_name'] + "\n                </td>\n                <td class=\"text-center badge-cell hidden-md-down\">\n                    <span class=\"badge " + item['average_hr_zone_class'] + "\">\n                        " + item['average_heartrate'] + "\n                    </span>\n                </td>\n                <td class=\"text-center badge-cell hidden-md-down\">\n                    <span class=\"badge " + item['max_hr_zone_class'] + "\">\n                        " + item['max_heartrate'] + "\n                    </span>\n                </td>\n            </tr>\n        ";
        return row;
    }
    HtmlHelpers.getDatatableRowForBestEfforts = getDatatableRowForBestEfforts;
    function getDatatableRowForRaces(item) {
        var row = "\n            <tr>\n                <td>" + item['start_date'] + "</td>\n                <td>\n                    <a class=\"strava-logo-link\" href=\"https://www.strava.com/activities/" + item['activity_id'] + "\" target=\"_blank\">\n                        <span></span>\n                    </a>\n                    <a href=\"https://www.strava.com/activities/" + item['activity_id'] + "\" target=\"_blank\">" + item['activity_name'] + "</a>\n                </td>\n                <td>\n                    " + item['elapsed_time_formatted'] + "\n                </td>\n                <td class=\"hidden-xs-down\">\n                    " + item['pace'] + "<small>" + item['pace_unit'] + "</small>\n                </td>\n                <td class=\"hidden-lg-down\">\n                    " + item['gear_name'] + "\n                </td>\n                <td class=\"hidden-md-down\">\n                    " + item['elevation'] + "<small> " + item['elevation_unit'] + "</small>\n                </td>\n                <td class=\"hidden-md-down\">\n                    " + item['cadence'] + "\n                </td>\n                <td class=\"text-center badge-cell hidden-md-down\">\n                    <span class=\"badge " + item['average_hr_zone_class'] + "\">\n                        " + item['average_heartrate'] + "\n                    </span>\n                </td>\n                <td class=\"text-center badge-cell hidden-md-down\">\n                    <span class=\"badge " + item['max_hr_zone_class'] + "\">\n                        " + item['max_heartrate'] + "\n                    </span>\n                </td>\n            </tr>\n        ";
        return row;
    }
    HtmlHelpers.getDatatableRowForRaces = getDatatableRowForRaces;
})(HtmlHelpers || (HtmlHelpers = {}));
var Toastr;
(function (Toastr) {
    function getOptions() {
        var options = {
            closeButton: true,
            debug: false,
            newestOnTop: true,
            progressBar: false,
            positionClass: 'toast-top-center',
            preventDuplicates: false,
            showDuration: 300,
            hideDuration: 1000,
            timeOut: 3000,
            extendedTimeOut: 1000,
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut'
        };
        return options;
    }
    Toastr.getOptions = getOptions;
})(Toastr || (Toastr = {}));
var Views;
(function (Views) {
    var BaseView = (function () {
        function BaseView() {
        }
        BaseView.prototype.prepareView = function (viewUrl, viewType, itemName, navigationAnchor) {
            var viewName = viewType;
            if (itemName) {
                viewName = viewType + " - " + itemName;
            }
            AppHelpers.pushStateToWindow(viewUrl);
            AppHelpers.setContentHeader(viewName);
            AppHelpers.appendToPageTitle(" |  " + viewName);
            AppHelpers.resetNavigationItems();
            if (navigationAnchor) {
                AppHelpers.setNavigationItem(navigationAnchor);
            }
        };
        return BaseView;
    }());
    Views.BaseView = BaseView;
})(Views || (Views = {}));
/// <reference path="./baseView.ts" />
var Views;
(function (Views) {
    var BestEffortsByDistance = (function (_super) {
        __extends(BestEffortsByDistance, _super);
        function BestEffortsByDistance(distance) {
            var _this = _super.call(this) || this;
            _this.distance = distance;
            _this.distanceFormattedForUrl = distance.trim().replace(/\//g, '|').replace(/\s/g, '-').toLowerCase();
            return _this;
        }
        BestEffortsByDistance.prototype.load = function () {
            var viewUrl = AppHelpers.getBaseUrl() + "/best-efforts/" + this.distanceFormattedForUrl;
            var distanceId = this.distance.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
            var navigationAnchor = $("a[id^=\"best-efforts-for-" + distanceId + "\"]");
            _super.prototype.prepareView.call(this, viewUrl, 'Best Efforts', this.distance, navigationAnchor);
            this.createViewTemplate();
            this.createView();
        };
        BestEffortsByDistance.prototype.createViewTemplate = function () {
            var mainContent = $('#main-content');
            mainContent.empty(); // Empty main content.
            // Create empty tables and charts with loading icon.
            var showLoadingIcon = true;
            var content = "\n                <div class=\"row\">\n                    " + ChartHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon) + "\n                    " + ChartHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon) + "\n                </div>\n                " + this.constructDataTableHtml() + "\n                <div class=\"row\">'\n                    " + ChartHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon) + "\n                    " + ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon) + "\n                </div>\n            ";
            mainContent.append(content);
        };
        BestEffortsByDistance.prototype.createView = function () {
            var _this = this;
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + "/best-efforts/" + this.distanceFormattedForUrl,
                dataType: 'json',
                async: false,
                success: function (data) {
                    var items = [];
                    $.each(data, function (key, value) {
                        items.push(value);
                    });
                    // Create all tables and charts.
                    var mainContent = $('#main-content');
                    mainContent.empty();
                    var content = "\n                        <div class=\"row\">\n                            " + ChartHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8) + "\n                            " + ChartHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4) + "\n                        </div>\n                        " + _this.constructDataTableHtml(items) + "\n                        <div class=\"row\">\n                            " + ChartHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6) + "\n                            " + ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6) + "\n                        </div>\n                    ";
                    mainContent.append(content);
                    // Setup all tables and charts.
                    ChartHelpers.createProgressionChart('progression-chart', items);
                    ChartHelpers.createYearDistributionChart('year-distribution-pie-chart', items);
                    $('.dataTable').each(function () {
                        $(this).DataTable({
                            columnDefs: [{
                                    targets: [1, 3, 4, 6, 7],
                                    searchable: false
                                }],
                            iDisplayLength: 10,
                            order: [
                                [0, 'desc'],
                            ]
                        });
                    });
                    ChartHelpers.createWorkoutTypeChart('workout-type-chart', items);
                    ChartHelpers.createGearCountChart('gear-count-chart', items);
                }
            });
        };
        BestEffortsByDistance.prototype.constructDataTableHtml = function (items) {
            var table = HtmlHelpers.getLoadingIcon();
            if (items) {
                var rows_1 = '';
                items.forEach(function (item) {
                    rows_1 += HtmlHelpers.getDatatableRowForBestEfforts(item);
                });
                table = "\n                    <table class=\"dataTable table table-bordered table-striped\">\n                        " + HtmlHelpers.getDatatableHeaderForBestEfforts() + "\n                        <tbody>\n                            " + rows_1 + "\n                        </tbody>\n                    </table>\n                ";
            }
            var dataTable = "\n                <div class=\"row\">\n                    <div class=\"col-xs-12\">\n                        <div class=\"box\">\n                            <div class=\"box-header with-border>\n                                <i class=\"fa fa-bar-chart-o\"></i><h3 class=\"box-title\">Data Table</h3>\n                                <div class=\"box-body\">\n                                    " + table + "\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ";
            return dataTable;
        };
        return BestEffortsByDistance;
    }(Views.BaseView));
    Views.BestEffortsByDistance = BestEffortsByDistance;
})(Views || (Views = {}));
/// <reference path="./baseView.ts" />
var Views;
(function (Views) {
    var Overview = (function (_super) {
        __extends(Overview, _super);
        function Overview() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Overview.prototype.createNavigationItems = function () {
            this.createNavigationItem('/best-efforts/get_counts', 'best_effort_type', 'best-efforts-for');
            this.createNavigationItem('/races/get_counts_by_distance', 'race_distance', 'races-for-distance');
            this.createNavigationItem('/races/get_counts_by_year', 'race_year', 'races-for-year');
        };
        Overview.prototype.load = function () {
            var viewUrl = AppHelpers.getBaseUrl();
            _super.prototype.prepareView.call(this, viewUrl, 'Overview');
            this.createViewTemplate();
            this.createView();
        };
        Overview.prototype.loadRacesPanel = function () {
            this.createOverviewDatatable('races');
        };
        Overview.prototype.createViewTemplate = function () {
            var mainContent = $('#main-content');
            mainContent.empty(); // Empty main content.
            var content = "\n            <div class=\"row\">\n                <div class=\"col-xs-12\">\n                    <div class=\"nav-tabs-custom\">\n                        <ul class=\"nav nav-tabs\">\n                            <li class=\"active\">\n                                <a href=\"#pane-best-efforts\" data-toggle=\"tab\">Best Efforts</a>\n                            </li>\n                            <li>\n                                <a href=\"#pane-races\" data-toggle=\"tab\">Races</a>\n                            </li>\n                        </ul>\n                        <div class=\"tab-content\">\n                            <div class=\"tab-pane active\" id=\"pane-best-efforts\">" + HtmlHelpers.getLoadingIcon() + "</div>\n                            <div class=\"tab-pane\" id=\"pane-races\">" + HtmlHelpers.getLoadingIcon() + "</div>\n                        </div>\n                    </div>\n                </div>\n            </div>";
            mainContent.append(content);
        };
        Overview.prototype.createView = function () {
            this.createOverviewDatatable('best-efforts');
        };
        Overview.prototype.createNavigationItem = function (url, itemName, elementIdPrefix) {
            var fullUrl = AppHelpers.getApiBaseUrl() + url;
            $.ajax({
                url: fullUrl,
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (data.length === 0) {
                        $("#treeview-menu-" + elementIdPrefix).closest('.treeview').empty();
                    }
                    else {
                        $.each(data, function (key, value) {
                            var itemText = value[itemName];
                            var itemId = value[itemName].replace(/\s/g, '-').replace(/\//g, '-').toLowerCase();
                            var elementId = elementIdPrefix + "-" + itemId + "-navigation";
                            var count = value['count'];
                            var menuItem = "\n                                <li>\n                                    <a id=\"" + elementId + "\" href=\"#\">\n                                        <i class=\"fa fa-circle-o\"></i>\n                                        <span class=\"item-text\">" + itemText + "</span>\n                                        <span class=\"pull-right-container\">\n                                            <small class=\"pull-right\">" + count + "</small>\n                                        </span>\n                                    </a>\n                                </li>\n                            ";
                            var isMajor = value['is_major'];
                            if (isMajor) {
                                $("#treeview-menu-" + elementIdPrefix).before(menuItem);
                            }
                            else {
                                $("#treeview-menu-" + elementIdPrefix + " .treeview-menu").append(menuItem);
                            }
                        });
                    }
                }
            });
        };
        Overview.prototype.createOverviewDatatable = function (type) {
            var fullUrl = AppHelpers.getApiBaseUrl() + '/' + type;
            $.ajax({
                url: fullUrl,
                dataType: 'json',
                async: false,
                success: function (data) {
                    var distances = [];
                    $.each(data, function (key, value) {
                        var model = {
                            distance: key,
                            items: value
                        };
                        distances.push(model);
                    });
                    var pane = $('#pane-' + type);
                    pane.empty();
                    if (distances.length === 0) {
                        var infoBox = HtmlHelpers.getNoDataInfoBox();
                        pane.append(infoBox);
                    }
                    else {
                        distances.forEach(function (model) {
                            var distanceId = model['distance'].toLowerCase().replace(/\s/g, '-').replace(/\//g, '-');
                            var linkId = type + "-for-distance-" + distanceId;
                            var rows = '';
                            model['items'].forEach(function (item) {
                                var stravaLink = "https://www.strava.com/activities/" + item['activity_id'];
                                rows += "\n                                <tr>\n                                    <td>" + item['start_date'] + "</td>\n                                    <td class=\"text-center badge-cell hidden-md-down\">\n                                        <span class=\"label workout-type-" + item['workout_type_name'].replace(/\s/g, '-') + "\">\n                                            " + item['workout_type_name'] + "\n                                        </span>\n                                    </td>\n                                    <td>\n                                        <a class=\"strava-activity-link\" href=\"" + stravaLink + "\" target=\"_blank\">\n                                            " + item['activity_name'] + "\n                                        </a>\n                                    </td>\n                                    <td>" + item['elapsed_time_formatted'] + "</td>\n                                    <td class=\"hidden-xs-down\">\n                                        " + item['pace'] + "<small>" + item['pace_unit'] + "</small>\n                                    </td>\n                                    <td class=\"hidden-lg-down\">" + item['gear_name'] + "</td>\n                                    <td class='text-center badge-cell hidden-md-down'>\n                                        <span class=\"badge " + item['average_hr_zone_class'] + "\">" + item['average_heartrate'] + "</span>\n                                    </td>\n                                    <td class='text-center badge-cell hidden-md-down'>\n                                        <span class=\"badge " + item['max_hr_zone_class'] + "\">" + item['max_heartrate'] + "</span>\n                                    </td>\n                                </tr>";
                            });
                            var table = "\n                            <div class=\"box\">\n                                <div class=\"box-header\">\n                                    <h3 class=\"box-title\">\n                                        " + model['distance'] + "\n                                    </h3>\n                                    <a class=\"pull-right\" id=\"" + linkId + "\" href=\"#\">\n                                        <small> View Details</small>\n                                        <span class=\"item-text hidden\">\n                                            " + model['distance'] + "\n                                        </span>\n                                    </a>\n                                </div>\n                                <div class=\"box-body\">\n                                    <table class=\"dataTable table table-bordered table-striped\">\n                                        <thead>\n                                            <tr>\n                                                <th class=\"col-md-1\">Date</th>\n                                                <th class=\"col-md-1 text-center badge-cell hidden-md-down\">Type</th>\n                                                <th class=\"col-md-4\">Activity</th>\n                                                <th class=\"col-md-1\">Time</th>\n                                                <th class=\"col-md-1 hidden-xs-down\">Pace</th>\n                                                <th class=\"col-md-2 hidden-lg-down\">Gear</th>\n                                                <th class=\"col-md-1 text-center badge-cell hidden-md-down\">Avg. HR</th>\n                                                <th class=\"col-md-1 text-center badge-cell hidden-md-down\">Max HR</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n                                            " + rows + "\n                                        </tbody>\n                                    </table>\n                                </div>\n                            </div>";
                            pane.append(table);
                        });
                    }
                }
            });
        };
        return Overview;
    }(Views.BaseView));
    Views.Overview = Overview;
})(Views || (Views = {}));
/// <reference path="./baseView.ts" />
var Views;
(function (Views) {
    var RacesByDistance = (function (_super) {
        __extends(RacesByDistance, _super);
        function RacesByDistance(distance) {
            var _this = _super.call(this) || this;
            _this.distance = distance;
            _this.distanceFormattedForUrl = distance.trim().replace(/\//g, '|').replace(/\s/g, '-').toLowerCase();
            return _this;
        }
        RacesByDistance.prototype.load = function () {
            var viewUrl = AppHelpers.getBaseUrl() + "/races/" + this.distanceFormattedForUrl;
            var distanceId = this.distance.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
            var navigationAnchor = $("a[id^=\"races-for-distance-" + distanceId + "\"]");
            _super.prototype.prepareView.call(this, viewUrl, 'Races', this.distance, navigationAnchor);
            this.createViewTemplate();
            this.createView();
        };
        RacesByDistance.prototype.createViewTemplate = function () {
            var mainContent = $('#main-content');
            mainContent.empty();
            // Create empty tables and charts with loading icon.
            var showLoadingIcon = true;
            var content = "\n                <div class=\"row\">\n                    " + ChartHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon) + "\n                    " + ChartHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon) + "\n                </div>\n                " + this.constructDataTableHtml() + "\n                <div class=\"row\">'\n                    " + ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon) + "\n                    " + ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon) + "\n                </div>\n            ";
            mainContent.append(content);
        };
        RacesByDistance.prototype.createView = function () {
            var _this = this;
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + "/races/" + this.distanceFormattedForUrl,
                dataType: 'json',
                async: false,
                success: function (data) {
                    var items = [];
                    $.each(data, function (key, value) {
                        items.push(value);
                    });
                    // Create all tables and charts.
                    var mainContent = $('#main-content');
                    mainContent.empty();
                    var content = "\n                        <div class=\"row\">\n                            " + ChartHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8) + "\n                            " + ChartHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4) + "\n                        </div>\n                        " + _this.constructDataTableHtml(items) + "\n                        <div class=\"row\">\n                            " + ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6) + "\n                            " + ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6) + "\n                        </div>\n                    ";
                    mainContent.append(content);
                    // Create a progression chart when distance is not 'Other'.
                    var progressionChartId = 'progression-chart';
                    if (_this.distance === 'Other') {
                        ChartHelpers.createChartMessage(progressionChartId, 'Not Applicable');
                    }
                    else {
                        ChartHelpers.createProgressionChart(progressionChartId, items);
                    }
                    // Setup all other charts and tables.
                    ChartHelpers.createYearDistributionChart('year-distribution-pie-chart', items);
                    $('.dataTable').each(function () {
                        $(this).DataTable({
                            columnDefs: [{
                                    targets: [2, 3, 5, 6, 7, 8],
                                    searchable: false
                                }],
                            iDisplayLength: 10,
                            order: [
                                [0, 'desc'],
                            ]
                        });
                    });
                    ChartHelpers.createGearCountChart('gear-count-chart', items);
                    ChartHelpers.createGearMileageChart('gear-mileage-chart', items);
                }
            });
        };
        RacesByDistance.prototype.constructDataTableHtml = function (items) {
            var table = HtmlHelpers.getLoadingIcon();
            if (items) {
                var rows_2 = '';
                items.forEach(function (item) {
                    rows_2 += HtmlHelpers.getDatatableRowForRaces(item);
                });
                table = "\n                    <table class=\"dataTable table table-bordered table-striped\">\n                        " + HtmlHelpers.getDatatableHeaderForRaces() + "\n                        <tbody>\n                            " + rows_2 + "\n                        </tbody>\n                    </table>\n                ";
            }
            var dataTable = "\n                <div class=\"row\">\n                    <div class=\"col-xs-12\">\n                        <div class=\"box\">\n                            <div class=\"box-header with-border>\n                                <i class=\"fa fa-bar-chart-o\"></i><h3 class=\"box-title\">Data Table</h3>\n                                <div class=\"box-body\">\n                                    " + table + "\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ";
            return dataTable;
        };
        return RacesByDistance;
    }(Views.BaseView));
    Views.RacesByDistance = RacesByDistance;
})(Views || (Views = {}));
/// <reference path="./baseView.ts" />
var Views;
(function (Views) {
    var RacesByYear = (function (_super) {
        __extends(RacesByYear, _super);
        function RacesByYear(year) {
            var _this = _super.call(this) || this;
            _this.year = year;
            return _this;
        }
        RacesByYear.prototype.load = function () {
            var viewUrl = AppHelpers.getBaseUrl() + "/races/" + this.year;
            var navigationAnchor = $("a[id^=\"races-for-year-" + this.year + "\"]");
            _super.prototype.prepareView.call(this, viewUrl, 'Races', this.year, navigationAnchor);
            this.createViewTemplate();
            this.createView();
        };
        RacesByYear.prototype.createViewTemplate = function () {
            var mainContent = $('#main-content');
            mainContent.empty();
            // Create empty tables and charts with loading icon.
            var showLoadingIcon = true;
            var content = "\n                <div class=\"row\">\n                    " + ChartHelpers.constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6, showLoadingIcon) + "\n                    " + ChartHelpers.constructChartHtml('monthly-distribution-chart', 'Monthly Distribution Chart', 6, showLoadingIcon) + "\n                </div>\n                " + this.constructDataTableHtml() + "\n                <div class=\"row\">'\n                    " + ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon) + "\n                    " + ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon) + "\n                </div>\n            ";
            mainContent.append(content);
        };
        RacesByYear.prototype.createView = function () {
            var _this = this;
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + "/races/" + this.year,
                dataType: 'json',
                async: false,
                success: function (data) {
                    var items = [];
                    $.each(data, function (key, value) {
                        items.push(value);
                    });
                    // Create all tables and charts.
                    var mainContent = $('#main-content');
                    mainContent.empty();
                    var content = "\n                        <div class=\"row\">\n                            " + ChartHelpers.constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6) + "\n                            " + ChartHelpers.constructChartHtml('month-distribution-chart', 'Month Distribution Chart', 6) + "\n                        </div>\n                        " + _this.constructDataTableHtml(items) + "\n                        <div class=\"row\">\n                            " + ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6) + "\n                            " + ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6) + "\n                        </div>\n                    ";
                    mainContent.append(content);
                    // Setup all charts and tables.
                    ChartHelpers.createRaceDistancesChart('distances-distribution-chart', items);
                    ChartHelpers.createMonthDistributionChart('month-distribution-chart', items);
                    $('.dataTable').each(function () {
                        $(this).DataTable({
                            bFilter: false,
                            bPaginate: false,
                            iDisplayLength: 10,
                            info: false,
                            order: [
                                [0, 'desc'],
                            ]
                        });
                    });
                    ChartHelpers.createGearCountChart('gear-count-chart', items);
                    ChartHelpers.createGearMileageChart('gear-mileage-chart', items);
                }
            });
        };
        RacesByYear.prototype.constructDataTableHtml = function (items) {
            var table = HtmlHelpers.getLoadingIcon();
            if (items) {
                table = ''; // Set to empty.
                var distancesToDisplay_1 = [];
                var allDistances = [
                    '100 miles', '100k', '50 miles', '50k', 'Marathon', 'Half Marathon',
                    '20k', '15k', '10k', '5k', '3000m', '1 mile', 'Other',
                ]; // Just hard code race distances here. No need to get from server side for now.
                allDistances.forEach(function (distance) {
                    items.forEach(function (item, index) {
                        var raceDistance = items[index]['race_distance'];
                        if (distance === raceDistance && distancesToDisplay_1.indexOf(raceDistance) === -1) {
                            distancesToDisplay_1.push(raceDistance);
                        }
                    });
                });
                distancesToDisplay_1.forEach(function (distance) {
                    var rows = '';
                    items.forEach(function (item) {
                        if (distance === item['race_distance']) {
                            rows += HtmlHelpers.getDatatableRowForRaces(item);
                        }
                    });
                    table += "\n                        <h4>" + distance + "</h4>\n                        <table class=\"dataTable table table-bordered table-striped\">\n                            " + HtmlHelpers.getDatatableHeaderForRaces() + "\n                            <tbody>\n                                " + rows + "\n                            </tbody>\n                        </table>\n                    ";
                });
            }
            var dataTable = "\n                <div class=\"row\">\n                    <div class=\"col-xs-12\">\n                        <div class=\"box\">\n                            <div class=\"box-header with-border>\n                                <i class=\"fa fa-bar-chart-o\"></i><h3 class=\"box-title\">Data Table</h3>\n                                <div class=\"box-body\">\n                                    " + table + "\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ";
            return dataTable;
        };
        return RacesByYear;
    }(Views.BaseView));
    Views.RacesByYear = RacesByYear;
})(Views || (Views = {}));
/// <reference path="./baseView.ts" />
var Views;
(function (Views) {
    var RacesTimeline = (function (_super) {
        __extends(RacesTimeline, _super);
        function RacesTimeline() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RacesTimeline.prototype.load = function () {
            var viewUrl = AppHelpers.getBaseUrl() + '/timeline/races';
            _super.prototype.prepareView.call(this, viewUrl, 'Races Timeline');
            this.createViewTemplate();
            this.createView();
        };
        RacesTimeline.prototype.createViewTemplate = function () {
            var mainContent = $('#main-content');
            mainContent.empty(); // Empty main content.
            var content = "\n                <div class=\"row\">\n                    <div class=\"col-xs-12\">" + HtmlHelpers.getLoadingIcon() + "</div>\n                </div>\n            ";
            mainContent.append(content);
        };
        RacesTimeline.prototype.createView = function () {
            var _this = this;
            var content = HtmlHelpers.getNoDataInfoBox();
            var years = this.getRaceYears();
            if (years.length > 0) {
                var items_1 = '';
                years.forEach(function (year) {
                    items_1 += "\n                        <li class=\"time-label\">\n                            <span class=\"bg-strava\">" + year + "</span>\n                        </li>\n                        " + _this.createRacesTimelineForYear(year) + "\n                    ";
                });
                content = "\n                    <div class=\"col-xs-12 text-center\">\n                        <button class=\"btn btn-sm bg-strava hidden show-races-timeline\"> Show All Distances</button>\n                    </div>\n                    <div class=\"row\">\n                        <div class=\"col-xs-12\">\n                            <ul class=\"timeline\">\n                                " + items_1 + "\n                            </ul>\n                        </div>\n                    </div>\n                ";
            }
            var mainContent = $('#main-content');
            mainContent.empty();
            mainContent.append(content);
        };
        RacesTimeline.prototype.getRaceYears = function () {
            var years = [];
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + '/races/get_counts_by_year',
                dataType: 'json',
                async: false,
                success: function (data) {
                    $.each(data, function (key, value) {
                        var year = value['race_year'];
                        if ($.inArray(year, years) === -1) {
                            years.push(year);
                        }
                    });
                }
            });
            return years;
        };
        RacesTimeline.prototype.createRacesTimelineForYear = function (year) {
            var content = '';
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + '/races/' + year,
                dataType: 'json',
                async: false,
                success: function (data) {
                    var races = [];
                    $.each(data, function (key, value) {
                        races.push(value);
                    });
                    races.forEach(function (item) {
                        var stravaLink = "https://www.strava.com/activities/" + item['activity_id'];
                        var cadence = '';
                        if (item['cadence'] !== '') {
                            cadence = "\n                            <div class=\"activity-data\">\n                                <strong>Cadence: </strong>" + item['cadence'] + "\n                            </div>\n                        ";
                        }
                        content += "\n                            <li>\n                                <i class=\"fa fa-trophy\"></i>\n                                <div class=\"timeline-item race-distance-" + item['race_distance'].toLowerCase().replace(/\s/g, '-') + "\">\n                                    <span class=\"time\"><i class=\"fa fa-clock-o\"></i>" + item['start_date'] + "</span>\n                                    <h3 class=\"timeline-header\">\n                                        <a href=\"" + stravaLink + "\" target=\"_blank\">" + item['activity_name'] + "</a>\n                                        <span class=\"btn btn-xs race-distance-label\">" + item['race_distance'] + "</span>\n                                    </h3>\n                                    <div class=\"timeline-body\">\n                                        <div class=\"activity-data\">\n                                            <strong>Time: </strong>" + item['elapsed_time_formatted'] + "\n                                        </div>\n                                        <div class=\"activity-data\">\n                                            <strong>Pace: </strong>" + item['pace'] + "\n                                            <small>" + item['pace_unit'] + "</small>\n                                        </div>\n                                        <br />\n                                        <div class=\"activity-data\">\n                                            <strong>Elevation: </strong>" + item['elevation'] + "\n                                            <small>" + item['elevation_unit'] + "</small>\n                                        </div>\n                                        " + cadence + "\n                                        <br />\n                                        <div class=\"activity-data\">\n                                            <strong>Gear: </strong>" + item['gear_name'] + "\n                                        </div>\n                                    </div>\n                                </div>\n                            </li>\n                        ";
                    });
                }
            });
            return content;
        };
        return RacesTimeline;
    }(Views.BaseView));
    Views.RacesTimeline = RacesTimeline;
})(Views || (Views = {}));
//# sourceMappingURL=athletes.js.map