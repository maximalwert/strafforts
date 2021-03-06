import { AppHelpers } from '../helpers/appHelpers';
import { ChartCreator } from '../helpers/chartCreators';
import { HtmlHelpers } from '../helpers/htmlHelpers';
import BaseView from './baseView';
import NavigationSidebar from './navigationSidebar';

export default class RacesByYearView extends BaseView {

    private count: number;

    private year: string;

    constructor(year: string, count?: string | undefined) {
        super();

        this.count = count ? parseInt(count, 10) : 0;
        this.year = year;
    }

    public load(): void {
        super.prepareView('Races', this.year);

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
                ${HtmlHelpers.constructChartHtml('heart-rates-chart', 'Heart Rates Chart', 6, showLoadingIcon)}
                ${HtmlHelpers.constructChartHtml(
                    'average-hr-zones-chart',
                    'Average HR Zones Distribution Chart',
                    6,
                    showLoadingIcon,
                )}
            </div>
            <div class="row">
                ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6, showLoadingIcon)}
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

                if (this.count < items.length) {
                    new NavigationSidebar().load();
                }

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
                        ${HtmlHelpers.constructChartHtml('heart-rates-chart', 'Heart Rates Chart', 6)}
                        ${HtmlHelpers.constructChartHtml(
                            'average-hr-zones-chart',
                            'Average HR Zones Distribution Chart',
                            6,
                        )}
                    </div>
                    <div class="row">
                        ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6)}
                        ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 6)}
                    </div>
                `;
                mainContent.append(content);

                // Setup all charts and tables.
                const chartCreator = new ChartCreator(items);
                chartCreator.createRaceDistancesChart('distances-distribution-chart');
                chartCreator.createMonthDistributionChart('month-distribution-chart');
                ($('.dataTable') as any).DataTable({
                    bFilter: false,
                    bPaginate: false,
                    columnDefs: [
                        { type: 'time', targets: 3 },
                        { orderData: [[0, 'desc'], [3, 'asc']] },
                    ],
                    iDisplayLength: 10,
                    info: false,
                    order: [
                        [0, 'desc'],
                    ],
                });
                chartCreator.createHeartRatesChart('heart-rates-chart');
                chartCreator.createAverageHrZonesChart('average-hr-zones-chart');
                chartCreator.createGearCountChart('gear-count-chart');
                chartCreator.createGearMileageChart('gear-mileage-chart');
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
