Zip Search
==========

Enter two locations and get a map with all the Zipcodes between those two locations highlighted.

To setup:

1. Clone
2. Run `bundle install`
3. Unzip the zipcode data from https://www.census.gov/geo/maps-data/data/cbf/cbf_zcta.html into `zips/`
4. Setup the PostgreSQL database `rake db:create` (in the app's present form, the database isn't being used yet, but Rails complains if it's not present)
5. Start the server (`rails s`). It takes a while to startup as it has to load the zipcode data into memory.
