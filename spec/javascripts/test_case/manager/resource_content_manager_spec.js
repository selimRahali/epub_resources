describe("Class manager.ResourceContentManager ", function()
{

    var resource = null;
    beforeEach(test_utils.loadRequireResource(['model/resource_status'],function(ResourceStatus)
    {
        resource = test_factories.makeValidResource();
        expect(resource.get('content')).toBe(null);
        expect(resource.get('status')).toBe(ResourceStatus.NOT_LOADED);
    }));

    describe("Tests private method 'resolveContent'", function()
    {
        it('With valid content', test_utils.loadRequireResource(['jquery', 'model/resource_status', 'manager/resource_content_manager'],function($,ResourceStatus, ResourceContentManager)
        {
            var resourceContentManager = new ResourceContentManager(test_factories.makeSimpleContentResolverFactory(true));
            var success = false;

            var callBack = function()
            {
                success = true;
            };
            resourceContentManager._resolveContent(resource, callBack, null);
            expect(resource.get('content') instanceof $).toBe(true);
            expect(resource.get('status')).toBe(ResourceStatus.LOADED);
            expect(success).toBe(true);
        }));

        it('With invalid content', test_utils.loadRequireResource(['jquery', 'model/resource_status', 'manager/resource_content_manager'],function($,ResourceStatus,ResourceContentManager)
        {
            var resourceContentManager = new ResourceContentManager(test_factories.makeSimpleContentResolverFactory(false));
            var error = false;
            var callBack = function()
            {
                error = true;
            };

            resourceContentManager._resolveContent(resource, null, callBack);
            expect(resource.get('content')).toBe(null);
            expect(resource.get('status')).toBe(ResourceStatus.INVALID);
            expect(error).toBe(true);


        }));
    });

    describe("Tests private method 'addContentToResource'", function()
    {
        it('With valid content', test_utils.loadRequireResource(['jquery','manager/resource_content_manager'],function($, ResourceContentManager)
        {
            var resourceContentManager = new ResourceContentManager(test_factories.makeSimpleContentResolverFactory(true));
            resourceContentManager.addContentToResource(resource);
            expect(resource.get('content')).not.toBe(null);
            var previewContent = resource.get('content')
            resourceContentManager.addContentToResource(resource);
            expect(resource.get('content')).toBe(previewContent);
        }));

        it('With invalid content', test_utils.loadRequireResource(['jquery','manager/resource_content_manager'],function($, ResourceContentManager)
        {
            var resourceContentManager = new ResourceContentManager(test_factories.makeSimpleContentResolverFactory(false));
            resourceContentManager.addContentToResource(resource);
            expect(resource.get('content')).toBe(null);
            var previewContent = $('<div>titi</div>');
            resource.set('content', previewContent);
            resourceContentManager.addContentToResource(resource);
            expect(resource.get('content')).toBe(previewContent);
        }));
    });

});