require_relative './app_test_base'

class OverviewTest < AppTestBase
  test 'app should load overview page by default with the correct title' do
    # act.
    visit DEMO_URL

    # assert.
    assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | #{OVERVIEW_TITLE}")
  end

  test 'FAQ panel should load correctly' do
    # arrange.
    visit DEMO_URL

    # act.
    nav_tab_faq = find(:css, App::Selectors::MainContent.nav_tab_faq)
    nav_tab_faq.click

    # assert.
    faq_panel = find(:id, 'pane-faqs')
    within(faq_panel) do
      headers = all(:css, 'h3.box-title')
      assert_equal(FAQ_CATEGORIES.count, headers.count)
      headers.each do |header|
        assert_includes_text(FAQ_CATEGORIES, header.text)
      end

      links = all(:css, '.accordion .box-body a')
      links.each do |link|
        assert_equal('_blank', link[:target], "Link's href: '#{link[:href]}'")
      end
    end
  end
end
