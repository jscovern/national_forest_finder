class AddOrgidToRecareas < ActiveRecord::Migration
  def change
  	add_column :govrecareas, :orgid, :string
  end
end
