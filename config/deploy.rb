set :stages, %w(production)
set :default_stage, "production"

require 'freerange/deploy'
require "freerange/puppet"

set :repository, 'git@github.com:freerange/teamstream.git'
set :application, 'teamstream.gofreerange.com' # defaults to the name of the repo at origin

set :user, 'freerange'
set :group, 'application'
set :puppet_user, "root"
set :puppet_os, "ubuntu"

namespace :deploy do
  task :migrate do ; end
end

manifest :web, %{
  teamstream::web {"<%= domain %>":
    domain => "<%= domain %>",
    deploy_to => "<%= deploy_to %>",
    environment => "<%= rails_env %>"
  }
}