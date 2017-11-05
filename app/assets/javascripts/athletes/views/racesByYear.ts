/// <reference path="./baseView.ts" />

namespace Views {

    export class RacesByYear extends BaseView {

        private year: string;

        constructor(year: string) {
            super();

            this.year = year;
        }

        public load(): void {
            const navigationAnchor = $(`a[id^="races-for-year-${this.year}"]`);
            super.prepareView('Races', this.year, navigationAnchor);

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
                    ${HtmlHelpers.constructChartHtml(
                        'distances-distribution-chart',
                        'Distance Distribution Chart',
                        6,
                        showLoadingIcon,
                    )}
                    ${HtmlHelpers.constructChartHtml(
                        'monthly-distribution-chart',
                        'Monthly Distribution Chart',
                        6,
                        showLoadingIcon,
                    )}
                </div>
                ${this.constructDataTableHtml()}
                <div class="row">
                    ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                    ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon)}
                </div>
                <div class="row">
                    ${HtmlHelpers.constructChartHtml('heart-rates-chart', 'Heart Rates Chart', 6, showLoadingIcon)}
                    ${HtmlHelpers.constructChartHtml(
                        'average-hr-zones-chart',
                        'Average HR Zones Distribution Chart',
                        6,
                        showLoadingIcon,
                    )}
                </div>
            `;
            mainContent.append(content);
        }

        protected createView(): void {
            $.ajax({
                url: `${AppHelpers.getApiBaseUrl()}/races/${this.year}`,
                dataType: 'json',
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
                            ${HtmlHelpers.constructChartHtml(
                                'distances-distribution-chart',
                                'Distance Distribution Chart',
                                6,
                            )}
                            ${HtmlHelpers.constructChartHtml(
                                'month-distribution-chart',
                                'Monthly Distribution Chart',
                                6,
                            )}
                        </div>
                        ${this.constructDataTableHtml(items)}
                        <div class="row">
                            ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6)}
                            ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6)}
                        </div>
                        <div class="row">
                            ${HtmlHelpers.constructChartHtml('heart-rates-chart', 'Heart Rates Chart', 6)}
                            ${HtmlHelpers.constructChartHtml(
                                'average-hr-zones-chart',
                                'Average HR Zones Distribution Chart',
                                6,
                            )}
                        </div>
                    `;
                    mainContent.append(content);

                    // Setup all charts and tables.
                    const chartCreator = new Helpers.ChartCreator(items);
                    chartCreator.createRaceDistancesChart('distances-distribution-chart');
                    chartCreator.createMonthDistributionChart('month-distribution-chart');
                    $('.dataTable').each(function() {
                        ($(this) as any).DataTable({
                            bFilter: false,
                            bPaginate: false,
                            iDisplayLength: 10,
                            info: false,
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
                table = ''; // Set to empty.

                const distancesToDisplay: string[] = [];
                const allDistances = [
                    '100 miles', '100k', '50 miles', '50k', 'Marathon', 'Half Marathon',
                    '20k', '15k', '10k', '5k', '3000m', '1 mile', 'Other Distances',
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
                    const showDistanceColumn: boolean = distance.toLocaleLowerCase() === 'other distances';
                    items.forEach((item) => {
                        if (distance === item['race_distance']) {
                            rows += HtmlHelpers.getDatatableRowForRaces(item, showDistanceColumn);
                        }
                    });

                    table += `
                        <h4>${distance}</h4>
                        <div class="dataTable-wrapper">
                            <table class="dataTable table table-bordered table-striped">
                                ${HtmlHelpers.getDatatableHeaderForRaces(showDistanceColumn)}
                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
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
