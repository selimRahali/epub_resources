require.config(
    {
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
        baseUrl: 'src',
        urlArgs: "bust=" + (new Date()).getTime(),
        exclude: ['jquery', 'underscore', 'backbone', 'URIjs/URI'],
        pragmas: {
            isUnitTest: false
        }
    }
);
