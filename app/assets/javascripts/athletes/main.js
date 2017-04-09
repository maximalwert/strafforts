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
//= require athletes/charts
//= require athletes/overview
//= require athletes/races

Pace.on('hide', function () {
    $('body').removeClass('page-loading').addClass('page-loaded');
});

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
    $(document).on("click", ".show-overview", function() {
        loadOverviewPage(false);
    });

    // Load Races Timeline view.
    $(document).on("click", ".show-races-timeline", function() {
        loadRacesTimeline();
    });

    // Save profile in settings.
    $(document).on("click", ".form-save-profile .submit-form", function() {
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
    $(document).on("click", ".form-reset-last-activity-retrieved .submit-form", function() {
        $('.last-activity-na').show();
        $('.last-activity-retrieved').show();
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

function getBaseUrl(isApiCall) {
    var athleteId = $("#athlete-id").text().trim();
    var urlPrefix = window.location.protocol + "//" + window.location.host + (isApiCall ? "/api" : "") + "/athletes/" + athleteId;
    return urlPrefix;
}

function getApiBaseUrl() {
    return getBaseUrl(true);
}

function pushStateToWindow(url) {
    window.history.pushState({}, "", url);
}

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
    $(document).on("click", ".control-sidebar .last-activity-retrieved", function() {
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

function bindDetailViewLoadingEvents() {
    // Navigation sidebar click and double click handling.
    $(document).on("dblclick", ".main-header .logo, a[id^='best-effort-type-'], a[id^='race-distance-']", function() {
        e.preventDefault();
    });
    $(document).on("click", "a[id^='best-efforts-for-']", function() {
        var distance = $(this).find(".item-text").text();
        loadBestEffortsView(distance);
    });
    $(document).on("click", "a[id^='races-for-distance']", function() {
        var distance = $(this).find(".item-text").text();
        loadRacesByDistanceView(distance);
    });
    $(document).on("click", "a[id^='races-for-year']", function() {
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
