define(['require', 'underscore', 'backbone', 'model/resource'],function (require, _ ,Backbone, Resource)
{
    var Refine = Backbone.Model.extend({
        defaults :
        {
            itemId:null,
            itemSrc:null,
            itemFragment:null,
            resources:{}
        },
        initialize : function Refine()
        {
            this.set('resources', {});
        },
        addResource:function(resource)
        {
            if(!(resource instanceof Resource))
                throw new Error('invalid resource');

            var resources = this.get('resources');
            var relProperty = resource.get("rel");


            if(resources[relProperty] !== undefined && (!!resources[relProperty].get('isInternalResource') || !resource.get('isInternalResource')))
                return false;

            resource.set("refine", this);
            resources[relProperty] = resource;

            return true;
        },
        getResource:function(rel)
        {
            return this.get('resources')[rel];
        },
        equals:function(other)
        {
            return this.get('itemId') == other.get('itemId') && this.get('itemSrc') == other.get('itemSrc') && this.get('itemFragment') == other.get('itemFragment')
        }
    });


    return Refine;
});
