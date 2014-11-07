module MapsSearch
  extend ActiveSupport::Concern

  def get_location(address)
    geocode = Geocoder.search(address)
    if (geocode.first)
      lat_lon = geocode.first.coordinates
      location = RGEO_FACTORY.point(lat_lon[1], lat_lon[0])
      return location
    else
      return nil
    end
  end

  def get_path(start_address, end_address)
    start_point = get_location(start_address)
    end_point = get_location(end_address)
    return RGEO_FACTORY.line(start_point, end_point)
  end

  def zip_json(start_point, end_point, zips)
    result = {}
    result[:start_point] = RGeo::GeoJSON.encode(start_point)
    result[:end_point] = RGeo::GeoJSON.encode(end_point)
    result[:zips] = zips.map do |zip|
      {zipcode: zip['GEOID10'],
       geometry: RGeo::GeoJSON.encode(zip.geometry)
      }
    end
    return result
  end

  def intersecting_zips(path)
    ZIPCACHE.select do |zip|
      path.intersects?(zip.geometry)
    end
  end
end
