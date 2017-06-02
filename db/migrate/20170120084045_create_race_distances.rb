class CreateRaceDistances < ActiveRecord::Migration[5.1]
  def change
    create_table :race_distances do |t|
      t.float :distance
      t.string :name, index: true

      t.timestamps
    end
  end
end
