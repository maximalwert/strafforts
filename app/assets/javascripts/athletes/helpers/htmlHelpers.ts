namespace HtmlHelpers {

    export function getContributionWelcomeBadges() {
        let html = `
        <p class="link-contributions-welcome">
            <a href="https://github.com/yizeng/strafforts/blob/master/docs/development-guide.md" target="_blank">
                <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square" alt="Contributions Welcome">
            </a>
            <a href="https://github.com/yizeng/strafforts/pulls" target="_blank">
                <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
            </a>
        </p>`;
        return html;
    }

    export function getLoadingIconHtml() {
        let html = `
        <div class='loading-icon-panel text-center'>
            <button type='button' class='btn btn-default btn-lrg' title='Loading Data...'>
                <i class='fa fa-spin fa-refresh'></i>
            </button>
        </div>`;
        return html;
    }

    export function getNoDataInfoBox() {
        let title = 'Nothing Yet!';
        let messageBody = `
        <p>
            If you have just connected Strafforts with your Strava account,
            please be patient while your data is being processed.
        </p>
        <p>
            To make your races show up in Strafforts, you need to tag them as "Race" in Strava.
            See <a href="https://support.strava.com/hc/en-us/articles/216919557-Using-Strava-Run-Type-Tags-to-analyze-your-Runs" target="_blank">
            "Using Strava Run Type Tags to analyze your Runs"</a>
            for more details.
        </p>`;

        let html = `
        <div class="notification-alert">
            <div class="modal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">${title}</h3>
                        </div>
                        <div class="modal-body">
                            ${messageBody}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        return html;
    }
}