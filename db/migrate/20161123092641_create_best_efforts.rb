class CreateBestEfforts < ActiveRecord::Migration[5.0]
  def change
    create_table :best_efforts do |t|
      t.belongs_to :activity
      t.belongs_to :athlete
      t.belongs_to :best_effort_type

      t.integer :activity_id
      t.integer :athlete_id
      t.integer :best_effort_type_id
      t.integer :pr_rank

      t.float :distance
      t.integer :moving_time
      t.integer :elapsed_time
      t.datetime :start_date
      t.datetime :start_date_local
      t.timestamps
    end
  end
end
