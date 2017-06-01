/// <reference path="./baseView.ts" />

namespace Views {

    export class RacesByDistance extends BaseView {

        private distance: string;

        private distanceFormattedForUrl: string;

        constructor(distance: string) {
            super();

            this.distance = distance;
            this.distanceFormattedForUrl = distance.trim().replace(/\//g, '|').replace(/\s/g, '-').toLowerCase();
        }

        public load(): void {
            const viewUrl = `${AppHelpers.getBaseUrl()}/races/${this.distanceFormattedForUrl}`;
            const distanceId = this.distance.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
            const navigationAnchor = $(`a[id^="races-for-distance-${distanceId}"]`);
            super.prepareView(viewUrl, 'Races', this.distance, navigationAnchor);

            this.createViewTemplate();
            this.createView();
        }

        protected createViewTemplate(): void {
            const mainContent = $('#main-content');
            mainContent.empty();

            // Create empty tables and charts with loading icon.
            const showLoadingIcon = true;
            const content = `
                <div class="row">
                    ${ChartHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon)}
                    ${ChartHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon)}
                </div>
                ${this.constructDataTableHtml()}
                <div class="row">
                    ${ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                    ${ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon)}
                </div>
            `;
            mainContent.append(content);
        }

        protected createView(): void {
            $.ajax({
                url: `${AppHelpers.getApiBaseUrl()}/races/${this.distanceFormattedForUrl}`,
                dataType: 'json',
                async: false,
                success: (data) => {

                    const items: any[] = [];
                    $.each(data, (key, value) => {
                        items.push(value);
                    });

                    // Create all tables and charts.
                    const mainContent = $('#main-content');
                    mainContent.empty();

                    const content = `
                        <div class="row">
                            ${ChartHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8)}
                            ${ChartHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4)}
                        </div>
                        ${this.constructDataTableHtml(items)}
                        <div class="row">
                            ${ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6)}
                            ${ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6)}
                        </div>
                    `;
                    mainContent.append(content);

                    // Create a progression chart when distance is not 'Other'.
                    const progressionChartId = 'progression-chart';
                    if (this.distance === 'Other') {
                        ChartHelpers.createChartMessage(progressionChartId, 'Not Applicable');
                    } else {
                        ChartHelpers.createProgressionChart(progressionChartId, items);
                    }

                    // Setup all other charts and tables.
                    ChartHelpers.createYearDistributionChart('year-distribution-pie-chart', items);
                    $('.dataTable').each(function() {
                        $(this).DataTable({
                            columnDefs: [{
                                targets: [2, 3, 5, 6, 7, 8], // Disable searching for Time, Pace, Elevation, Cadence and HRs.
                                searchable: false,
                            }],
                            iDisplayLength: 10,
                            order: [
                                [0, 'desc'],
                            ],
                        });
                    });
                    ChartHelpers.createGearCountChart('gear-count-chart', items);
                    ChartHelpers.createGearMileageChart('gear-mileage-chart', items);
                },
            });
        }

        protected constructDataTableHtml(items?: any[]): string {
            let table = HtmlHelpers.getLoadingIcon();

            if (items) {
                let rows = '';
                items.forEach((item) => {
                    rows += HtmlHelpers.getDatatableRowForRaces(item);
                });

                table = `
                    <table class="dataTable table table-bordered table-striped">
                        ${HtmlHelpers.getDatatableHeaderForRaces()}
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                `;
            }

            const dataTable = `
                <div class="row">
                    <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header with-border>
                                <i class="fa fa-bar-chart-o"></i><h3 class="box-title">Data Table</h3>
                                <div class="box-body">
                                    ${table}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            return dataTable;
        }
    }
}
