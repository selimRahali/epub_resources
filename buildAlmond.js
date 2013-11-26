({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: '../lib/jquery-1.9.1',
        underscore: '../lib/underscore-1.4.4',
        backbone: '../lib/backbone-0.9.10',
        URIjs: '../lib/URIjs',
        almond: '../utils/almond'
    },
    optimize:'none',
    name : "almond",
    baseUrl: 'src',
    include : ["epub_resources_module"],
    insertRequire : ["epub_resources_module"],
    out:"spec/javascripts/out/epub_resources_module.js"
})
