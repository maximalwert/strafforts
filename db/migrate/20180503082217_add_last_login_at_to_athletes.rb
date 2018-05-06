class AddLastLoginAtToAthletes < ActiveRecord::Migration[5.1]
  def change
    add_column :athletes, :last_active_at, :datetime
  end
end
