describe("Class resolver.NormalizedResourceContentResolver ", function()
{
    var contentResolver = null;

    beforeEach(test_utils.loadRequireResource(['resolver/normalized_resource_content_resolver'],function (NormalizedResourceContentResolver)
    {
        contentResolver = new NormalizedResourceContentResolver();
    }));

    describe("Tests method 'resolveContent'", function()
    {
        it("Test with invalid resource's type", function ()
        {
            var resource = test_factories.makeValidResource();

            var callBack = function()
            {
                contentResolver.resolveContent(resource);
            };
            expect(callBack).toThrow();

        });


        function loadContent(resource, whenLoadedCallback)
        {
            var validated = false;
            var isSuccess = false;
            var resourceContent = null;

            var onSuccess = function(node)
            {
                validated = true;
                isSuccess = true;
                resourceContent = node;
            };
            var onError = function()
            {
                validated = true;
            };
            runs(function()
            {
                contentResolver.resolveContent(resource, onSuccess, onError);
            });
            waitsFor(function()
            {
                return validated;
            }, "Resource should be validated", 3000);

            runs(function()
            {
                whenLoadedCallback(isSuccess, resourceContent);
            });
        }

        it("Test with invalid resource's link", function ()
        {
            var resource = test_factories.makeValidNotExistingNormalizedResource();

            loadContent(resource, function(isSuccess, resourceContent)
            {
                expect(isSuccess).toBe(false);
            });


        });

        it("Test with not accessible resource", function ()
        {
            var resource = test_factories.makeValidNotAccessibleNormalizedResource();

            loadContent(resource, function(isSuccess, resourceContent)
            {
                expect(isSuccess).toBe(false);
            });

        });

        it("Test with valid accessible resource", function ()
        {
            var resource = test_factories.makeValidNormalizedResource();

            loadContent(resource, function(isSuccess, resourceContent)
            {
                expect(isSuccess).toBe(true);
                expect(resourceContent instanceof Node).toBe(true);
            });

        });
    });

});


