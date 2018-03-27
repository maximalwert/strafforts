import { AppHelpers } from '../helpers/appHelpers';
import { ChartCreator } from '../helpers/chartCreators';
import { ChartHelpers, ChartType } from '../helpers/chartHelper';
import { HtmlHelpers } from '../helpers/htmlHelpers';
import BaseView from './baseView';
import NavigationSidebar from './navigationSidebar';

export default class RacesByDistanceView extends BaseView {

    private count: number;

    private distance: string;

    private distanceFormattedForUrl: string;

    private isOtherDistance: boolean;

    constructor(distance: string, count?: string | undefined) {
        super();

        this.count = count ? parseInt(count, 10) : 0;
        this.distance = distance;
        this.isOtherDistance = distance.toLocaleLowerCase() === 'other distances';
        this.distanceFormattedForUrl = AppHelpers.formatDistanceForUrl(distance);
    }

    public load(): void {
        super.prepareView('Races', this.distance);

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
                    'progression-chart',
                    'Progression Chart (Pace)',
                    8,
                    showLoadingIcon,
                )}
                ${HtmlHelpers.constructChartHtml(
                    'year-distribution-pie-chart',
                    'Year Distribution Chart',
                    4,
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
                ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 12, showLoadingIcon)}
            </div>
        `;
        mainContent.append(content);
    }

    protected createView(): void {
        $.ajax({
            url: `${AppHelpers.getApiBaseUrl()}/races/${this.distanceFormattedForUrl}`,
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
                            'progression-chart',
                            'Progression Chart (Pace)',
                            8,
                        )}
                        ${HtmlHelpers.constructChartHtml(
                            'year-distribution-pie-chart',
                            'Year Distribution Chart',
                            4,
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
                        ${HtmlHelpers.constructChartHtml('gear-mileage-chart', 'Gear Mileage Chart', 12)}
                    </div>
                `;
                mainContent.append(content);

                // Create a progression chart when distance is not 'Other Distances'.
                const chartCreator = new ChartCreator(items);
                const progressionChartId = 'progression-chart';
                if (this.isOtherDistance) {
                    ChartHelpers.createChartWithMessage(progressionChartId, 'Not Applicable');
                } else {
                    chartCreator.createProgressionChart(progressionChartId, true);
                }

                // Setup all other charts and tables.
                chartCreator.createYearDistributionChart('year-distribution-pie-chart');
                ($('.dataTable') as any).DataTable({
                    // Disable searching for Time, Pace, Elevation, Cadence and HRs.
                    columnDefs: [
                        { targets: [2, 3, 5, 6, 7, 8], searchable: false },
                        { orderData: [[0, 'desc'], [3, 'asc']] },
                    ],
                    iDisplayLength: 10,
                    order: [
                        [0, 'desc'],
                    ],
                });
                chartCreator.createHeartRatesChart('heart-rates-chart');
                chartCreator.createAverageHrZonesChart('average-hr-zones-chart');
                chartCreator.createGearMileageChart('gear-mileage-chart');
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
                <div class="dataTable-wrapper">
                    <table class="dataTable table table-bordered table-striped">
                        ${HtmlHelpers.getDatatableHeaderForRaces(this.isOtherDistance)}
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
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
