describe("Class model.XmlSignatureResource", function()
{

    var defaultHref = 'signatures.xml#toto';

    it("Test invalid initialization", test_utils.loadRequireResource(['model/xml_signature_resource','URIjs/URI'],function(XmlSignatureResource, URI)
    {
        var resourceAttributesList =
        [
            {href:new URI(defaultHref), rel:'xml-signature', isInternalResource:false},
            {href:new URI('signatures.xml'), rel:'xml-signature'},
            {href:new URI('toto.xml#titi'), rel:'xml-signature'}
        ];

        var getCreateResourceCallback = function(index)
        {
            return function()
            {
                new XmlSignatureResource(resourceAttributesList[index]);
            };
        };
        for(var i=0; i<resourceAttributesList.length; ++i)
        {
            expect(getCreateResourceCallback(i)).toThrow();
        }

    }));

    it("Test invalid updates", test_utils.loadRequireResource(['model/xml_signature_resource','URIjs/URI'],function(XmlSignatureResource, URI)
    {
        var xmlSignatureResource = new XmlSignatureResource({href:new URI(defaultHref), rel:'xml-signature'}) ;

        var resourceAttributesList =
        [
            {isInternalResource:false},
            {href:new URI('signatures.xml')},
            {href:new URI('toto.xml#titi')}
        ];

        var getUpdateResourceCallback = function(index)
        {
            return function()
            {
                xmlSignatureResource.set(resourceAttributesList[index]);
            };
        };
        for(var i=0; i<resourceAttributesList.length; ++i)
        {
            expect(getUpdateResourceCallback(i)).toThrow();
        }
    }));

    shared_tests.normalizedResourcesTest('model/xml_signature_resource','xml-signature', defaultHref);
});

