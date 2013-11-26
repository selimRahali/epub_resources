var shared_tests;
if(!shared_tests)
    shared_tests = {};
shared_tests.normalizedResourcesTest = function(normalizedResourceName, relName,defaultHrefToUse)
{
    describe("Common normalized resources tests", function()
    {
        var NormalizedResource = null;
        var URI = null;

        it('Initialization', function()
        {
            expect(!!relName).toBe(true);
        });
        it('Class '+normalizedResourceName+' loaded', test_utils.loadRequireResource([normalizedResourceName, 'URIjs/URI'],function()
        {
            NormalizedResource = require(normalizedResourceName);
            URI = require('URIjs/URI');
        }));



        it('Test instantiation without media-type', function()
        {
            var normalizedResource = new NormalizedResource({href:new URI(defaultHrefToUse), rel:relName});
            expect(normalizedResource.get("media_type")).toEqual('text/xml');
        });

        it('Test instantiation with invalid media-type', function()
        {
            var normalizedResource = new NormalizedResource({href:new URI(defaultHrefToUse), rel:relName, media_type:"text/html"});
            expect(normalizedResource.get("media_type")).toEqual('text/xml');

        });

        it('Test instantiation with valid media-type', function()
        {
            var normalizedResource = new NormalizedResource({href:new URI(defaultHrefToUse), rel:relName, media_type:"text/xml"});
            expect(normalizedResource.get("media_type")).toEqual('text/xml');
        });

        it('Test instantiation with invalid rel', function()
        {

            var instantiate = function()
            {
                new NormalizedResource({href:new URI(defaultHrefToUse), rel:'toto'});

            };
            expect(instantiate).toThrow();


        });

        it('Test instantiation with valid rel', function()
        {
            var normalizedResource = new NormalizedResource({href:new URI(defaultHrefToUse), rel:relName});
            expect(normalizedResource.get("rel")).toEqual(relName);

        });

        shared_tests.resourcesTest(normalizedResourceName,relName,defaultHrefToUse);
    });
};
