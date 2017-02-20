# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

Rails.application.config.assets.precompile += %w(
  fonts/junge-regular-webfont.eot
  fonts/junge-regular-webfont.svg
  fonts/junge-regular-webfont.ttf
  fonts/junge-regular-webfont.woff
  plugins/datatables/jquery.dataTables.min.js
  plugins/datatables/dataTables.bootstrap.min.js
  Chart.min.js
  html5shiv.min.js
  jquery.easing.min.js
  moment.min.js
  respond.min.js
  toastr.min.js
  toastr.js.map
  plugins/fastclick/fastclick.min.js
  plugins/pace/pace.min.js
  plugins/slimScroll/jquery.slimscroll.min.js
  dist/js/app.min.js
  athletes.css
  athletes/main.js
  athletes/bestEfforts.js
  athletes/overview.js
  athletes/races.js
  errors.css
  errors.js
  home.css
  home.js
)
