import { AppHelpers } from '../helpers/appHelpers';
import { ChartCreator } from '../helpers/chartCreators';
import { ChartType } from '../helpers/chartHelper';
import { HtmlHelpers } from '../helpers/htmlHelpers';
import BaseView from './baseView';
import NavigationSidebar from './navigationSidebar';

export default class BestEffortsByDistanceView extends BaseView {
    private distance: string;

    private distanceFormattedForUrl: string;

    constructor(distance?: string) {
        super();

        this.distance = distance ? distance.trim().replace(/_/g, '/') : '';
        this.distanceFormattedForUrl = AppHelpers.formatDistanceForUrl(this.distance);
    }

    public load(): void {
        super.prepareView('Top Best Efforts', this.distance);

        this.createFilterButtons();

        if (this.distance) {
            $(`.best-efforts-filter-buttons .btn[data-race-distance='${this.distance}']`).addClass('active');
            this.createViewTemplate();
            this.createView();
        } else {
            $('.best-efforts-filter-buttons .btn').removeClass('active');
            $('.best-efforts-wrapper').remove();

            if ($('#main-content .best-efforts-filter-buttons .btn').length === 0) {
                $('#main-content').append(HtmlHelpers.getNoDataInfoBox);
            }
        }
    }

    protected createViewTemplate(): void {
        const mainContent = $('#main-content');

        // Create empty tables and charts with loading icon.
        const showLoadingIcon = true;
        const content = `
            <div class="best-efforts-wrapper">
                <div class="row">
                    ${HtmlHelpers.constructChartHtml(
                        'year-distribution-pie-chart',
                        'Year Distribution Chart',
                        6,
                        showLoadingIcon,
                    )}
                    ${HtmlHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon)}
                </div>
                ${this.constructDataTableHtml()}
                <div class="row">
                    ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 12, showLoadingIcon)}
                </div>
            </div>
        `;
        $('.best-efforts-wrapper').remove();
        mainContent.append(content);
    }

    protected createView(): void {
        $.ajax({
            url: `${AppHelpers.getApiBaseUrl()}/best-efforts/${this.distanceFormattedForUrl}`,
            dataType: 'json',
            success: (data) => {
                const items: any[] = [];
                $.each(data, (key, value) => {
                    items.push(value);
                });

                // Create all tables and charts.
                const wrapper = $('#main-content .best-efforts-wrapper');
                wrapper.empty();

                const content = `
                    <div class="row">
                        ${HtmlHelpers.constructChartHtml(
                            'year-distribution-pie-chart',
                            'Year Distribution Chart',
                            6,
                        )}
                        ${HtmlHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6)}
                    </div>
                    ${this.constructDataTableHtml(items)}
                    <div class="row">
                        ${HtmlHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 12)}
                    </div>
                `;
                wrapper.append(content);

                // Setup all tables and charts.
                const chartCreator = new ChartCreator(items);
                chartCreator.createYearDistributionChart('year-distribution-pie-chart');
                $('.dataTable').each(function() {
                    ($(this) as any).DataTable({
                        columnDefs: [{
                            targets: [1, 3, 4], // Disable searching for WorkoutType, Time, Pace and HRs.
                            searchable: false,
                        }],
                        iDisplayLength: 10,
                        order: [
                            [4, 'asc'],
                            [3, 'asc'],
                            [1, 'desc'],
                        ],
                    });
                });
                chartCreator.createWorkoutTypeChart('workout-type-chart');
                chartCreator.createGearCountChart('gear-count-chart');
            },
        });
    }

    protected constructDataTableHtml(items?: any[]): string {
        let table = HtmlHelpers.getLoadingIcon();

        if (items) {
            let rows = '';
            items.forEach((item) => {
                rows += HtmlHelpers.getDatatableRowForBestEfforts(item);
            });

            table = `
                <div class="dataTable-wrapper">
                    <table class="dataTable table table-bordered table-striped">
                        ${HtmlHelpers.getDatatableHeaderForBestEfforts()}
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

    private createFilterButtons() {
        if ($('#main-content .best-efforts-filter-buttons .btn').length === 0) {

            // Empty everything first (i.e. Loading Icon).
            const mainContent = $('#main-content');
            mainContent.empty();

            let fileterButtons = '';
            const bestEffortTypes: string[] = [];
            $.ajax({
                url: `${AppHelpers.getApiBaseUrl()}/meta`,
                dataType: 'json',
                async: false,
                success: (data) => {
                    data['best_efforts'].forEach((item: any) => {
                        const bestEffortType = item['name'];
                        if (bestEffortType && item['count'] > 0) {
                            fileterButtons += `
                                <button class="btn btn-md btn-race-distance"
                                    data-race-distance="${bestEffortType}">${bestEffortType}</button>
                            `;
                        }
                    });
                },
            });
            $('#main-content').append(`
                <div class="row best-efforts-filter-buttons">
                    <div class="col-xs-12 text-center">
                        ${fileterButtons}
                    </div>
                </div>
            `);
        }
    }
}
