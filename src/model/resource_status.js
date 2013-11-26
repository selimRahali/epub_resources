define(['require'],function (require)
{
    var ResourceStatus = {};
    ResourceStatus.NOT_LOADED = 1;
    ResourceStatus.LOADED=2;
    ResourceStatus.INVALID=3;

    return ResourceStatus;

});