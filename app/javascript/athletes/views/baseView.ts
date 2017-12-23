import { AppHelpers } from '../helpers/appHelpers';
import { Helpers } from './../../common/helpers';

abstract class BaseView {

    protected prepareView(viewType: string, itemName?: string) {
        let viewName = viewType;
        if (itemName) {
            viewName = `${viewType} - ${itemName}`;
        }
        viewName = Helpers.toTitleCase(viewName);

        AppHelpers.setContentHeader(viewName);
        AppHelpers.appendToPageTitle(` |  ${viewName}`);
        AppHelpers.resetNavigationItems();
        AppHelpers.setActiveNavigationItem();
    }

    protected abstract load(relativeUrl: string): void;

    protected abstract createViewTemplate(): void;

    protected abstract createView(): void;
}

export default BaseView;
