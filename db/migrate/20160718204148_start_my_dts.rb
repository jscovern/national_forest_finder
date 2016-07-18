class StartMyDts < ActiveRecord::Migration
  def change
  	create_table(:national_forest_app) do |t|
  		t.column(:username, :string, null:false)
  		t.column(:password, :string, null:false)
  		t.column(:email, :string, null:false)
  		t.column(:name, :string, null:false)
  		t.timestamps()
  	end
  end
end
