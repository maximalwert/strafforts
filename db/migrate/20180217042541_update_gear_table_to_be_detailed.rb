class UpdateGearTableToBeDetailed < ActiveRecord::Migration[5.1]
  def change
    add_column :gears, :primary, :boolean, :default => false
    add_column :gears, :distance, :float
    add_column :gears, :brand_name, :string
    add_column :gears, :model, :string
    add_column :gears, :description, :string
  end
end
