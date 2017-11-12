module App
  module Selectors
    class MainHeader
      def self.pace_done
        'body.pace-done'
      end

      def self.main_header
        '.main-header'
      end

      def self.sidebar_toggle
        "#{main_header} .sidebar-toggle"
      end

      def self.btn_user_menu
        "#{main_header} .user-menu .dropdown-toggle"
      end

      def self.btn_social_sharing
        "#{main_header} .social-sharing-toggle"
      end

      def self.btn_faq
        "#{main_header} .show-faq"
      end

      def self.btn_connect_with_strava
        "#{main_header} .btn-connect-with-strava"
      end
    end

    class MainContent
      def self.content_header
        '.content-header'
      end

      def self.breadcrumb
        '.breadcrumb'
      end

      def self.main_content
        '#main-content'
      end

      def self.timeline_filter_buttons
        "#{main_content} .timeline-wrapper .filter-buttons"
      end

      def self.timeline_show_all
        "#{main_content} .timeline-wrapper .filter-buttons .show-all"
      end

      def self.timeline_year_labels
        "#{main_content} .timeline-wrapper .time-label span"
      end

      def self.timeline_headers
        "#{main_content} .timeline-wrapper .timeline-header"
      end
    end
  end
end
