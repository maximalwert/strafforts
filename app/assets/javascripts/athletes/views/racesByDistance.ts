/// <reference path="./baseView.ts" />

namespace Views {

    export class RacesByDistance extends BaseView {

        private distance: string;

        private distanceFormattedForUrl: string;

        private isOtherDistance: boolean;

        constructor(distance: string) {
            super();

            this.distance = distance;
            this.isOtherDistance = distance.toLocaleLowerCase() === 'other';
            this.distanceFormattedForUrl = distance.trim().replace(/\//g, '|').replace(/\s/g, '-').toLowerCase();
        }

        public updateWindowState(): void {
            const viewUrl = `${AppHelpers.getBaseUrl()}?view=races&distance=${this.distanceFormattedForUrl}`;
            super.updateWindowState(viewUrl);
        }

        public load(): void {
            // Update again on purpose, so that browser's back button would never trigger state change again.
            this.updateWindowState();

            const distanceId = this.distance.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
            const navigationAnchor = $(`a[id^="races-for-distance-${distanceId}"]`);
            super.prepareView('Races', this.distance, navigationAnchor);

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
                    ${HtmlHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon)}
                    ${HtmlHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon)}
                </div>
                ${this.constructDataTableHtml()}
                <div class="row">
                    ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                    ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon)}
                </div>
                <div class="row">
                    ${HtmlHelpers.constructChartHtml('heart-rates-chart', 'Heart Rates Chart', 6, showLoadingIcon)}
                    ${HtmlHelpers.constructChartHtml('average-hr-zones-chart', 'Average HR Zones Distribution Chart', 6, showLoadingIcon)}
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
                            ${HtmlHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8)}
                            ${HtmlHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4)}
                        </div>
                        ${this.constructDataTableHtml(items)}
                        <div class="row">
                            ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6)}
                            ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6)}
                        </div>
                        <div class="row">
                            ${HtmlHelpers.constructChartHtml('heart-rates-chart', 'Heart Rates Chart', 6)}
                            ${HtmlHelpers.constructChartHtml('average-hr-zones-chart', 'Average HR Zones Distribution Chart', 6)}
                        </div>
                    `;
                    mainContent.append(content);

                    // Create a progression chart when distance is not 'Other'.
                    const chartCreator = new Helpers.ChartCreator(items);
                    const progressionChartId = 'progression-chart';
                    if (this.isOtherDistance) {
                        chartCreator.createChartWithMessage(progressionChartId, 'Not Applicable');
                    } else {
                        chartCreator.createProgressionChart(progressionChartId);
                    }

                    // Setup all other charts and tables.
                    chartCreator.createYearDistributionChart('year-distribution-pie-chart');
                    $('.dataTable').each(function() {
                        ($(this) as any).DataTable({
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
                    chartCreator.createGearCountChart('gear-count-chart');
                    chartCreator.createGearMileageChart('gear-mileage-chart');
                    chartCreator.createHeartRatesChart('heart-rates-chart');
                    chartCreator.createAverageHrZonesChart('average-hr-zones-chart');
                },
            });
        }

        protected constructDataTableHtml(items?: any[]): string {
            let table = HtmlHelpers.getLoadingIcon();

            if (items) {
                let rows = '';
                items.forEach((item) => {
                    rows += HtmlHelpers.getDatatableRowForRaces(item, this.isOtherDistance);
                });

                table = `
                    <table class="dataTable table table-bordered table-striped">
                        ${HtmlHelpers.getDatatableHeaderForRaces(this.isOtherDistance)}
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
                            </div>
                            <div class="box-body">
                                ${table}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            return dataTable;
        }
    }
}
