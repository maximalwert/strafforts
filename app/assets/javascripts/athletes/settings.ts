namespace Settings {

    export function bindEvents() {
        let eventBinders = () => {
            $(document).on('submit', '.form-save-profile', (event) => {
                saveProfile(event);
            });
            $(document).on('submit', '.form-reset-last-activity-retrieved', (event) => {
                resetLastRetrieveActivity(event);
            });
        };
        return eventBinders;
    }

    function saveProfile(event: JQueryEventObject) {
        event.preventDefault();

        let isPublicCheckbox: HTMLInputElement = <HTMLInputElement>$("#is_public")[0];
        let isPublic = isPublicCheckbox.checked;
        let data = {
            is_public: isPublic
        };

        $.ajax({
            url: $('.form-save-profile').attr('action'),
            data: data,
            cache: false,
            type: 'post',
            success: () => {
                toastr.success('Saved Successfully!');
            },
            error: (xhr, ajaxOptions, thrownError) => {
                toastr.error(xhr.status + '\n' + thrownError);
            }
        });
    }

    function resetLastRetrieveActivity(event: JQueryEventObject) {
        event.preventDefault();

        $.ajax({
            url: $('.form-reset-last-activity-retrieved').attr('action'),
            data: '',
            cache: false,
            type: 'post',
            success: () => {
                toastr.success('Saved Successfully!');
                $('.last-activity-retrieved').addClass('hidden');
                $('.last-activity-na').removeClass('hidden');
            },
            error: (xhr, ajaxOptions, thrownError) => {
                toastr.error(xhr.status + '\n' + thrownError);
            }
        });
    }
}