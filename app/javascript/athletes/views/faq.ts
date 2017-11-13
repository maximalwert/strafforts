import { HtmlHelpers } from '../helpers/htmlHelpers';
import { Helpers } from './../../common/helpers';
import BaseView from './baseView';

export default class FaqView extends BaseView {

    public load(): void {
        super.prepareView('Frequently Asked Questions');

        this.createViewTemplate();
        this.createView();
    }

    protected createViewTemplate(): void {
        const mainContent = $('#main-content');
        mainContent.empty(); // Empty main content.

        const showLoadingIcon = true;
        const content = `
            <div class="row pane-faq">
            ${HtmlHelpers.getLoadingIcon()}
            </div>
        `;
        mainContent.append(content).hide().fadeIn();
    }

    protected createView(): void {
        const fullUrl = `${Helpers.getBaseUrl()}/api/faqs/index`;
        $.ajax({
            url: fullUrl,
            dataType: 'json',
            success: (data) => {
                const categories: string[] = [];
                const faqs: object[] = [];
                $.each(data, (key, value) => {
                    const faq: object = {
                        title: value['title'],
                        content: value['content'],
                        category: value['category'],
                    };
                    faqs.push(faq);
                    if ($.inArray(value['category'], categories) === -1) {
                        categories.push(value['category']);
                    }
                });

                const pane = $('#main-content .pane-faq');
                pane.empty();

                let accordions = ``;
                categories.forEach((category: string) => {
                    let accordionContent = '';
                    faqs.forEach((faq: object, index: number) => {
                        if (faq['category'] === category) {
                            accordionContent += `
                                    <div class="panel box">
                                        <div class="box-header with-border">
                                            <h4 class="box-title">
                                                <a data-toggle="collapse" data-parent="#accordion-${category}"
                                                    href="#accordion-${category}-${index}">
                                                    ${faq['title']}
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="accordion-${category}-${index}" class="panel-collapse collapse">
                                            <div class="box-body">${faq['content']}</div>
                                        </div>
                                    </div>
                                `;
                        }
                    });
                    const accordion = `
                            <div class="box faq-panel">
                                <div class="box-header">
                                    <h3 class="box-title">${Helpers.toTitleCase(category.replace(/-/g, ' '))}</h3>
                                </div>
                                <div class="box-body">
                                    <div class="box-group accordion" id="accordion-${category}">
                                        ${accordionContent}
                                    </div>
                                </div>
                            </div>
                        `;
                    accordions += accordion;
                });
                pane.append(accordions).hide().fadeIn();
            },
        });
    }
}
