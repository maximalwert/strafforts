export namespace Toastr {

    export function getOptions(): ToastrOptions {
        const options = {
            debug: false,
            newestOnTop: true,
            progressBar: false,
            positionClass: 'toast-top-center',
            preventDuplicates: false,
            showDuration: 300,
            hideDuration: 1000,
            timeOut: 3000,
            extendedTimeOut: 5000,
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut',
        };
        return options;
    }
}
