define(['require','model/normalized_resource', 'model/refine'],function(require,NormalizedResource,Refine)
{
    var PublicationResource = NormalizedResource.extend({

        validate: function( attributes )
        {
            var error = NormalizedResource.prototype.validate.apply(this,[attributes]);
            if(error)
                return error;
            if(attributes.refine && !attributes.refine.equals(new Refine()))
                return "Invalid refine value";
        }
    });
    return PublicationResource;
});
