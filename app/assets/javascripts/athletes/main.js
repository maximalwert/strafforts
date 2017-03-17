//= require plugins/datatables/jquery.dataTables.min
//= require plugins/datatables/dataTables.bootstrap.min
//= require moment.min
//= require Chart.min
//= require toastr.min
//= require plugins/fastclick/fastclick.min
//= require plugins/pace/pace.min
//= require plugins/slimScroll/jquery.slimscroll.min
//= require dist/js/app.min
//= require athletes/best-efforts
//= require athletes/overview
//= require athletes/races

$(document).ready(function() {
    var AdminLTEOptions = {
        //Bootstrap.js tooltip
        enableBSTooltip: true,
        BSTooltipSelector: "[data-toggle='tooltip']",
        enableFastclick: true,
        //Control Sidebar Options
        enableControlSidebar: true,
        controlSidebarOptions: {
            //Which button should trigger the open/close event
            toggleBtnSelector: "[data-toggle='control-sidebar']",
            //The sidebar selector
            selector: ".control-sidebar",
            //Enable slide over content
            slide: true
        }
    };

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    bindGoogleAnalyticsEventTracking();
    loadOverviewPage();
    bindDetailViewLoadingEvents();

    // Reload Overview page.
    $(document).on("click",".show-overview", function() {
        loadOverviewPage(false);
    });

    // Save profile in settings.
    $(".form-save-profile .submit-form").click(function() {
        var is_public = $("#is_public")[0].checked;
        var data = {
            is_public: is_public
        };

        $.ajax({
            url: $(".form-save-profile").attr('action'),
            data: data,
            cache: false,
            type: "post",
            success: function() {
                toastr.success('Saved successfully!');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                toastr.error(xhr.status + '\n' + thrownError);
            }
        });
    });

    // Reset last activity retrieved in settings.
    $(".form-reset-last-activity-retrieved .submit-form").click(function() {
        $.ajax({
            url: $(".form-reset-last-activity-retrieved").attr('action'),
            data: '',
            cache: false,
            type: "post",
            success: function() {
                toastr.success('Saved successfully!');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                toastr.error(xhr.status + '\n' + thrownError);
            }
        });
    });
});

function bindGoogleAnalyticsEventTracking() {
    $(document).on("click", ".external", function() {
        handleOutboundLinkClicks($(this).attr('href'));
    });
    $(document).on("click", ".logo", function() {
        sendGaEvent('Athletes', 'Click Logo');
    });
    $(document).on("click", ".breadcrumb a", function() {
        sendGaEvent('Athletes', 'Click Breadcrumb', this.textContent);
    });
    $(document).on("click", ".sidebar-toggle", function() {
        sendGaEvent('Athletes', 'Toggle Navigation Sidebar');
    });
    $(document).on("click", ".sidebar-menu a[id^='best-efforts-for-'], .sidebar-menu a[id^='races-for-']", function() {
        var distance = $(this).find('.item-text')[0].textContent;
        sendGaEvent('Athletes', 'Show Details', distance);
    });
    $(document).on("click", ".sidebar-menu .treeview-header", function() {
        sendGaEvent('Athletes', 'Select Navigation Header', this.textContent);
    });
    $(document).on("click", ".nav-tabs li", function() {
        sendGaEvent('Athletes', 'Click Navigation Tabs', this.textContent);
    });
    $(document).on("click", ".box-header a", function() {
        sendGaEvent('Athletes', 'Click Box Header Links', this.textContent);
    });
    $(document).on("click", ".notifications-menu .dropdown-toggle", function() {
        sendGaEvent('Athletes', 'Toggle Notifications Menu');
    });
    $(document).on("click", ".user-menu .dropdown-toggle", function() {
        sendGaEvent('Athletes', 'Toggle User Menu');
    });
    $(document).on("click", ".user-menu .athlete-link", function() {
        sendGaEvent('Athletes', 'View Athlete Profile on Strava', $(this).attr('href'));
    });
    $(document).on("click", ".user-menu .athlete-following", function() {
        sendGaEvent('Athletes', 'View Athlete\'s Followings', $(this).attr('href'));
    });
    $(document).on("click", ".user-menu .athlete-follower", function() {
        sendGaEvent('Athletes', 'View Athlete\'s Followers', $(this).attr('href'));
    });
    $(document).on("click", ".control-sidebar-toggle", function() {
        sendGaEvent('Athletes', 'Toggle Control Sidebar');
    });
    $(document).on("click", ".control-sidebar .nav-tabs a", function() {
        sendGaEvent('Athletes', 'Select Tab in Control Sidebar', $(this).attr('href'));
    });
    $(document).on("click", ".control-sidebar .sign-out", function() {
        sendGaEvent('Athletes', 'Sign Out');
    });
    $(document).on("click", ".control-sidebar button", function() {
        sendGaEvent('Athletes', 'Click Button in Control Sidebar', this.textContent);
    });
    $(document).on("click", ".control-sidebar .last_activity_retrieved", function() {
        sendGaEvent('Athletes', 'View Last Activity Retrieved');
    });
    $('#main-content').delegate('.dataTables_wrapper .dataTables_filter input', 'click', function() {
        sendGaEvent('Athletes', 'Search DataTables');
    });
    $('#main-content').delegate('.dataTables_wrapper .paginate_button', 'click', function() {
        sendGaEvent('Athletes', 'Navigate DataTable Pages');
    });
    $('#main-content').delegate('.dataTables_wrapper .dataTables_length select', 'click', function() {
        sendGaEvent('Athletes', 'Select DataTable number of entries', this.value);
    });
    $('#main-content').delegate('.dataTables_wrapper .datatable thead th', 'click', function() {
        sendGaEvent('Athletes', 'Sort DataTable Column', this.textContent);
    });
    $('#main-content').delegate('.strava-activity-link', 'click', function() {
        sendGaEvent('Athletes', 'View Activity on Strava');
    });
}

