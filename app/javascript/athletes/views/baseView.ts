import { AppHelpers } from '../helpers/appHelpers';
import { Helpers } from './../../common/helpers';

export default abstract class BaseView {

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

    protected abstract load(relativeUrl: string): void;

    protected abstract createViewTemplate(): void;

    protected abstract createView(): void;
}
