require "sprockets"

module SprocketsHelper
  def check_and_create_sprockets
    if development?
      generate_sprockets
    elsif !File.exists?(sprockets_file)
      generate_sprockets
    end
  end

  private

  def generate_sprockets
    Sprockets::Secretary.new(sprockets_options).concatenation.save_to(sprockets_file)
  end

  def sprockets_file
    File.join('public', 'javascripts', 'sprockets.js')
  end

  def sprockets_options(options = {})
    options.merge(
      :load_path => [ "lib/javascripts", "lib/javascripts/vendor"],
      :source_files => ["lib/javascripts/application.js", "lib/javascripts/**/*.js"]
    )
  end
end