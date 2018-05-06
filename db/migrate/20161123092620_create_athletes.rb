class CreateAthletes < ActiveRecord::Migration[5.1]
  def change
    create_table :athletes do |t|
      t.string :access_token, index: true
      t.boolean :is_public
      t.integer :last_activity_retrieved

      t.timestamps
    end
  end
end
