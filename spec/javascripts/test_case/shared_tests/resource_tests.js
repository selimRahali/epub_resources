var shared_tests;
if(!shared_tests)
    shared_tests = {};
shared_tests.resourcesTest = function(resourceName,relName, defaultHrefToUse)
{
    describe("Common resources tests", function()
    {
        var Resource = null;
        var rel = relName ||'test';
        var URI = null;
        it('Class '+resourceName+' loaded', test_utils.loadRequireResource([resourceName, 'URIjs/URI'],function()
        {
            Resource = require(resourceName);
            URI = require('URIjs/URI');

        }));

        it('Test invalid instantiation', function()
        {
            var resourceAttributesList =
            [
                undefined,
                {href:null,rel:null},
                {href:'kkk/sss.opf',rel:''},
                {href:new URI(defaultHrefToUse),rel:'    '},
                {href:new URI(defaultHrefToUse)},
                {rel:'ffff'},
                {href:'',rel:'ffff'}

            ];

            var getCreateResourceCallback = function(index)
            {
                return function()
                {
                    new Resource(resourceAttributesList[index]);
                };
            };
            for(var i=0; i<resourceAttributesList.length; ++i)
            {
                expect(getCreateResourceCallback(i)).toThrow();
            }
        });

        it('Test invalid updates', function()
        {
            var resourceAttributes ={href:new URI(defaultHrefToUse),rel:rel};
            var resource = new Resource(resourceAttributes);

            var newAttributesList =
            [
                {property:'href', value:null},
                {property:'href',value:''},
                {property:'href',value:'sssss'},
                {property:'rel',value:null},
                {property:'rel',value:''},
                {property:{href:null, rel:rel}, value:undefined},
                {property:{href:new URI(defaultHrefToUse), rel:''}, value:undefined},
                {property:{href:'', rel:null}, value:undefined}
            ];
            var getUpdateResourceCallback = function(index)
            {
                return function()
                {
                    resource.set(newAttributesList[index].property, newAttributesList[index].value);
                };
            };
            for(var i=0; i<newAttributesList.length; ++i)
            {
                expect(getUpdateResourceCallback(i)).toThrow();
                expect(resource.get("href") === resourceAttributes.href).toBe(true);
                expect(resource.get("rel") === resourceAttributes.rel).toBe(true);
            }

        });

        it('Test valid updates with property setter', function()
        {

            var resourceAttributes ={href:new URI(defaultHrefToUse),rel:rel};

            var resource = new Resource(resourceAttributes);


            var newAttributesList =
            [
                {property:'href', value:new URI(defaultHrefToUse)},
                {property:'rel', value:rel}
            ];

            var getUpdateResourceCallback = function(index)
            {
                return function()
                {
                    resource.set(newAttributesList[index].property, newAttributesList[index].value);
                };
            };
            for(var i=0; i<newAttributesList.length; ++i)
            {
                expect(getUpdateResourceCallback(i)).not.toThrow();
                expect(resource.get(newAttributesList[i].property) === newAttributesList[i].value).toBe(true);
            }
        });

        it('Test valid updates with properties setter', function()
        {


            var resourceAttributes ={href:new URI(defaultHrefToUse),rel:rel};

            var resource = new Resource(resourceAttributes);

            var newAttributes = {href:new URI(defaultHrefToUse),rel:rel};


            var updateResource = function()
            {
                resource.set(newAttributes);
            };
            expect(updateResource).not.toThrow();
            expect(resource.get("href") === newAttributes.href).toBe(true);
        });
    });
};
