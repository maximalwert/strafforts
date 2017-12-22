import { Helpers } from '../../common/helpers';
import { AppHelpers } from '../helpers/appHelpers';

export default class NavigationSidebar {

    public load(): void {
        $.ajax({
            url: `${AppHelpers.getApiBaseUrl()}/meta`,
            dataType: 'json',
            success: (data) => {
                this.createNavigationItem(
                    data['best_efforts'], '?view=best-efforts&distance', 'best-efforts-for-distance');
                this.createNavigationItem(
                    data['races_by_distance'], '?view=races&distance', 'races-for-distance');
                this.createNavigationItem(
                    data['races_by_year'], '?view=races&year', 'races-for-year');
                AppHelpers.setActiveNavigationItem();
            },
        });
    }

    private createNavigationItem(data: any, urlQuery: string, elementIdPrefix: string) {
        $(`#treeview-menu-${elementIdPrefix}`).parent().find('li:not(.treeview-expander)').remove();
        $.each(data, (key, value) => {
            const itemText = value['name'];
            const itemId = value['name'].replace(/\s/g, '-').replace(/\//g, '-').toLowerCase();
            const elementId = `${elementIdPrefix}-${itemId}-navigation`;
            const count = value['count'];

            const menuItem = `
                <li>
                    <a id="${elementId}" title="${itemText}" href="${urlQuery}=${itemId}">
                        <i class="fa fa-circle-o"></i>
                        <span class="item-text">${itemText}</span>
                        <span class="pull-right-container">
                            <small class="pull-right">${count}</small>
                        </span>
                    </a>
                </li>
            `;

            const isMajor = value['is_major'];
            if (isMajor) {
                $(`#treeview-menu-${elementIdPrefix}`).before(menuItem);
            } else {
                $(`#treeview-menu-${elementIdPrefix} .treeview-menu`).append(menuItem);
            }
        });
    }
}
