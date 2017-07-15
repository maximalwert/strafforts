namespace Views {
    export class NavigationSidebar {

        public load(): void {
            this.createNavigationItem('/best-efforts/get_counts', 'best_effort_type', 'best-efforts-for-distance');
            this.createNavigationItem('/races/get_counts_by_distance', 'race_distance', 'races-for-distance');
            this.createNavigationItem('/races/get_counts_by_year', 'race_year', 'races-for-year');
        }

        private createNavigationItem(url: string, itemName: string, elementIdPrefix: string) {
            const fullUrl = AppHelpers.getApiBaseUrl() + url;
            $.ajax({
                url: fullUrl,
                dataType: 'json',
                async: false,
                success: (data) => {
                    if (data.length === 0) {
                        $(`#treeview-menu-${elementIdPrefix}`).closest('.treeview').empty();
                    } else {
                        $.each(data, (key, value) => {
                            const itemText = value[itemName];
                            const itemId = value[itemName].replace(/\s/g, '-').replace(/\//g, '-').toLowerCase();
                            const elementId = `${elementIdPrefix}-${itemId}-navigation`;
                            const count = value['count'];

                            const menuItem = `
                                <li>
                                    <a id="${elementId}" title="${itemText}" href="#">
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
                },
            });
        }
    }
}