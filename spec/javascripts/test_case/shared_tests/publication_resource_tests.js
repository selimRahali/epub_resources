var shared_tests;
if(!shared_tests)
    shared_tests = {};
shared_tests.publicationResourcesTest = function(publicationResourceName, relName, defaultHrefToUse)
{
    describe("Common publication resources tests", function()
    {
        var PublicationResource = null;
        var Refine = null;
        var URI = null;

        it('Class '+publicationResourceName+' loaded', test_utils.loadRequireResource([publicationResourceName, 'model/refine', 'URIjs/URI'],function()
        {
            PublicationResource = require(publicationResourceName);
            Refine = require('model/refine');
            URI = require('URIjs/URI');

        }));


        it('Test instantiation with invalid refine', function()
        {

            var refineAttributesList = [
                {itemId:"kjkj",itemSrc:"ssdsd.com",itemFragment:null},
                {itemId:"kjkj",itemSrc:"ssdsd.com",itemFragment:'llll'}
            ];

            var getInstantiateCallback = function(index)
            {
                return function()
                {
                    var refine = new Refine(refineAttributesList[index]);
                    new PublicationResource({href:new URI(defaultHrefToUse), rel:relName,refine:refine});
                };
            };

            for(var i=0; i<refineAttributesList.length; ++i)
            {
                expect(getInstantiateCallback(i)).toThrow();
            }
        });

        it('Test instantiation with valid refine', function()
        {
            var instantiate = function()
            {
                var refine = new Refine({itemId:null,itemSrc:null,itemFragment:null});
                new PublicationResource({href:new URI(defaultHrefToUse), rel:relName,refine:refine});
            };
            expect(instantiate).not.toThrow();
        });

        shared_tests.normalizedResourcesTest(publicationResourceName,relName, defaultHrefToUse);
    });
};
