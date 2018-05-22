import { HtmlHelpers } from '../helpers/htmlHelpers';
import { Helpers } from './../../common/helpers';
import BaseView from './baseView';

export default class UpgradeToProView extends BaseView {

    public load(): void {
        super.prepareView('Upgrade to PRO');

        this.createViewTemplate();
        this.createView();
    }

    protected createViewTemplate(): void {
        const mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        const showLoadingIcon = true;
        const content = `
            <div class="row pricing-wrapper">
            ${HtmlHelpers.getLoadingIcon()}
            </div>
        `;
        mainContent.append(content).hide().fadeIn();
    }

    protected createView(): void {
        const pane = $('#main-content .pricing-wrapper');
        pane.empty();
        const content = `
                <div class="col-md-4 col-sm-6">
                    <div class="pricingTable green">
                        <div class="pricingTable-header">
                            <h3 class="title">FREE</h3>
                            <span class="sub-title hidden">Lorem ipsum</span>
                            <span class="year">Free <br>Lifetime</span>
                        </div>
                        <div class="price-value">
                            <div class="value">
                                <span class="currency">$</span>
                                <span class="amount">0</span>
                                <span class="month">/forever</span>
                            </div>
                        </div>
                        <ul class="pricing-content">
                            <li>Best Efforts</li>
                            <li>PBs by Distances (limited options)</li>
                            <li>Races by Distances (limited options)</li>
                            <li class="disable">Races Timeline</li>
                            <li class="disable">Races by Year</li>
                            <li class="disable">On-demand Fetching</li>
                            <li class="disable">Reset Profile</li>
                            <li class="disable">Prompt Support</li>
                        </ul>
                        <a href="#" class="pricingTable-signup">Free</a>
                    </div>
                </div>
                <div class="col-md-4 col-sm-6">
                    <div class="pricingTable">
                        <div class="pricingTable-header">
                            <h3 class="title">PRO Quarterly</h3>
                            <span class="sub-title hidden">Lorem ipsum</span>
                            <span class="year">Pay only <br>$11.99/year</span>
                        </div>
                        <div class="price-value">
                            <div class="value">
                                <span class="currency">$</span>
                                <span class="amount">0.<span>99</span></span>
                                <span class="month">/month</span>
                            </div>
                        </div>
                        <ul class="pricing-content">
                            <li>Best Efforts</li>
                            <li>PBs by Distances</li>
                            <li>Races by Distances</li>
                            <li>Races Timeline</li>
                            <li>Races by Year</li>
                            <li>On-demand Fetching</li>
                            <li>Reset Profile</li>
                            <li class="disable">50% Discount</li>
                        </ul>
                        <a href="#" class="pricingTable-signup">Upgrade</a>
                    </div>
                </div>
                <div class="col-md-4 col-sm-6">
                    <div class="pricingTable blue">
                        <div class="pricingTable-header">
                            <h3 class="title">PRO Yearly</h3>
                            <span class="sub-title hidden">Lorem ipsum</span>
                            <span class="year">Pay only <br>$5.99/year</span>
                        </div>
                        <div class="price-value">
                            <div class="value">
                                <span class="currency">$</span>
                                <span class="amount">0.<span>49</span></span>
                                <span class="month">/month</span>
                            </div>
                        </div>
                        <ul class="pricing-content">
                            <li>Best Efforts</li>
                            <li>PBs by Distances</li>
                            <li>Races by Distances</li>
                            <li>Races Timeline</li>
                            <li>Races by Year</li>
                            <li>On-demand Fetching</li>
                            <li>Reset Profile</li>
                            <li>50% Discount</li>
                        </ul>
                        <a href="#" class="pricingTable-signup">Upgrade</a>
                    </div>
                </div>
        `;
        pane.append(content).hide().fadeIn();
    }
}
