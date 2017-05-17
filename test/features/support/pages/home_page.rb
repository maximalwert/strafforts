module Pages
  class HomePage
    def initialize(driver)
      @driver = driver
    end

    def get_navbar_link(name)
      @driver.find_element(css: "[href='##{name}']")
    end

    def navbar_toggle
      @driver.find_element(css: '.navbar-toggle')
    end

    def navbar_brand
      @driver.find_element(css: '.navbar-brand')
    end

    def navbar_about
      @driver.find_element(css: '[href="#about"]')
    end

    def navbar_demo
      @driver.find_element(css: '[href="#demo"]')
    end

    def navbar_connect
      @driver.find_element(css: '[href="#connect"]')
    end

    def heading_brand
      @driver.find_element(css: '.brand-heading')
    end

    def intro_text
      @driver.find_element(css: '.intro-text')
    end

    def section_about
      @driver.find_element(id: 'about')
    end

    def section_demo
      @driver.find_element(id: 'demo')
    end

    def section_connect
      @driver.find_element(id: 'connect')
    end

    def header_social_link_buttons
      @driver.find_elements(css: 'header .banner-social-buttons .btn')
    end

    def all_external_links
      @driver.find_elements(css: 'a.external')
    end
  end
end
