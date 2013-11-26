describe("Class model.Resource", function()
{

    it("Test method 'toJSON'", test_utils.loadRequireResource(['model/resource', 'model/refine', 'URIjs/URI'],function(Resource, Refine, URI)
    {
        var resourceAttributes =
        {
            href:new URI('kkk/é底本.opf'),
            id:"resourceId",
            media_type:"text/html",
            content:null,
            isInternalResource:true,
            refine:new Refine(),
            rel:"mods-record"
        };

        var expectedJsonResource =
        {
            itemId:null,
            itemSrc:null,
            itemFragment:null,
            href:'kkk/é底本.opf',
            media_type:"text/html",
            rel:"mods-record",
            content:null
        };


        var resource = new Resource(resourceAttributes);
        var jsonResource = resource.toJSON();
        expect(jsonResource).toEqual(expectedJsonResource);
    }));
    shared_tests.resourcesTest('model/resource');
});

