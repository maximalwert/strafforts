/// <reference path="./baseView.ts" />

namespace Views {

    export class BestEffortsByDistance extends BaseView {

        private distance: string;

        private distanceFormattedForUrl: string;

        constructor(distance: string) {
            super();

            this.distance = distance;
            this.distanceFormattedForUrl = distance.trim().replace(/\//g, '|').replace(/\s/g, '-').toLowerCase();
        }

        public load(): void {
            const viewUrl = `${AppHelpers.getBaseUrl()}/best-efforts/${this.distanceFormattedForUrl}`;
            const distanceId = this.distance.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
            const navigationAnchor = $(`a[id^="best-efforts-for-${distanceId}"]`);
            super.prepareView(viewUrl, 'Best Efforts', this.distance, navigationAnchor);

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
                    ${ChartHelpers.constructChartHtml('progression-chart', 'Progression Chart', 8, showLoadingIcon)}
                    ${ChartHelpers.constructChartHtml('year-distribution-pie-chart', 'Year Distribution Chart', 4, showLoadingIcon)}
                </div>
                ${this.constructDataTableHtml()}
                <div class="row">
                    ${ChartHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6, showLoadingIcon)}
                    ${ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6, showLoadingIcon)}
                </div>
            `;
            mainContent.append(content);
        }

        protected createView(): void {
            $.ajax({
                url: `${AppHelpers.getApiBaseUrl()}/best-efforts/${this.distanceFormattedForUrl}`,
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
                            ${ChartHelpers.constructChartHtml('workout-type-chart', 'Workout Type Chart', 6)}
                            ${ChartHelpers.constructChartHtml('gear-count-chart', 'Gear Count Chart', 6)}
                        </div>
                    `;
                    mainContent.append(content);

                    // Setup all tables and charts.
                    ChartHelpers.createProgressionChart('progression-chart', items);
                    ChartHelpers.createYearDistributionChart('year-distribution-pie-chart', items);
                    $('.dataTable').each(function () {
                        $(this).DataTable({
                            columnDefs: [{
                                targets: [1, 3, 4, 6, 7], // Disable searching for WorkoutType, Time, Pace and HRs.
                                searchable: false,
                            }],
                            iDisplayLength: 10,
                            order: [
                                [0, 'desc'],
                            ],
                        });
                    });
                    ChartHelpers.createWorkoutTypeChart('workout-type-chart', items);
                    ChartHelpers.createGearCountChart('gear-count-chart', items);
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
                    <table class="dataTable table table-bordered table-striped">
                        ${HtmlHelpers.getDatatableHeaderForBestEfforts()}
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
