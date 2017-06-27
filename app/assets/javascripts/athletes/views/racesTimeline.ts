/// <reference path="./baseView.ts" />

namespace Views {

    export class RacesTimeline extends BaseView {

        private static distances: string[] = [];

        public load(): void {
            const viewUrl = `${AppHelpers.getBaseUrl()}?view=timeline&type=races`;
            super.prepareView(viewUrl, 'Races Timeline');

            this.createViewTemplate();
            this.createView();
        }

        protected createViewTemplate(): void {
            const mainContent = $('#main-content');
            mainContent.empty(); // Empty main content.

            const content = `
                <div class="row">
                    <div class="col-xs-12">${HtmlHelpers.getLoadingIcon()}</div>
                </div>
            `;
            mainContent.append(content);
        }

        protected createView(): void {
            let content = HtmlHelpers.getNoDataInfoBox();

            const years = this.getRaceYears();
            if (years.length > 0) {
                let yearsFilterButtons = '';
                let items = '';
                years.forEach((year) => {
                    yearsFilterButtons += `
                        <button class="btn btn-md btn-race-year" data-race-year="${year}">${year}</button>
                    `;
                    items += `
                        <li class="time-label" data-race-year="${year}">
                            <span class="bg-strava">${year}</span>
                        </li>
                        ${this.createRacesTimelineForYear(year)}
                    `;
                });

                let distancesFilterButtons = '';
                RacesTimeline.distances.forEach((distanceText) => {
                    distancesFilterButtons += `
                        <button class="btn btn-md btn-race-distance" data-race-distance="${distanceText}">${distanceText}</button>
                    `;
                });

                content = `
                    <div class="timeline-wrapper">
                        <div class="col-xs-12 text-center filter-buttons">
                            <button class="btn btn-md hidden show-races-timeline show-all">Show All</button>
                            ${yearsFilterButtons}
                            ${distancesFilterButtons}
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <ul class="timeline">
                                    ${items}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            }

            const mainContent = $('#main-content');
            mainContent.empty();
            mainContent.append(content);
        }

        protected getRaceYears(): number[] {
            const years: number[] = [];
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + '/races/get_counts_by_year',
                dataType: 'json',
                async: false,
                success: (data) => {
                    $.each(data, (key, value) => {
                        const year = value['race_year'];
                        if ($.inArray(year, years) === -1) {
                            years.push(year);
                        }
                    });
                },
            });
            return years;
        }

        protected createRacesTimelineForYear(year: number): string {
            let content = '';
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + '/races/' + year,
                dataType: 'json',
                async: false,
                success: (data) => {
                    const races: any[] = [];
                    $.each(data, (key, value) => {
                        races.push(value);
                    });
                    races.forEach((item) => {
                        const stravaLink = `https://www.strava.com/activities/${item['activity_id']}`;
                        const distance = item['race_distance'];

                        if (RacesTimeline.distances.indexOf(distance) === -1) {
                            RacesTimeline.distances.push(distance);
                        }

                        let cadence = '';
                        if (item['cadence'] !== '') {
                            cadence = `
                            <div class="activity-data">
                                <strong>Cadence: </strong>${item['cadence']}
                            </div>
                        `;
                        }

                        content += `
                            <li>
                                <i class="fa fa-trophy"></i>
                                <div class="timeline-item" data-race-distance="${distance}" data-race-year="${year}">
                                    <span class="time"><i class="fa fa-clock-o"></i>${item['start_date']}</span>
                                    <h3 class="timeline-header">
                                        <a class="strava-activity-link" href="${stravaLink}" target="_blank">
                                            ${item['activity_name']}
                                        </a>
                                        <span class="btn btn-xs" data-race-distance="${distance}">${distance}</span>
                                    </h3>
                                    <div class="timeline-body">
                                        <div class="activity-data">
                                            <strong>Time: </strong>${item['elapsed_time_formatted']}
                                        </div>
                                        <div class="activity-data">
                                            <strong>Pace: </strong>${item['pace']}
                                            <small>${item['pace_unit']}</small>
                                        </div>
                                        <br />
                                        <div class="activity-data">
                                            <strong>Elevation: </strong>${item['elevation']}
                                            <small>${item['elevation_unit']}</small>
                                        </div>
                                        ${cadence}
                                        <br />
                                        <div class="activity-data">
                                            <strong>Gear: </strong>${item['gear_name']}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        `;
                    });
                },
            });
            return content;
        }
    }
}
