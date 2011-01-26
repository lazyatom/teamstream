class teamstream {
  define web($domain, $deploy_to, $environment) {
    include teamstream

    include freerange
    include teamstream::users

    include rack
    rack::host {$domain:
      content => template("teamstream/vhost.erb"),
      ensure => enabled
    }

    include xml
  }
}