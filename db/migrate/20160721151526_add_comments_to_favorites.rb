class AddCommentsToFavorites < ActiveRecord::Migration
  def change
  	  	add_column :userfavorites, :comments, :text
  end
end
