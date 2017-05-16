/// <reference path="./baseView.ts" />

namespace Views {

    export class RacesByYear extends BaseView {

        private year: string;

        constructor(year: string) {
            super();

            this.year = year;
        }

        load(): void {
            let viewUrl = `${AppHelpers.getBaseUrl()}/races/${this.year}`;
            let navigationAnchor = $(`a[id^="races-for-year-${this.year}"]`);
            super.prepareView(viewUrl, 'Races', this.year, navigationAnchor);

            this.createViewTemplate();
            this.createView();
        }

        protected createViewTemplate(): void {
            let mainContent = $('#main-content');
            mainContent.empty();

            // Create empty tables and charts with loading icon.
            let showLoadingIcon = true;
            let content = `
                <div class="row">
                    ${ChartHelpers.constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6, showLoadingIcon)}
                    ${ChartHelpers.constructChartHtml('monthly-distribution-chart', 'Monthly Distribution Chart', 6, showLoadingIcon)}
                </div>
                ${this.constructDataTableHtml()}
                <div class="row">'
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

                    let items: any[] = [];
                    $.each(data, (key, value) => {
                        items.push(value);
                    });

                    // Create all tables and charts.
                    let mainContent = $('#main-content');
                    mainContent.empty();

                    let showLoadingIcon = false;
                    let content = `
                        <div class="row">
                            ${ChartHelpers.constructChartHtml('distances-distribution-chart', 'Distance Distribution Chart', 6, showLoadingIcon)}
                            ${ChartHelpers.constructChartHtml('month-distribution-chart', 'Month Distribution Chart', 6, showLoadingIcon)}
                        </div>
                        ${this.constructDataTableHtml(items)}
                        <div class="row">
                            ${ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                            ${ChartHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon)}
                        </div>
                    `;
                    mainContent.append(content);

                    // Setup all charts and tables.
                    ChartHelpers.createRaceDistancesChart('distances-distribution-chart', items);
                    ChartHelpers.createMonthDistributionChart('month-distribution-chart', items);
                    $(".dataTable").each(function () {
                        $(this).DataTable({
                            'bFilter': false,
                            'bPaginate': false,
                            'iDisplayLength': 10,
                            'info': false,
                            'order': [
                                [0, 'desc']
                            ]
                        });
                    });
                    ChartHelpers.createGearCountChart('gear-count-chart', items);
                    ChartHelpers.createGearMileageChart('gear-mileage-chart', items);
                }
            });
        }

        protected constructDataTableHtml(items?: any[]): string {
            let table = HtmlHelpers.getLoadingIcon();

            if (items) {
                table = ''; // Set to empty.

                let distancesToDisplay: string[] = [];
                let allDistances = [
                    '100 miles', '100k', '50 miles', '50k', 'Marathon', 'Half Marathon',
                    '20k', '15k', '10k', '5k', '3000m', '1 mile', 'Other'
                ]; // Just hard code race distances here. No need to get from server side for now.
                allDistances.forEach((distance) => {
                    for (let index = 0; index < items.length; ++index) {
                        let raceDistance = items[index]["race_distance"];
                        if (distance === raceDistance && distancesToDisplay.indexOf(raceDistance) === -1) {
                            distancesToDisplay.push(raceDistance);
                            break;
                        }
                    }
                });

                distancesToDisplay.forEach(function (distance) {
                    let rows = '';
                    items.forEach(function (item) {
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
            };
            let dataTable = `
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