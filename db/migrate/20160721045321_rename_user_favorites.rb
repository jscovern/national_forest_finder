class RenameUserFavorites < ActiveRecord::Migration
  def change
	rename_table(:national_forest_app,:userfavorites)
  end
end
