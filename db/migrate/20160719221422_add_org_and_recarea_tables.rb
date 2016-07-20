class AddOrgAndRecareaTables < ActiveRecord::Migration
  def change
  	create_table(:gov_organizations) do |t|
  		t.column(:orgid, :string, null:false)
  		t.column(:orgname, :string, null:false)
  		t.column(:orgabbrev, :string)
  		t.timestamps()
  	end
  	create_table(:gov_recareas) do |t|
  		t.column(:description, :string)
  		t.column(:recareaID, :string)
  		t.column(:latitude, :float)
  		t.column(:longitude, :float)
  		t.column(:name, :string)
  		t.column(:phone, :string)
  		t.timestamps()
  	end
  end
end
