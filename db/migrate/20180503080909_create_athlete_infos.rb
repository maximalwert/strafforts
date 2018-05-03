class CreateAthleteInfos < ActiveRecord::Migration[5.1]
  def change
    create_table :athlete_infos, id: false do |t|
      t.integer :athlete_id, primary_key: true

      t.string :username, index: true
      t.string :firstname
      t.string :lastname

      t.string :profile_medium
      t.string :profile

      t.belongs_to :city
      t.belongs_to :state
      t.belongs_to :country
      t.integer :city_id
      t.integer :state_id
      t.integer :country_id

      t.string :sex
      t.integer :follower_count
      t.integer :friend_count
      t.integer :athlete_type
      t.string :date_preference
      t.string :measurement_preference
      t.string :email
      t.float :weight

      t.timestamps
    end
  end
end
