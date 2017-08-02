namespace Views {
    export class NavigationSidebar {

        public load(): void {
            this.createNavigationItem('/best-efforts/meta', 'best-efforts-for-distance');
            this.createNavigationItem('/races/meta_by_distance', 'races-for-distance');
            this.createNavigationItem('/races/meta_by_year', 'races-for-year');
        }

        private createNavigationItem(url: string, elementIdPrefix: string) {
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
                            const itemText = value['name'];
                            const itemId = value['name'].replace(/\s/g, '-').replace(/\//g, '-').toLowerCase();
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
