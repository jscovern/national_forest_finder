require 'rubygems'
require 'bundler'
Bundler.require

# Models
require './models/user'
require './models/gov_organizations'
require './models/gov_recareas'

# Ruby apps
require './app'
require './govRecareas'
require './govOrganizations'

run Users
use Govorganizations
use Govrecareas