#!/usr/bin/env ruby
require 'rubygems'
require 'bundler'

Bundler.require

$LOAD_PATH.unshift File.expand_path("../lib", __FILE__)
require "frontend"

run FrontEnd