require "rubygems"
require "bundler"
Bundler.setup

require "rake/gempackagetask"
require "rake/rdoctask"

require "freerange/deploy/build"
webhooks_config = File.expand_path("../config/webhooks.yml", __FILE__)
BUILD_WEBHOOK_URL = YAML.load_file(webhooks_config)['build_url'] if File.exists?(webhooks_config)

task :test    => ['test:javascript']
task :default => [:test]

namespace :db do
  task :migrate do
    # NOOP for freerange-deploy
  end
end

namespace :test do
  def run_javascript_tests?
    RUBY_PLATFORM =~ /darwin/
  end

  desc "Run javascript tests"
  task :javascript do
    if run_javascript_tests?
      require 'selenium-webdriver'
      driver = Selenium::WebDriver.for :chrome
      driver.navigate.to 'file://' + File.expand_path('../test/javascripts/index.html', __FILE__)

      has_not_finished = true
      while (has_not_finished) do
        begin
          test_results = driver.find_element(:id, 'qunit-testresult')
          failures     = test_results.find_element(:class, 'failed').text
          has_not_finished = false
        rescue
        end
      end

      driver.quit

      failures = failures.to_i
      if failures > 0
        puts "There were #{failures} failures."
        exit 1
      else
        puts "All tests passed"
        exit 0
      end
    end
  end
end