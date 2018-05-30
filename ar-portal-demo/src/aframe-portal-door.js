//////////////////////////////////////////////////////////////////////////////
//		arjs-hit-testing
//////////////////////////////////////////////////////////////////////////////
AFRAME.registerComponent('arjs-portal-door', {
    schema: {
        url: { // Url of the content - may be video or image
            type: 'string',
        },
        doorWidth: { // width of the door
            type: 'number',
            default: 1,
        },
        doorHeight: { // height of the door
            type: 'number',
            default: 2,
        },
    },
    init: () => {
        var _this = this;

        let doorWidth = _this.data.doorWidth;
        let doorHeight = _this.data.doorHeight;
        let imageURL = _this.data.url;

        let portalDoor = new THREEx.Portal360(imageURL, doorWidth, doorHeight);
        _this._portalDoor = portalDoor;

        _this.el.object3D.add(portalDoor.object3d);
    },
    tick: () => {
        _this._portalDoor.update();
    },
});


AFRAME.registerPrimitive('a-portal-door', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        'arjs-portal-door': {},
    },
    mappings: {
        url: 'arjs-portal-door.url',
    },
}));

