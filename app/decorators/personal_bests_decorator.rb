class PersonalBestsDecorator < Draper::CollectionDecorator
  def to_show_in_overview
    ApplicationHelper::Helper.find_items_to_show_in_overview(ApplicationHelper::ItemType::PERSONAL_BESTS, object)
  end
end
