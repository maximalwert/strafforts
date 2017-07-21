/// <reference path="./baseView.ts" />

namespace Views {
    export class Overview extends BaseView {

        public load(): void {
            const viewUrl = AppHelpers.getBaseUrl();
            super.updateWindowState(viewUrl);
            super.prepareView('Overview');

            this.createViewTemplate();
            this.createView();
        }

        public loadRacesPanel(): void {
            this.createOverviewDatatable('races');
        }

        protected createViewTemplate(): void {
            const mainContent = $('#main-content');
            mainContent.empty(); // Empty main content.

            const content = `
            <div class="row">
                <div class="col-xs-12">
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a href="#pane-best-efforts" data-toggle="tab">Best Efforts</a>
                            </li>
                            <li>
                                <a href="#pane-races" data-toggle="tab">Races</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="pane-best-efforts">${HtmlHelpers.getLoadingIcon()}</div>
                            <div class="tab-pane" id="pane-races">${HtmlHelpers.getLoadingIcon()}</div>
                        </div>
                    </div>
                </div>
            </div>`;
            mainContent.append(content);
        }

        protected createView(): void {
            this.createOverviewDatatable('best-efforts');
        }

        private createOverviewDatatable(type: string) {
            const fullUrl = AppHelpers.getApiBaseUrl() + '/' + type;
            $.ajax({
                url: fullUrl,
                dataType: 'json',
                async: false,
                success: (data) => {
                    const distances: object[] = [];
                    $.each(data, (key, value) => {
                        const model: object = {
                            distance: key,
                            items: value,
                        };
                        distances.push(model);
                    });

                    const pane = $('#pane-' + type);
                    pane.empty();

                    if (distances.length === 0) {
                        const infoBox = HtmlHelpers.getNoDataInfoBox();
                        pane.append(infoBox);
                    } else {
                        distances.forEach((model: any[]) => {
                            const distanceId = model['distance'].toLowerCase().replace(/\s/g, '-').replace(/\//g, '-');
                            const linkId = `${type}-for-distance-${distanceId}`;

                            let rows = '';
                            model['items'].forEach((item: any[]) => {
                                const stravaLink = `https://www.strava.com/activities/${item['activity_id']}`;
                                rows += `
                                <tr>
                                    <td>${item['start_date']}</td>
                                    <td class="text-center badge-cell hidden-md-down">
                                        <span class="label workout-type-${item['workout_type_name'].replace(/\s/g, '-')}">
                                            ${item['workout_type_name']}
                                        </span>
                                    </td>
                                    <td>
                                        <a class="strava-activity-link" href="${stravaLink}" target="_blank">
                                            ${item['activity_name']}
                                        </a>
                                    </td>
                                    <td>${item['elapsed_time_formatted']}</td>
                                    <td class="hidden-xs-down">
                                        ${item['pace']}<small>${item['pace_unit']}</small>
                                    </td>
                                    <td class="hidden-lg-down">${item['gear_name']}</td>
                                    <td class='text-center badge-cell hidden-md-down'>
                                        <span class="badge hr-zone-${item['average_hr_zone']}">
                                            ${item['average_heartrate'] === -1 ? 'n/a' : item['average_heartrate']}
                                        </span>
                                    </td>
                                    <td class='text-center badge-cell hidden-md-down'>
                                        <span class="badge hr-zone-${item['max_hr_zone']}">
                                            ${item['max_heartrate'] === -1 ? 'n/a' : item['max_heartrate']}
                                        </span>
                                    </td>
                                </tr>`;
                            });

                            const table = `
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title">
                                        ${model['distance']}
                                    </h3>
                                    <a class="pull-right" id="${linkId}" href="#" title="${model['distance']}">
                                        <small> View Details</small>
                                        <span class="item-text hidden">
                                            ${model['distance']}
                                        </span>
                                    </a>
                                </div>
                                <div class="box-body">
                                    <table class="dataTable table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th class="col-md-1">Date</th>
                                                <th class="col-md-1 text-center badge-cell hidden-md-down">Type</th>
                                                <th class="col-md-4">Activity</th>
                                                <th class="col-md-1">Time</th>
                                                <th class="col-md-1 hidden-xs-down">Pace</th>
                                                <th class="col-md-2 hidden-lg-down">Gear</th>
                                                <th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
                                                <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${rows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>`;
                            pane.append(table);
                        });
                    }
                },
            });
        }
    }
}
