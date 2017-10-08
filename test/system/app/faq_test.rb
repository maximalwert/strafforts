require_relative './app_test_base'

class FaqTest < AppTestBase
  test 'open FAQ page from url should be successful' do
    # act.
    visit DEMO_URL + '?view=faq'

    # assert.
    assert_faq_panel_load_successfully
  end

  test 'open FAQ page from header button should be successful' do
    # arrange.
    visit DEMO_URL

    # act.
    nav_tab_faq = find(:css, App::Selectors::MainHeader.btn_faq)
    nav_tab_faq.click

    # assert.
    assert_faq_panel_load_successfully
  end

  def assert_faq_panel_load_successfully
    faq_panel = find(:css, '.pane-faq')
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
