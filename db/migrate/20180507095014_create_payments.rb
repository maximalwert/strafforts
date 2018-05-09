class CreatePayments < ActiveRecord::Migration[5.1]
  def change
    create_table :payments do |t|
      t.integer :athlete_id
      t.integer :subscription_id
      t.float :amount
      t.boolean :is_successful

      t.timestamps
    end
  end
end
