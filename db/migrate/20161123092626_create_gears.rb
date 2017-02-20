class CreateGears < ActiveRecord::Migration[5.0]
  def change
    create_table :gears, id: false do |t|
      t.belongs_to :athlete

      t.integer :athlete_id
      t.string :gear_id, primary_key: true
      t.string :name

      t.timestamps
    end
  end
end
