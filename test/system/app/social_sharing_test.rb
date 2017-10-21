require_relative './app_test_base'

class SocialSharingTest < AppTestBase
  test 'social sharing button and modal dialog should work as expected' do
    # arrange.
    visit_page DEMO_URL

    # act.
    btn_social_sharing = find(:css, App::Selectors::MainHeader.btn_social_sharing)
    btn_social_sharing.click

    ALL_SCREENS.each do |screen_size|
      # assert.
      resize_window_to(screen_size)
      sleep 0.2

      modal_dialog = find(:css, '#modal-social-sharing')
      assert_modal_dialog_loads_successfully(modal_dialog, 'Share This Profile')
      within(modal_dialog) do
        # Explicit find to wait for lazy loading.
        addthis_layer = find(:css, '.addthis_inline_share_toolbox .addthis-smartlayers')
        within(addthis_layer) do
          selector = '.at-share-btn-elements a'
          assert_has_selector(selector, count: SOCIAL_SHARING_BUTTONS.count)

          if MEDIUM_TO_LARGE_SCREENS.include?(screen_size)
            labels = all(:css, '.at-share-btn-elements a .at-label')
            labels.each do |label|
              assert_includes_text(SOCIAL_SHARING_BUTTONS, label.text)
            end
          end
        end
      end
    end
  end
end
