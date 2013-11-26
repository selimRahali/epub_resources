define(['require', 'underscore', 'backbone', 'URIjs/URI', 'model/resource_status'],function (require, _ ,Backbone, URI, ResourceStatus)
{



    var Resource = Backbone.Model.extend({
        defaults :
        {
            href:null,
            id:"",
            media_type:"",
            content:null,
            isInternalResource:true,
            refine:null,
            rel:"",
            status:ResourceStatus.NOT_LOADED
        },
        constructor: function()
        {
            Backbone.Model.apply(this,arguments);
            this.bind("invalid", function(model, error){
                throw new Error(error);
            });

            if(!this.isValid())
                throw new Error(this.validationError);
            this.initialized = true;
        },
        set:function (key, val, options)
        {
            if(!this.initialized)
            {
                Backbone.Model.prototype.set.apply(this, [key, val, options]);
                return;
            }
            if(typeof key === 'object')
            {
                val = val||{};
                val.validate = true;
            }
            else
            {
                options = options || {};
               options.validate = true;
            }
            Backbone.Model.prototype.set.apply(this, [key, val, options]);
        },
        validate: function( attributes )
        {

            if(attributes.href !== undefined && (!(attributes.href instanceof URI) || attributes.href.toString() == ""))
                return "Invalid href value.";

            if(attributes.rel !== undefined && !attributes.rel.trim())
                return "Invalid rel parent.";

        },
        toJSON:function()
        {
            var json = _.clone(this.attributes);

            json.itemId=this.get('refine').get('itemId');
            json.itemSrc=this.get('refine').get('itemSrc');
            json.itemFragment=this.get('refine').get('itemFragment');
            json.href =json.href.toString();
            delete json.isInternalResource;
            delete json.refine;
            delete json.id;
            delete json.status;
            return json;
        }

    });

    return Resource;
});