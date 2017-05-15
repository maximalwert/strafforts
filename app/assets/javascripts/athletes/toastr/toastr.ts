namespace Toastr {
    export function getOptions() {
        let options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': true,
            'progressBar': false,
            'positionClass': 'toast-top-center',
            'preventDuplicates': false,
            'onclick': null,
            'showDuration': 300,
            'hideDuration': 1000,
            'timeOut': 3000,
            'extendedTimeOut': 1000,
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
        return options;
    }
}
