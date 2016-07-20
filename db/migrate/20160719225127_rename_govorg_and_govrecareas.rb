class RenameGovorgAndGovrecareas < ActiveRecord::Migration
  def change
  	rename_table(:gov_organizations,:govorganizations)
  	rename_table(:gov_recareas,:govrecareas)
  end
end