class AddTotalRunCountToAthletes < ActiveRecord::Migration[5.1]
  def change
    add_column :athletes, :total_run_count, :integer, :default => 0
  end
end
