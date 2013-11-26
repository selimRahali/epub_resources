describe("Class resolver.XmlSignatureResourceContentResolver ", function()
{
    var contentResolver = null;

    beforeEach(test_utils.loadRequireResource(['resolver/xml_signature_resource_content_resolver', 'resolver/normalized_resource_content_resolver'],function (XmlSignatureResourceContentResolver, NormalizedResourceContentResolver)
    {
        contentResolver = new XmlSignatureResourceContentResolver(new NormalizedResourceContentResolver());
    }));

    describe("Tests method 'resolveContent'",function()
    {
        it("Test with invalid resource type", function ()
        {
            var resource = test_factories.makeValidNormalizedResource();

            var callBack = function()
            {
                contentResolver.resolveContent(resource);
            };
            expect(callBack).toThrow();

        });
        it("Test with valid resource", function ()
        {
            var resource = test_factories.makeValidXmlSignatureResource();

            var resourceContent = null;
            var validated = false;

            var onSuccess = function(node)
            {
                validated = true;
                resourceContent = node;
            };
            runs(function()
            {
                contentResolver.resolveContent(resource, onSuccess, function(value)
                {
                    validated=true;
                });
            });
            waitsFor(function()
            {
                return validated;
            }, "Resource should be validated", 1000);

            runs(function()
            {
                expect(resourceContent instanceof Node).toBe(true);
            });

        });
    });
});


