//= require dist/js/app.min

//= require plugins/datatables/jquery.dataTables.min
//= require plugins/datatables/dataTables.bootstrap.min
//= require plugins/fastclick/fastclick.min
//= require plugins/pace/pace.min
//= require plugins/slimScroll/jquery.slimscroll.min

//= require moment.min
//= require Chart.min
//= require toastr/toastr.min

//= require generated/athletes.js

// Extension method to convert a number into time format.
String.prototype.toHHMMSS = function() {
    var sec_num = parseInt(this, 10); // Don't forget the second param.
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

var AdminLTEOptions = {
    // Bootstrap.js tooltip.
    enableBSTooltip: true,
    BSTooltipSelector: "[data-toggle='tooltip']",
    enableFastclick: true,
    // Control Sidebar Options.
    enableControlSidebar: true,
    controlSidebarOptions: {
        // Which button should trigger the open/close event.
        toggleBtnSelector: "[data-toggle='control-sidebar']",
        // The sidebar selector.
        selector: ".control-sidebar",
        // Enable slide over content.
        slide: false
    }
};