import { AppHelpers } from '../helpers/appHelpers';
import { HtmlHelpers } from '../helpers/htmlHelpers';
import { ViewType } from '../helpers/viewTypes';
import BaseView from './baseView';

export default class Overview extends BaseView {

    public load(): void {
        super.prepareView('Overview');

        this.createViewTemplate();
        this.createView();
    }

    public loadPersonalBestsPanel(): void {
        this.createView();
    }

    public loadRecentPersonalBestsPanel(): void {
        this.createOverviewDatatableForRecentItems(ViewType.PersonalBests);
    }

    public loadRacesPanel(): void {
        this.createOverviewDatatable(ViewType.Races);
    }

    public loadRecentRacesPanel(): void {
        this.createOverviewDatatableForRecentItems(ViewType.Races);
    }

    protected createView(): void {
        this.createOverviewDatatable(ViewType.PersonalBests);
    }

    protected createViewTemplate(): void {
        const mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        const content = `
        <div class="row">
            <div class="col-xs-12">
                <div class="nav-tabs-custom">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#pane-personal-bests" data-toggle="tab">Personal Bests</a>
                        </li>
                        <li>
                            <a href="#pane-recent-personal-bests" data-toggle="tab">Recent PBs</a>
                        </li>
                        <li>
                            <a href="#pane-races" data-toggle="tab">Races</a>
                        </li>
                        <li>
                            <a href="#pane-recent-races" data-toggle="tab">Recent Races</a>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="pane-personal-bests">${HtmlHelpers.getLoadingIcon()}</div>
                        <div class="tab-pane" id="pane-recent-personal-bests">${HtmlHelpers.getLoadingIcon()}</div>
                        <div class="tab-pane" id="pane-races">${HtmlHelpers.getLoadingIcon()}</div>
                        <div class="tab-pane" id="pane-recent-races">${HtmlHelpers.getLoadingIcon()}</div>
                    </div>
                </div>
            </div>
        </div>`;
        mainContent.append(content);
    }

