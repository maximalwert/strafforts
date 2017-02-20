class CreateAthletes < ActiveRecord::Migration[5.0]
  def change
    create_table :athletes do |t|
      t.string :username, index: true
      t.string :access_token, index: true
      t.string :firstname
      t.string :lastname
      t.boolean :is_public
      t.integer :last_activity_retrieved

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
      t.datetime :created_at

      t.timestamps
    end
  end
end
