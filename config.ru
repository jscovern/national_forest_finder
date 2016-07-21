require 'rubygems'
require 'bundler'
Bundler.require

# Models
require './models/user'
require './models/gov_organizations'
require './models/gov_recareas'
require './models/userfavorites'

# Ruby apps
require './app'
require './govRecareas'
require './govOrganizations'
require './Userfavorite_controller'

run Users
use Govorganizations
use Govrecareas
use Userfavorites