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
        URIjs: '../lib/URIjs'
    },
    optimize:'none',
    baseUrl: 'src',
    exclude: ['jquery', 'underscore', 'backbone', 'URIjs/URI'],
    name : "epub_resources_module",
    out:"out/epub_resources_module.js"
})
