export namespace HtmlHelpers {

    export function constructChartHtml(id: string, title: string, width: number, withLoadingIcon: boolean = false) {
        const canvas = `<canvas id="${id}-canvas" height="300"></canvas>`;
        const content = withLoadingIcon ? HtmlHelpers.getLoadingIcon() : canvas;
        const chart = `
            <div class="col-md-${width}">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">${title}</h3>
                    </div>
                    <div class="box-body">
                        <div id=${id} class="chart">
                            ${content}
                        </div>
                    </div>
                </div>
            </div>
        `;
        return chart;
    }

    export function getContributionWelcomeBadges() {
        const html = `
        <p>If you are a techie and would like to help out...</p>
        <p class="link-contributions-welcome">
            <a href="https://github.com/yizeng/strafforts/blob/master/docs/development-guide.md" target="_blank">
                <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square"
                    alt="Contributions Welcome">
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
            <span title='Loading Data...'><i class='fa fa-spin fa-refresh'></i></span>
        </div>`;
        return html;
    }

    export function getNoDataInfoBox() {
        const title = 'Nothing Yet!';
        const link = 'https://support.strava.com/hc/en-us/articles/'
            + '216919557-Using-Strava-Run-Type-Tags-to-analyze-your-Runs';
        const supportEmail = 'support@strafforts.com';
        const messageBody = `
        <h4>If Just Connected...</h4>
        <p>
            Please be patient while the data is being processed. It should normally take only a few minutes.
            Go grab a cup of tea then come back and refresh the page.
        </p>
        <h4>Troubleshooting...</h4>
        <p>
            In the situation that the data doesn't come through for some reason,
            please follow these steps to troubleshoot:
            <ol>
                <li>Check if there are any running activities for this athlete on Strava.</li>
                <li>
                    For PBs/PRs, check if there are any gold trophies like 'Best Estimated 10k Effort' on any of your
                    Strava activities.
                </li>
                <li>
                    For races, make sure there are activities tagged as 'Race' on Strava.
                    See <a href="${link}" target="_blank">"Using Strava Run Type Tags to analyze your Runs"</a>
                    for more details.
                </li>
                <li>
                    Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
                    with the Strava athlete ID (and links to those activities on Strava).</li>
            </ol>
        </p>`;

        const html = `
        <div class="notification-alert">
            <div class="modal">
                <div class="modal-dialog modal-lg">
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
        return createDatatableHeaderForBestEffortsOrPbs(false);
    }

    export function getDatatableHeaderForPersonalBests() {
        return createDatatableHeaderForBestEffortsOrPbs(true);
    }

    export function getDatatableHeaderForRaces(showDistanceColumn?: boolean) {
        const distanceColumn = showDistanceColumn ? `<th class="col-md-1">Distance</th>` : '';
        const gearColumnWidth = showDistanceColumn ? '1' : '2';
        const header = `
            <thead>
                <tr>
                <th class="col-md-1">Date</th>
                <th class="col-md-3">Activity</th>
                ${distanceColumn}
                <th class="col-md-1">Time</th>
                <th class="col-md-1 hidden-xs-down">Pace</th>
                <th class="col-md-${gearColumnWidth} hidden-lg-down">Gear</th>
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
        return createDatatableRowForBestEffortsOrPbs(item, false);
    }

    export function getDatatableRowForPersonalBests(item: any[]) {
        return createDatatableRowForBestEffortsOrPbs(item, true);
    }

    export function getDatatableRowForRaces(item: any[], showDistanceColumn?: boolean) {
        const stravaLink = `https://www.strava.com/activities/${item['activity_id']}`;
        const distanceColumn = showDistanceColumn ?
            `<td>${(item['distance']).toFixed(1)} ${item['distance_unit']}</td>` : '';
        const row = `
            <tr>
                <td class="no-wrap">${item['start_date']}</td>
                <td>
                    <a class="strava-logo-link hidden-lg-down" href="${stravaLink}" target="_blank">
                        <span></span>
                    </a>
                    <a class="strava-activity-link" href="${stravaLink}" target="_blank">
                        ${item['activity_name']}
                    </a>
                </td>
                ${distanceColumn}
                <td class="no-wrap">
                    ${item['elapsed_time_formatted']}
                </td>
                <td class="hidden-xs-down" data-sort="${item['pace_in_seconds']}">
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
                    <span class="badge hr-zone-${item['average_hr_zone']}">
                        ${item['average_heartrate'] === -1 ? 'n/a' : item['average_heartrate']}
                    </span>
                </td>
                <td class="text-center badge-cell hidden-md-down">
                    <span class="badge hr-zone-${item['max_hr_zone']}">
                        ${item['max_heartrate'] === -1 ? 'n/a' : item['max_heartrate']}
                    </span>
                </td>
            </tr>
        `;
        return row;
    }

    function createDatatableHeaderForBestEffortsOrPbs(showHrColumns: boolean) {
        const hrColumns = showHrColumns ?
            `<th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
            <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>` : '';
        const header = `
            <thead>
                <tr>
                    <th class="col-md-1">Date</th>
                    <th class="col-md-1 text-center badge-cell hidden-xs-down">Type</th>
                    <th class="col-md-4">Activity</th>
                    <th class="col-md-1">Time</th>
                    <th class="col-md-1 hidden-xs-down">Pace</th>
                    <th class="col-md-2 hidden-lg-down">Gear</th>
                    ${hrColumns}
                </tr>
            </thead>
        `;
        return header;
    }

    function createDatatableRowForBestEffortsOrPbs(item: any[], showHrColumns: boolean) {
        const stravaLink = `https://www.strava.com/activities/${item['activity_id']}`;
        const workoutTypeNameClass = `workout-type-${item['workout_type_name'].replace(/\s/g, '-')}`;
        const hrColumns = showHrColumns ?
            `<td class="text-center badge-cell hidden-md-down">
                <span class="badge hr-zone-${item['average_hr_zone']}">
                    ${item['average_heartrate'] === -1 ? 'n/a' : item['average_heartrate']}
                </span>
            </td>
            <td class="text-center badge-cell hidden-md-down">
                <span class="badge hr-zone-${item['max_hr_zone']}">
                    ${item['max_heartrate'] === -1 ? 'n/a' : item['max_heartrate']}
                </span>
            </td>` : '';
        const row = `
            <tr>
                <td class="no-wrap">${item['start_date']}</td>
                <td class="text-center badge-cell hidden-xs-down">
                    <span class="label ${workoutTypeNameClass}">${item['workout_type_name']}</span>
                </td>
                <td>
                    <a class="strava-activity-link" href="${stravaLink}" target="_blank">
                        ${item['activity_name']}
                    </a>
                </td>
                <td class="no-wrap">
                    ${item['elapsed_time_formatted']}
                </td>
                <td class="hidden-xs-down" data-sort="${item['pace_in_seconds']}">
                    ${item['pace']}<small>${item['pace_unit']}</small>
                </td>
                <td class="hidden-lg-down">
                    ${item['gear_name']}
                </td>
                ${hrColumns}
            </tr>
        `;
        return row;
    }
}
