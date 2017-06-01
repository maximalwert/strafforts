class AddIsActiveToAthletes < ActiveRecord::Migration[5.1]
  def change
    add_column :athletes, :is_active, :boolean, :default => true
  end
end
