# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

ZIPCACHE = []
RGEO_FACTORY = RGeo::Geographic.simple_mercator_factory
SHAPEFILE = RGeo::Shapefile::Reader.open('zips/cb_2013_us_zcta510_500k.shp', :factory => RGEO_FACTORY)
i = 0
SHAPEFILE.each do |zip|
  p i
  ZIPCACHE << zip
  i += 1
end