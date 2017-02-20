Feature: Test home page

  Background:
    Given I visit home page

  Scenario Outline: Page title and url should be correct
    When I set window width to <width>px
    Then I should see page url "/" (with slashes)
    And I should see the correct homepage title

    Examples:
      | width |
      | 240   |
      | 320   |
      | 640   |
      | 768   |
      | 1280  |
      | 1920  |

  Scenario Outline: Top bar links should work for small screens
    When I set window width to <width>px
    When I click the expander icon
    When I click navbar link "about"
    Then I should see 'about' section
    When I click navbar brand link
    Then I should see main section
    When I click the expander icon
    When I click navbar link "demo"
    Then I should see 'demo' section
    When I click navbar brand link
    Then I should see main section
    When I click the expander icon
    When I click navbar link "connect"
    Then I should see 'connect' section
    When I click navbar brand link
    Then I should see main section

    Examples:
      | width |
      | 240   |
      | 320   |
      | 640   |

  Scenario Outline: Top bar links should work for big screens
    When I set window width to <width>px
    When I click navbar link "about"
    Then I should see 'about' section
    When I click navbar brand link
    Then I should see main section
    When I click navbar link "demo"
    Then I should see 'demo' section
    When I click navbar brand link
    Then I should see main section
    When I click navbar link "connect"
    Then I should see 'connect' section
    When I click navbar brand link
    Then I should see main section

    Examples:
      | width |
      | 768   |
      | 1280  |
      | 1920  |
