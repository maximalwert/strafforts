namespace Views {
    export abstract class BaseView {

        protected prepareView(viewType: string, itemName?: string, navigationAnchor?: JQuery) {
            let viewName = viewType;
            if (itemName) {
                viewName = `${viewType} - ${itemName}`;
            }
            viewName = Helpers.toTitleCase(viewName);

            AppHelpers.setContentHeader(viewName);
            AppHelpers.appendToPageTitle(` |  ${viewName}`);
            AppHelpers.resetNavigationItems();

            if (navigationAnchor) {
                AppHelpers.setNavigationItem(navigationAnchor);
            }
        }

        protected updateWindowState(viewUrl: string) {
            AppHelpers.pushStateToWindow(viewUrl);
        }

        protected abstract load(): void;

        protected abstract createViewTemplate(): void;

        protected abstract createView(): void;
    }
}
