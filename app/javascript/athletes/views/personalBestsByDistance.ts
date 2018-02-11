import { AppHelpers } from '../helpers/appHelpers';
import { ChartCreator } from '../helpers/chartCreators';
import { ChartType } from '../helpers/chartHelper';
import { HtmlHelpers } from '../helpers/htmlHelpers';
import BaseView from './baseView';
import NavigationSidebar from './navigationSidebar';

export default class PersonalBestsByDistanceView extends BaseView {

    private count: number;

    private distance: string;

    private distanceFormattedForUrl: string;

    constructor(distance: string, count?: string | undefined) {
        super();

        this.count = count ? parseInt(count, 10) : 0;
        this.distance = distance.trim().replace(/_/g, '/');
        this.distanceFormattedForUrl = AppHelpers.formatDistanceForUrl(distance);
    }

    public load(): void {
        super.prepareView('Personal Bests', this.distance);

        this.createViewTemplate();
        this.createView();
    }

    protected createViewTemplate(): void {
        const mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        // Create empty tables and charts with loading icon.
        const showLoadingIcon = true;
        const content = `
            <div class="row">
                ${HtmlHelpers.constructChartHtml(
                    'progression-chart',
                    'Progression Chart (Duration)',
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
                ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                ${HtmlHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon)}
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
            url: `${AppHelpers.getApiBaseUrl()}/personal-bests/${this.distanceFormattedForUrl}`,
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
                            'Progression Chart (Duration)',
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
                        ${HtmlHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6)}
                        ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6)}
                    </div>
                    <div class="row">
                        ${HtmlHelpers.constructChartHtml('heart-rates-chart', 'Heart Rates Chart', 6)}
                        ${HtmlHelpers.constructChartHtml(
                            'average-hr-zones-chart',
                            'Average HR Zones Distribution Chart', 6,
                        )}
                    </div>
                `;
                mainContent.append(content);

                // Setup all tables and charts.
                const chartCreator = new ChartCreator(items);
                chartCreator.createProgressionChart('progression-chart', false);
                chartCreator.createYearDistributionChart('year-distribution-pie-chart');
                ($('.dataTable') as any).DataTable({
                    columnDefs: [{
                        targets: [1, 3, 4, 6, 7], // Disable searching for WorkoutType, Time, Pace and HRs.
                        searchable: false,
                    }],
                    iDisplayLength: 10,
                    order: [
                        [0, 'desc'],
                        [4, 'asc'],
                    ],
                });
                chartCreator.createGearCountChart('gear-count-chart');
                chartCreator.createWorkoutTypeChart('workout-type-chart');
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
                rows += HtmlHelpers.getDatatableRowForPersonalBests(item);
            });

            table = `
                <div class="dataTable-wrapper">
                    <table class="dataTable table table-bordered table-striped">
                        ${HtmlHelpers.getDatatableHeaderForPersonalBests()}
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
