require 'application_system_test_case'
require_relative './selectors'

class AppTestBase < ApplicationSystemTestCase
  def assert_content_header_loads_successfully(header_text)
    content_header = find(:css, App::Selectors::MainContent.content_header)
    within(content_header) do
      header = find('h1')
      assert_equal(header_text, header.text)

      breadcrumb = find(:css, App::Selectors::MainContent.breadcrumb)
      within(breadcrumb) do
        home_link = find('li:nth-of-type(1)')
        assert_equal(APP_NAME, home_link.text)

        active_link = find('li.active')
        assert_equal(header_text, active_link.text)
      end
    end
  end

  def assert_all_chart_titles_load_successfully(chart_titles)
    main_content = find(:css, App::Selectors::MainContent.main_content)
    within(main_content) do
      headers = all(:xpath, './/*[@class="chart"]/../../*[contains(@class, "box-header")]/*[@class="box-title"]')
      assert_equal(chart_titles.count, headers.count)
      headers.each do |header|
        assert_includes(chart_titles, header.text)
      end
    end
  end

  def assert_chart_canvas_loads_successfully(chart_section_selector)
    main_content = find(:css, App::Selectors::MainContent.main_content)
    within(main_content) do
      assert_has_selector(chart_section_selector + '-canvas')
    end
  end

  def assert_chart_message_loads_successfully(chart_section_selector)
    main_content = find(:css, App::Selectors::MainContent.main_content)
    within(main_content) do
      chart_section = find(:css, chart_section_selector)
      within(chart_section) do
        assert_has_selector('h4')
        assert_not_empty(find(:css, 'h4').text)
      end
    end
  end

  def assert_modal_dialog_loads_successfully(modal_dialog, expected_title)
    within(modal_dialog) do
      modal_header = find(:css, '.modal-header')
      within(modal_header) do
        title = find(:css, '.modal-title')
        assert_equal(expected_title, title.text)
      end

      modal_footer = find(:css, '.modal-footer')
      within(modal_footer) do
        btn_close = find(:css, '.modal-footer button')
        assert_equal('Close', btn_close.text)
      end
    end
  end
end
