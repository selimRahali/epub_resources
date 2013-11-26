module_dir = File.dirname(__FILE__)
rJs = "#{module_dir}/utils/r.js"
begin

    sh "node #{rJs} -o #{module_dir}/build.js"

  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end
