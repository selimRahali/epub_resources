describe("Class factory.ContentResolverFactory ", function()
{
    var contentResolverFactory = null;
    it('Class factory.ContentResolverFactory loaded', test_utils.loadRequireResource(['factory/content_resolver_factory'],function(ContentResolverFactory)
    {
        contentResolverFactory = new ContentResolverFactory();
    }));

    describe("Tests method makeContentResolver", function()
    {
        it('Test with invalid parameter', function()
        {
            var callback = function()
            {
                contentResolverFactory.makeContentResolver('string');
            };
            expect(callback).toThrow();
        });

        it('Test with unsupported resource', test_utils.loadRequireResource(['model/resource', 'URIjs/URI'],function(Resource, URI)
        {
            var resource = new Resource({href:new URI('toto.xml'), rel:'test'});
            var callback = function()
            {
                contentResolverFactory.makeContentResolver(resource);
            };
            expect(callback).toThrow();
        }));


        it('Test with normalized resource', test_utils.loadRequireResource(['model/resource', 'URIjs/URI', 'resolver/normalized_resource_content_resolver'],function(Resource, URI,NormalizedResourceContentResolver)
        {
            var resource = test_factories.makeValidNormalizedResource();
            var contentResolver = contentResolverFactory.makeContentResolver(resource);
            expect(contentResolver instanceof NormalizedResourceContentResolver).toBe(true);
        }));

        it('Test with unNormalized resource', test_utils.loadRequireResource(['model/resource', 'URIjs/URI', 'resolver/un_normalized_resource_content_resolver'],function(Resource, URI,UnNormalizedResourceContentResolver)
        {
            var resource = test_factories.makeUnNormalizedResource();
            var contentResolver = contentResolverFactory.makeContentResolver(resource);
            expect(contentResolver instanceof UnNormalizedResourceContentResolver).toBe(true);
        }));

        it('Test with xml signature resource', test_utils.loadRequireResource(['model/resource', 'URIjs/URI', 'resolver/xml_signature_resource_content_resolver'],function(Resource, URI,XmlSignatureResourceContentResolver)
        {
            var resource = test_factories.makeValidXmlSignatureResource();
            var contentResolver = contentResolverFactory.makeContentResolver(resource);
            expect(contentResolver instanceof XmlSignatureResourceContentResolver).toBe(true);
        }));

    });

    describe('Tests private methods', function()
    {
        it('Test method getNormalizedResourceContentResolver', function()
        {
            var contentResolver1 = contentResolverFactory._getNormalizedResourceContentResolver();
            var contentResolver2 = contentResolverFactory._getNormalizedResourceContentResolver();
            expect(contentResolver1 === contentResolver2).toBe(true);
        });
        it('Test method getUnNormalizedContentResolver', function()
        {
            var contentResolver1 = contentResolverFactory._getUnNormalizedContentResolver();
            var contentResolver2 = contentResolverFactory._getUnNormalizedContentResolver();
            expect(contentResolver1 === contentResolver2).toBe(true);
        });
        it('Test method getXmlSignatureResourceContentResolver', function()
        {
            var contentResolver1 = contentResolverFactory._getXmlSignatureResourceContentResolver();
            var contentResolver2 = contentResolverFactory._getXmlSignatureResourceContentResolver();
            expect(contentResolver1 === contentResolver2).toBe(true);
        });
    });




});

