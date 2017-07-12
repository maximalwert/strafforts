module Home
  class Selectors
    def self.navbar_brand
      'a.navbar-brand'
    end

    def self.navbar_links
      '.navbar-nav a.page-scroll'
    end

    def self.navbar_link_about
      '.navbar-nav a[href="#about"]'
    end

    def self.navbar_link_demo
      '.navbar-nav a[href="#demo"]'
    end

    def self.navbar_link_connect
      '.navbar-nav a[href="#connect"]'
    end

    def self.navbar_toggle_button
      'button[data-target=".navbar-main-collapse"]'
    end

    def self.view_demo_button
      '.btn-view-demo'
    end

    def self.connect_with_strava_button
      '.btn-connect-with-strava'
    end

    def self.intro_section
      'header.intro'
    end

    def self.intro_header
      'h1.brand-heading'
    end

    def self.intro_text
      '.intro-text'
    end

    def self.about_section
      '#about'
    end

    def self.demo_section
      '#demo'
    end

    def self.connect_section
      '#connect'
    end
  end
end
