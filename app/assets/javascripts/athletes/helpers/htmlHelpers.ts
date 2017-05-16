namespace HtmlHelpers {

    export function getContributionWelcomeBadges() {
        const html = `
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

    export function getLoadingIcon() {
        const html = `
        <div class='loading-icon-panel text-center'>
            <button type='button' class='btn btn-default btn-lrg' title='Loading Data...'>
                <i class='fa fa-spin fa-refresh'></i>
            </button>
        </div>`;
        return html;
    }

    export function getNoDataInfoBox() {
        const title = 'Nothing Yet!';
        const link = 'https://support.strava.com/hc/en-us/articles/216919557-Using-Strava-Run-Type-Tags-to-analyze-your-Runs';
        const messageBody = `
        <p>
            If you have just connected Strafforts with your Strava account,
            please be patient while your data is being processed.
        </p>
        <p>
            To make your races show up in Strafforts, you need to tag them as "Race" in Strava.
            See <a href="${link}" target="_blank">"Using Strava Run Type Tags to analyze your Runs"</a>
            for more details.
        </p>`;

        const html = `
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

    export function getDatatableHeaderForBestEfforts() {
        const header = `
            <thead>
                <tr>
                    <th class="col-md-1">Date</th>
                    <th class="col-md-1 text-center badge-cell hidden-xs-down">Type</th>
                    <th class="col-md-4">Activity</th>
                    <th class="col-md-1">Time</th>
                    <th class="col-md-1 hidden-xs-down">Pace</th>
                    <th class="col-md-2 hidden-lg-down">Gear</th>
                    <th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
                    <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>
                </tr>
            </thead>
        `;
        return header;
    }

    export function getDatatableHeaderForRaces() {
        const header = `
            <thead>
                <tr>
                <th class="col-md-1">Date</th>
                <th class="col-md-3">Activity</th>
                <th class="col-md-1">Time</th>
                <th class="col-md-1 hidden-xs-down">Pace</th>
                <th class="col-md-2 hidden-lg-down">Gear</th>
                <th class="col-md-1 hidden-md-down">Elevation</th>
                <th class="col-md-1 hidden-md-down">Cadence</th>
                <th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
                <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>
                </tr>
            </thead>
        `;
        return header;
    }

    export function getDatatableRowForBestEfforts(item: any[]) {
        const row = `
            <tr>
                <td>${item['start_date']}</td>
                <td class="text-center badge-cell hidden-xs-down">
                    <span class="label workout-type-${item['workout_type_name'].replace(/ /g, '-')}">${item['workout_type_name']}</span>
                </td>
                <td>
                    <a class="strava-activity-link" href="https://www.strava.com/activities/${item['activity_id']}" target="_blank">
                        ${item['activity_name']}
                    </a>
                </td>
                <td>
                    ${item['elapsed_time_formatted']}
                </td>
                <td class="hidden-xs-down">
                    ${item['pace']}<small>${item['pace_unit']}</small>
                </td>
                <td class="hidden-lg-down">
                    ${item['gear_name']}
                </td>
                <td class="text-center badge-cell hidden-md-down">
                    <span class="badge ${item['average_hr_zone_class']}">
                        ${item['average_heartrate']}
                    </span>
                </td>
                <td class="text-center badge-cell hidden-md-down">
                    <span class="badge ${item['max_hr_zone_class']}">
                        ${item['max_heartrate']}
                    </span>
                </td>
            </tr>
        `;
        return row;
    }

    export function getDatatableRowForRaces(item: any[]) {
        const row = `
            <tr>
                <td>${item['start_date']}</td>
                <td>
                    <a class="strava-logo-link" href="https://www.strava.com/activities/${item['activity_id']}" target="_blank">
                        <span></span>
                    </a>
                    <a href="https://www.strava.com/activities/${item['activity_id']}" target="_blank">${item['activity_name']}</a>
                </td>
                <td>
                    ${item['elapsed_time_formatted']}
                </td>
                <td class="hidden-xs-down">
                    ${item['pace']}<small>${item['pace_unit']}</small>
                </td>
                <td class="hidden-lg-down">
                    ${item['gear_name']}
                </td>
                <td class="hidden-md-down">
                    ${item['elevation']}<small> ${item['elevation_unit']}</small>
                </td>
                <td class="hidden-md-down">
                    ${item['cadence']}
                </td>
                <td class="text-center badge-cell hidden-md-down">
                    <span class="badge ${item['average_hr_zone_class']}">
                        ${item['average_heartrate']}
                    </span>
                </td>
                <td class="text-center badge-cell hidden-md-down">
                    <span class="badge ${item['max_hr_zone_class']}">
                        ${item['max_heartrate']}
                    </span>
                </td>
            </tr>
        `;
        return row;
    }
}
