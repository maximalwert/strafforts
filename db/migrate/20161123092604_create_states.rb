class CreateStates < ActiveRecord::Migration[5.0]
  def change
    create_table :states do |t|
      t.belongs_to :country

      t.string :name, index: true
      t.integer :country_id
      t.timestamps
    end
  end
end
