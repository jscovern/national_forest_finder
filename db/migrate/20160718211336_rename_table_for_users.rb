class RenameTableForUsers < ActiveRecord::Migration
  def change
  	rename_table(:national_forest_app,:users)
  end
end
