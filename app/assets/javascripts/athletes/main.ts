/// <reference path="./../typings/hubspot-pace.d.ts" />
/// <reference path="./../typings/jquery.d.ts" />
/// <reference path="./../typings/toastr.d.ts" />
/// <reference path="./../common/googleAnalyticsHelpers.ts" />
/// <reference path="./../common/helpers.ts" />
/// <reference path="./bestEfforts.ts" />
/// <reference path="./charts.ts" />
/// <reference path="./overview.ts" />
/// <reference path="./races.ts" />

Pace.on('hide', function () {
  $('body').removeClass('page-loading').addClass('page-loaded');
});

$(document).ready(function() {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": 300,
    "hideDuration": 1000,
    "timeOut": 3000,
    "extendedTimeOut": 1000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  var bindGoogleAnalyticsEventTracking = function () {
    $(document).on("click", ".external", function() {
      let href = $(this).attr('href');
      GoogleAnalyticsHelpers.sendOutboundLinkClickingEvent(href);
    });
    $(document).on("click", ".logo", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Logo');
    });
    $(document).on("click", ".breadcrumb a", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Breadcrumb', this.textContent);
    });
    $(document).on("click", ".sidebar-toggle", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Navigation Sidebar');
    });
    $(document).on("click", ".sidebar-menu a[id^='best-efforts-for-'], .sidebar-menu a[id^='races-for-']", function() {
      var distance = $(this).find('.item-text')[0].textContent;
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Show Details', distance);
    });
    $(document).on("click", ".sidebar-menu .treeview-header", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select Navigation Header', this.textContent);
    });
    $(document).on("click", ".nav-tabs li", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Navigation Tabs', this.textContent);
    });
    $(document).on("click", ".box-header a", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Box Header Links', this.textContent);
    });
    $(document).on("click", ".notifications-menu .dropdown-toggle", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Notifications Menu');
    });
    $(document).on("click", ".user-menu .dropdown-toggle", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle User Menu');
    });
    $(document).on("click", ".user-menu .athlete-link", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Athlete Profile on Strava', $(this).attr('href'));
    });
    $(document).on("click", ".user-menu .athlete-following", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Athlete\'s Followings', $(this).attr('href'));
    });
    $(document).on("click", ".user-menu .athlete-follower", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Athlete\'s Followers', $(this).attr('href'));
    });
    $(document).on("click", ".control-sidebar-toggle", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Toggle Control Sidebar');
    });
    $(document).on("click", ".control-sidebar .nav-tabs a", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select Tab in Control Sidebar', $(this).attr('href'));
    });
    $(document).on("click", ".control-sidebar .sign-out", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Sign Out');
    });
    $(document).on("click", ".control-sidebar button", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Click Button in Control Sidebar', this.textContent);
    });
    $(document).on("click", ".control-sidebar .last-activity-retrieved", function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Last Activity Retrieved');
    });
    $('#main-content').delegate('.dataTables_wrapper .dataTables_filter input', 'click', function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Search DataTables');
    });
    $('#main-content').delegate('.dataTables_wrapper .paginate_button', 'click', function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Navigate DataTable Pages');
    });
    $('#main-content').delegate('.dataTables_wrapper .dataTables_length select', 'click', function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Select DataTable number of entries', this.value);
    });
    $('#main-content').delegate('.dataTables_wrapper .datatable thead th', 'click', function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Sort DataTable Column', this.textContent);
    });
    $('#main-content').delegate('.strava-activity-link', 'click', function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'View Activity on Strava');
    });
    $('#main-content').delegate('.timeline .race-distance-label', 'click', function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Filter Distance in Timeline', this.textContent);
    });
    $('#main-content').delegate('.show-races-timeline', 'click', function() {
      GoogleAnalyticsHelpers.sendEvent('Athletes', 'Show All Distances');
    });
  };

  var bindDetailViewLoadingEvents = function () {
    // Navigation sidebar click and double click handling.
    $(document).on("dblclick", ".main-header .logo, a[id^='best-effort-type-'], a[id^='race-distance-']", function(event) {
      event.preventDefault();
    });

    // Disable clicking for 'Estimated Best Efforts', 'Race by Distance' and 'Race by Year' treeview headers.
    $('.sidebar-menu .disabled').click(false);

    // Reload Overview page.
    $(document).on("click", ".show-overview", function() {
      loadOverviewPage(false);
    });

    // Load Races Overview upon clicking "Races" tab button if not yet created.
    $(document).on("click", "a[href^='#pane-races']", function() {
      if ($('#pane-races .loading-icon-panel').length) {
        createOverviewDatatable('races');
      }
    });

    // Load Races Timeline view.
    $(document).on("click", ".show-races-timeline", function() {
      loadRacesTimeline();
    });

    // Bind race distance selection buttons in Races Timeline view.
    $(document).on("click", ".race-distance-label", function() {
      var distance = $(this).text().toLowerCase().replace(/\s/g, '-');

      $('.timeline-item').parent().hide();
      $('.timeline-item.race-distance-' + distance).parent().fadeIn(800);
      $('#main-content .show-races-timeline').removeClass('hidden').fadeIn(800);
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

    // Append PR/Contributions welcome badges upon clicking settings toggle button.
    $(document).on("click", ".control-sidebar-toggle", function() {
      if (!$('.link-contributions-welcome').length) {
        var badges = '<p class="link-contributions-welcome">';
        badges += '<a href="https://github.com/yizeng/strafforts/blob/master/docs/development-guide.md" target="_blank">';
        badges += '<img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square" alt="Contributions Welcome">';
        badges += '</a>';
        badges += '<a href="https://github.com/yizeng/strafforts/pulls" target="_blank">';
        badges += '<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">';
        badges += '</a>';
        badges += '</p>';
        $('#control-sidebar-data-tab form').append(badges);
      }
    });
  };

  var bindSettingsSubmittingEvents = function () {
    // Save profile in settings.
    $(document).on("submit", ".form-save-profile", function(event) {
      event.preventDefault();
      var isPublicCheckbox: HTMLInputElement = <HTMLInputElement>$("#isPublic")[0];
      var isPublic = isPublicCheckbox.checked;
      var data = {
        is_public: isPublic
      };

      $.ajax({
        url: $(".form-save-profile").attr('action'),
        data: data,
        cache: false,
        type: "post",
        success: function() {
          toastr.success('Saved Successfully!');
        },
        error: function(xhr, ajaxOptions, thrownError) {
          toastr.error(xhr.status + '\n' + thrownError);
        }
      });
    });

    // Reset last activity retrieved in settings.
    $(document).on("submit", ".form-reset-last-activity-retrieved", function(event) {
      event.preventDefault();
      $.ajax({
        url: $(".form-reset-last-activity-retrieved").attr('action'),
        data: '',
        cache: false,
        type: "post",
        success: function() {
          toastr.success('Saved Successfully!');
          $('.last-activity-retrieved').addClass('hidden');
          $('.last-activity-na').removeClass('hidden');
        },
        error: function(xhr, ajaxOptions, thrownError) {
          toastr.error(xhr.status + '\n' + thrownError);
        }
      });
    });
  };

  bindGoogleAnalyticsEventTracking();
  bindDetailViewLoadingEvents();
  bindSettingsSubmittingEvents();
  loadOverviewPage();
});

function getBaseUrl(isApiCall?) {
  var athleteId = $("#athlete-id").text().trim();
  var urlPrefix = window.location.protocol + "//"
    + window.location.host
    + ((isApiCall || isApiCall !== undefined) ? "/api" : "") + "/athletes/" + athleteId;
  return urlPrefix;
}

function getApiBaseUrl() {
  return getBaseUrl(true);
}

function constructLoadingIconHtml() {
  var loadingIcon = "<div class='loading-icon-panel text-center'>";
  loadingIcon += "<button type='button' class='btn btn-default btn-lrg' title='Loading Data...'>";
  loadingIcon += "<i class='fa fa-spin fa-refresh'></i>";
  loadingIcon += "</button>";
  loadingIcon += "</div>";
  return loadingIcon;
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