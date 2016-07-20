class Govrecareas < Sinatra::Base
	require 'json'

	delete '/recareasdestroy' do
		Govrecarea.destroy_all
	end

end