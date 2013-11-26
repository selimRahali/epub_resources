describe("Class model.Refine", function()
{
    var refine = null;
    beforeEach(test_utils.loadRequireResource(['model/refine'],function(Refine)
    {
        refine = new Refine();
    }));

    describe("Tests method 'addResource'", function()
    {
        it("Test with generic resource",function()
        {
            var resource = test_factories.makeValidResource();
            refine.addResource(resource);
            var rel = resource.get('rel');
            expect(refine.getResource(rel) === resource).toBe(true);
        });

        describe("Tests when two equals resources have the same internal link state", function()
        {
            it("With internal state",function()
            {
                var resource1 = test_factories.makeValidExternalResource();
                var resource2 = test_factories.makeValidExternalResource();
                expect(resource1.get('rel')).toEqual(resource2.get('rel'));
                refine.addResource(resource1);
                refine.addResource(resource2);
                var rel = resource1.get('rel');
                expect(refine.getResource(rel) === resource1).toBe(true);
            });

            it("With external state",function()
            {
                var resource1 = test_factories.makeValidInternalResource();
                var resource2 = test_factories.makeValidInternalResource();
                expect(resource1.get('rel')).toEqual(resource2.get('rel'));
                refine.addResource(resource1);
                refine.addResource(resource2);
                var rel = resource1.get('rel');
                expect(refine.getResource(rel) === resource1).toBe(true);
            });
        });

        describe("Tests when two equals resources have different internal link state", function()
        {
            it("internal => external",function()
            {
                var internalResource = test_factories.makeValidInternalResource();
                var externalResource = test_factories.makeValidExternalResource();
                expect(internalResource.get('rel')).toEqual(externalResource.get('rel'));
                refine.addResource(internalResource);
                refine.addResource(externalResource);
                var rel = internalResource.get('rel');
                expect(refine.getResource(rel) === internalResource).toBe(true);
            });

            it("external => internal",function()
            {
                var internalResource = test_factories.makeValidInternalResource();
                var externalResource = test_factories.makeValidExternalResource();
                expect(internalResource.get('rel')).toEqual(externalResource.get('rel'));
                refine.addResource(externalResource);
                refine.addResource(internalResource);
                var rel = internalResource.get('rel');
                expect(refine.getResource(rel) === internalResource).toBe(true);
            });
        });

    });
});