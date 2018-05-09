class CreateSubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :subscriptions do |t|
      t.integer :athlete_id
      t.integer :subscription_plan_id
      t.integer :promo_code_id

      t.timestamps
      t.datetime :starts_at
      t.datetime :expires_at
    end
  end
end
