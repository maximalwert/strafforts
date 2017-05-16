namespace Views {
    export abstract class BaseView {

        protected prepareView(viewUrl: string, viewType: string, itemName?: string, navigationAnchor?: JQuery) {
            let viewName = viewType;
            if (itemName) {
                viewName = `${viewType} - ${itemName}`;
            }

            AppHelpers.pushStateToWindow(viewUrl);
            AppHelpers.setContentHeader(viewName);
            AppHelpers.appendToPageTitle(` |  ${viewName}`);
            AppHelpers.resetNavigationItems();

            if (navigationAnchor) {
                AppHelpers.setNavigationItem(navigationAnchor);
            }
        }

        protected abstract load(): void;

        protected abstract createViewTemplate(): void;

        protected abstract createView(): void;
    }
}
