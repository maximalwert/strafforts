class CreatePromoCodes < ActiveRecord::Migration[5.1]
  def change
    create_table :promo_codes do |t|
      t.integer :discount
      t.string :description

      t.timestamps
      t.datetime :starts_at
      t.datetime :expires_at
    end
  end
end
