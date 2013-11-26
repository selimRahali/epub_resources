define(['require', 'underscore', 'backbone', 'model/refine'],function (require, _ ,Backbone,Refine)
{
    var RefinesCollection = Backbone.Collection.extend({
        model: Refine
    });
    return RefinesCollection;
});
