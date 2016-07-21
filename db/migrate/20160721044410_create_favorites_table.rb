class CreateFavoritesTable < ActiveRecord::Migration
  def change
  	  	create_table(:national_forest_app) do |t|
  		t.column(:recareaid, :string, null:false)
  		t.column(:userid, :string, null:false)
  		t.timestamps()
  	end
  end
end
