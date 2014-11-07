class MapsController < ApplicationController
  include MapsSearch

  def index
  end

  def search
    end_point = params['end-address']
    start_point = params['start-address']
    line = get_path(start_point, end_point)

    return render_notfound unless line

    zips = intersecting_zips(line)
    result = zip_json(line.start_point, line.end_point, zips)
    render json: result
  end
end