function constructLoadingIconHtml() {
    var loadingIcon = "<div class='loading-icon-panel text-center'>";
    loadingIcon += "<button type='button' class='btn btn-default btn-lrg' title='Loading Data...'>";
    loadingIcon += "<i class='fa fa-spin fa-refresh'></i>";
    loadingIcon += "</button>";
    loadingIcon += "</div>";
    return loadingIcon;
}

function createNoEnoughDataMessage(id) {
    var loadingIcon = "<div class='text-center'>";
    loadingIcon += "<h4>";
    loadingIcon += "Not Enough Data to Generate Chart";
    loadingIcon += "</h4>";
    loadingIcon += "</div>";

    var container = $("#" + id).parent();
    container.empty();
    container.append(loadingIcon);
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

function bindDetailViewLoadingEvents() {
    // Navigation sidebar click and double click handling.
    $(document).on("dblclick",".main-header .logo, a[id^='best-effort-type-'], a[id^='race-distance-']", function() {
        e.preventDefault();
    });
    $(document).on("click","a[id^='best-efforts-for-']", function() {
        var distance = $(this).find(".item-text").text();
        loadBestEffortsView(distance);
    });
    $(document).on("click","a[id^='races-for-distance']", function() {
        var distance = $(this).find(".item-text").text();
        loadRacesByDistanceView(distance);
    });
    $(document).on("click","a[id^='races-for-year']", function() {
        var year = $(this).find(".item-text").text();
        loadRacesByYearView(year);
    });
}

function resetNavigationItems() {
    $(".treeview-menu a").each(function() {
        $(this).parent().removeClass("active");
        $(this).children("i").removeClass("fa-check-circle-o");
        $(this).children("i").addClass("fa-circle-o");
    });
}

function setNavigationItem(anchor) {
    anchor.parent().addClass("active");
    anchor.children("i").removeClass("fa-circle-o");
    anchor.children("i").addClass("fa-check-circle-o");
}

function setContentHeader(headerText) {
    $(".content-header h1").text(headerText);
    $(".content-header .breadcrumb li.active").text(headerText);
}

function appendToPageTitle(content) {
    var pageTitle = document.title;
    var newTitle = pageTitle.substr(0, pageTitle.lastIndexOf(" | ")) + content;
    $(document).prop('title', newTitle);
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

        var gearLabels = Object.keys(gears);
        var gearCounts = [];
        for (var key in gears) {
            var value = gears[key];
            gearCounts.push(value);
        }

        var ctx = $("#" + id).get(0).getContext("2d");
        ctx.canvas.height = 300;

        var colors = getRgbColors();
        var data = {
            labels: gearLabels,
            datasets: [{
                data: gearCounts,
                backgroundColor: convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: convertToRgbaColors(colors, 1)
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
    } else {
        createNoEnoughDataMessage(id);
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
        for (var key in gears) {
            var mileage = gears[key] / 1000;
            gearMileages.push(mileage);
        }

        var ctx = $("#" + id).get(0).getContext("2d");
        ctx.canvas.height = 300;

        var colors = getRgbColors();
        var data = {
            labels: gearLabels,
            datasets: [{
                data: gearMileages,
                backgroundColor: convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: convertToRgbaColors(colors, 1)
            }]
        };

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
        createNoEnoughDataMessage(id);
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

        var monthNames = [];
        var xLabels = [];
        var counts = [];
        for (var key in months) {
            var value = parseInt(months[key]);
            xLabels.push(key + ' (' + value + ')');
            counts.push(value);
            monthNames.push(key);
        }

        var ctx = $("#" + id).get(0).getContext("2d");
        ctx.canvas.height = 300;

        var colors = getRgbColors();
        var data = {
            yLabels: counts,
            labels:  xLabels.reverse(),
            datasets: [{
                data: counts.reverse(),
                label: monthNames.reverse(),
                backgroundColor: convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: convertToRgbaColors(colors, 1)
            }]
        };

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
                            return 'Race Count: ' + tooltipItem.yLabel.toString();
                        }
                    }
                }
            }
        });
    } else {
        createNoEnoughDataMessage(id);
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

        var distances = [];
        var xLabels = [];
        var counts = [];
        for (var key in raceDistances) {
            var value = parseInt(raceDistances[key]);
            xLabels.push(key + ' (' + value + ')');
            counts.push(value);
            distances.push(key);
        }

        var ctx = $("#" + id).get(0).getContext("2d");
        ctx.canvas.height = 300;

        var colors = getRgbColors();
        var data = {
            yLabels: counts,
            labels:  xLabels.reverse(),
            datasets: [{
                data: counts.reverse(),
                label: distances.reverse(),
                backgroundColor: convertToRgbaColors(colors, 0.6),
                hoverBackgroundColor: convertToRgbaColors(colors, 1)
            }]
        };

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
                            return 'Race Count: ' + tooltipItem.yLabel.toString();
                        }
                    }
                }
            }
        });
    } else {
        createNoEnoughDataMessage(id);
    }
}