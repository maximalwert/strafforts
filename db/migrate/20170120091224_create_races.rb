class CreateRaces < ActiveRecord::Migration[5.0]
  def change
    create_table :races do |t|
      t.belongs_to :activity
      t.belongs_to :athlete
      t.belongs_to :race_distance

      t.integer :activity_id
      t.integer :athlete_id
      t.integer :race_distance_id

      t.timestamps
    end
  end
end
