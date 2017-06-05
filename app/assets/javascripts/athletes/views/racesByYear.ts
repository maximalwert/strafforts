/// <reference path="./baseView.ts" />

namespace Views {

    export class RacesByYear extends BaseView {

        private year: string;

        constructor(year: string) {
            super();

            this.year = year;
        }

        public load(): void {
            const viewUrl = `${AppHelpers.getBaseUrl()}/races/${this.year}`;
            const navigationAnchor = $(`a[id^="races-for-year-${this.year}"]`);
            super.prepareView(viewUrl, 'Races', this.year, navigationAnchor);

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
                    ${ChartHelpers.constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6, showLoadingIcon)}
                    ${ChartHelpers.constructChartHtml('monthly-distribution-chart', 'Monthly Distribution Chart', 6, showLoadingIcon)}
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
                url: `${AppHelpers.getApiBaseUrl()}/races/${this.year}`,
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
                            ${ChartHelpers.constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6)}
                            ${ChartHelpers.constructChartHtml('month-distribution-chart', 'Month Distribution Chart', 6)}
                        </div>
                        ${this.constructDataTableHtml(items)}
                        <div class="row">
                            ${ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6)}
                            ${ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6)}
                        </div>
                    `;
                    mainContent.append(content);

                    // Setup all charts and tables.
                    ChartHelpers.createRaceDistancesChart('distances-distribution-chart', items);
                    ChartHelpers.createMonthDistributionChart('month-distribution-chart', items);
                    $('.dataTable').each(function() {
                        $(this).DataTable({
                            bFilter: false,
                            bPaginate: false,
                            iDisplayLength: 10,
                            info: false,
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
                table = ''; // Set to empty.

                const distancesToDisplay: string[] = [];
                const allDistances = [
                    '100 miles', '100k', '50 miles', '50k', 'Marathon', 'Half Marathon',
                    '20k', '15k', '10k', '5k', '3000m', '1 mile', 'Other',
                ]; // Just hard code race distances here. No need to get from server side for now.
                allDistances.forEach((distance) => {
                    items.forEach((item, index) => {
                        const raceDistance = items[index]['race_distance'];
                        if (distance === raceDistance && distancesToDisplay.indexOf(raceDistance) === -1) {
                            distancesToDisplay.push(raceDistance);
                        }
                    });
                });

                distancesToDisplay.forEach((distance) => {
                    let rows = '';
                    items.forEach((item) => {
                        if (distance === item['race_distance']) {
                            rows += HtmlHelpers.getDatatableRowForRaces(item);
                        }
                    });

                    table += `
                        <h4>${distance}</h4>
                        <table class="dataTable table table-bordered table-striped">
                            ${HtmlHelpers.getDatatableHeaderForRaces()}
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    `;
                });
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
