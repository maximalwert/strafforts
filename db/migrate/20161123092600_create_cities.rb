class CreateCities < ActiveRecord::Migration[5.1]
  def change
    create_table :cities do |t|
      t.belongs_to :country

      t.string :name, index: true
      t.integer :country_id
      t.timestamps
    end
  end
end