    private createOverviewDatatable(type: string) {
        const fullUrl = `${AppHelpers.getApiBaseUrl()}/${type}/overview`;
        $.ajax({
            url: fullUrl,
            dataType: 'json',
            success: (data) => {
                const distances: object[] = [];
                $.each(data, (key, value) => {
                    const model: object = {
                        distance: key,
                        items: value,
                    };
                    distances.push(model);
                });

                const pane = $(`#pane-${type}`);
                pane.empty();

                if (distances.length === 0) {
                    const infoBox = HtmlHelpers.getNoDataInfoBox();
                    pane.append(infoBox);
                } else {
                    distances.forEach((model: any[]) => {
                        const isTypeOfRaces = type === ViewType.Races;

                        const distanceId = model['distance'].toLowerCase().replace(/\s/g, '-').replace(/\//g, '-');
                        const linkId = `${type}-for-distance-${distanceId}`;
                        const workoutTypeColumnHeader = isTypeOfRaces ?
                            '' : `<th class="col-md-1 text-center badge-cell hidden-md-down">Type</th>`;
                        const showDistanceColumn = model['distance'] === 'Recent';
                        const activityColumnWidth = showDistanceColumn ? '2' : '3';
                        const distanceColumnHeader = showDistanceColumn ?
                            `<th class="col-md-1 hidden-xs-down">Distance</th>` : '';

                        let rows = '';
                        model['items'].forEach((item: any[]) => {
                            const stravaLink = `https://www.strava.com/activities/${item['activity_id']}`;
                            const distanceColumn = showDistanceColumn ?
                                `<td class="hidden-xs-down">
                                    ${(item['distance']).toFixed(1)} ${item['distance_unit']}
                                </td>` : '';
                            const workoutTypeColumn = isTypeOfRaces ? '' :
                            `<td class="text-center badge-cell hidden-md-down">
                                <span class="label workout-type-${item['workout_type_name'].replace(/\s/g, '-')}">
                                    ${item['workout_type_name']}
                                </span>
                            </td>`;
                            const stravaLogoLink = isTypeOfRaces ?
                            `<a class="strava-logo-link hidden-lg-down" href="${stravaLink}" target="_blank">
                                <span></span>
                            </a>` : '';

                            rows += `
                            <tr>
                                <td class="no-wrap">${item['start_date']}</td>
                                ${workoutTypeColumn}
                                <td>
                                    ${stravaLogoLink}
                                    <a class="strava-activity-link" href="${stravaLink}" target="_blank">
                                        ${item['activity_name']}
                                    </a>
                                </td>
                                ${distanceColumn}
                                <td class="no-wrap">${item['elapsed_time_formatted']}</td>
                                <td class="hidden-xs-down" data-sort="${item['pace_in_seconds']}">
                                    ${item['pace']}<small>${item['pace_unit']}</small>
                                </td>
                                <td class="hidden-lg-down">${item['gear_name']}</td>
                                <td class='text-center badge-cell hidden-md-down'>
                                    <span class="badge hr-zone-${item['average_hr_zone']}">
                                        ${item['average_heartrate'] === -1 ? 'n/a' : item['average_heartrate']}
                                    </span>
                                </td>
                                <td class='text-center badge-cell hidden-md-down'>
                                    <span class="badge hr-zone-${item['max_hr_zone']}">
                                        ${item['max_heartrate'] === -1 ? 'n/a' : item['max_heartrate']}
                                    </span>
                                </td>
                            </tr>`;
                        });

                        const table = `
                        <div class="box">
                            <div class="box-header">
                                <h3 class="box-title">
                                    ${model['distance']}
                                </h3>
                                <a class="pull-right ${showDistanceColumn ? 'hidden' : ''}"
                                    id="${linkId}" href="#" title="${model['distance']}">
                                    <small> View Details</small>
                                    <span class="item-text hidden">
                                        ${model['distance']}
                                    </span>
                                </a>
                            </div>
                            <div class="box-body dataTable-wrapper">
                                <table id="overview-dataTable-${type}"
                                    class="dataTable table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th class="col-md-1">Date</th>
                                            ${workoutTypeColumnHeader}
                                            <th class="col-md-${activityColumnWidth}">Activity</th>
                                            ${distanceColumnHeader}
                                            <th class="col-md-1">Time</th>
                                            <th class="col-md-1 hidden-xs-down">Pace</th>
                                            <th class="col-md-2 hidden-lg-down">Gear</th>
                                            <th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
                                            <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${rows}
                                    </tbody>
                                </table>
                            </div>
                        </div>`;
                        pane.append(table);
                    });
                }
            },
        });
    }

    private createOverviewDatatableForRecentItems(type: string) {
        const fullUrl = `${AppHelpers.getApiBaseUrl()}/${type}/recent`;
        const isTypeOfRaces = type === ViewType.Races;
        $.ajax({
            url: fullUrl,
            dataType: 'json',
            success: (data) => {
                const pane = $(`#pane-recent-${type}`);
                pane.empty();

                if (data.length === 0) {
                    const infoBox = HtmlHelpers.getNoDataInfoBox();
                    pane.append(infoBox);
                } else {
                    let rows = '';
                    data.forEach((item: any[]) => {
                        const stravaLink = `https://www.strava.com/activities/${item['activity_id']}`;
                        const distance = isTypeOfRaces
                            ? `${item['distance'].toFixed(1)} ${item['distance_unit']}`
                            : `${item['best_effort_type']}`;
                        const distanceSortOrder = isTypeOfRaces
                            ? item['distance'].toFixed(1) : item['best_effort_type_id'];

                        rows += `
                            <tr>
                                <td class="no-wrap">${item['start_date']}</td>
                                <td>
                                    <a class="strava-logo-link hidden-lg-down" href="${stravaLink}" target="_blank">
                                        <span></span>
                                    </a>
                                    <a class="strava-activity-link" href="${stravaLink}" target="_blank">
                                        ${item['activity_name']}
                                    </a>
                                </td>
                                <td class="hidden-xs-down" data-sort="${distanceSortOrder}">
                                    ${distance}
                                </td>
                                <td class="no-wrap">${item['elapsed_time_formatted']}</td>
                                <td class="hidden-xs-down" data-sort="${item['pace_in_seconds']}">
                                    ${item['pace']}<small>${item['pace_unit']}</small>
                                </td>
                                <td class="hidden-lg-down">${item['gear_name']}</td>
                                <td class='text-center badge-cell hidden-md-down'>
                                    <span class="badge hr-zone-${item['average_hr_zone']}">
                                        ${item['average_heartrate'] === -1 ? 'n/a' : item['average_heartrate']}
                                    </span>
                                </td>
                                <td class='text-center badge-cell hidden-md-down'>
                                    <span class="badge hr-zone-${item['max_hr_zone']}">
                                        ${item['max_heartrate'] === -1 ? 'n/a' : item['max_heartrate']}
                                    </span>
                                </td>
                            </tr>
                        `;
                    });

                    const table = `
                    <div class="box">
                        <div class="box-header">
                            <h3 class="box-title">
                                Recent ${isTypeOfRaces ? 'Races' : 'PBs'}
                            </h3>
                        </div>
                        <div class="box-body dataTable-wrapper">
                            <table id="overview-dataTable-recent-${type}"
                                class="dataTable table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th class="col-md-1">Date</th>
                                        <th class="col-md-3">Activity</th>
                                        <th class="col-md-1 hidden-xs-down">Distance</th>
                                        <th class="col-md-1">Time</th>
                                        <th class="col-md-1 hidden-xs-down">Pace</th>
                                        <th class="col-md-1 hidden-lg-down">Gear</th>
                                        <th class="col-md-1 text-center badge-cell hidden-md-down">Avg. HR</th>
                                        <th class="col-md-1 text-center badge-cell hidden-md-down">Max HR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                    pane.append(table);

                    ($(`#overview-dataTable-recent-${type}`) as any).DataTable({
                        columnDefs: [
                            // Disable searching for Time, Pace and HRs.
                            { targets: [3, 4, 6, 7], searchable: false },
                            { orderData: [[0, 'desc'], [1, 'asc']] },
                        ],
                        iDisplayLength: 10,
                        order: [
                            [0, 'desc'],
                        ],
                    });
                }
            },
        });
    }
}
