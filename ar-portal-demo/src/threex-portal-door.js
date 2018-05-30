var THREEx = THREEx || {}

THREEx.Portal360 = (videoImageURL, doorWidth, doorHeight) => {

    var doorCenter = new THREE.Group
    doorCenter.position.y = doorHeight / 2;
    this.object3d = doorCenter;

    //////////////////////////////////////////////////////////////////////////////
    //		build texture360
    //////////////////////////////////////////////////////////////////////////////
    let isVideo = videoImageURL.match(/.(mp4|webm|ogv)/i) ? true : false;
    if (isVideo) {
        let video = document.createElement('video')
        video.width = 640;
        video.height = 360;
        video.loop = true;
        video.muted = true;
        video.src = videoImageURL;
        video.crossOrigin = 'anonymous';
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        video.play();

        let texture360 = new THREE.VideoTexture(video);
        texture360.minFilter = THREE.LinearFilter;
        texture360.format = THREE.RGBFormat;
        texture360.flipY = false;
    } else {
        let texture360 = new THREE.TextureLoader().load(videoImageURL)
        texture360.minFilter = THREE.NearestFilter;
        texture360.format = THREE.RGBFormat;
        texture360.flipY = false;
    }

    //////////////////////////////////////////////////////////////////////////////
    //		build mesh
    //////////////////////////////////////////////////////////////////////////////

    // create insideMesh which is visible IIF inside the portal
    let insideMesh = this._buildInsideMesh(texture360, doorWidth, doorHeight);
    doorCenter.add(insideMesh);
    this.insideMesh = insideMesh;

    // create outsideMesh which is visible IIF outside the portal
    let outsideMesh = this._buildOutsideMesh(texture360, doorWidth, doorHeight);
    doorCenter.add(outsideMesh);
    this.outsideMesh = outsideMesh;

    // create frameMesh for the frame of the portal
    let frameMesh = this._buildRectangularFrame(doorWidth / 100, doorWidth, doorHeight);
    doorCenter.add(frameMesh);
};

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.Portal360.buildTransparentMaterial = () => {
    // if there is a cached version, return it
    if (THREEx.Portal360.buildTransparentMaterial.material) {
        return THREEx.Portal360.buildTransparentMaterial.material;
    }
    let material = new THREE.MeshBasicMaterial({
        colorWrite: false // only write to z-buf
    })
    // an alternative to reach the same visual - this one seems way slower tho. My guess is it is hitting a slow-path in gpu
    // var material   = new THREE.MeshBasicMaterial();
    // material.color.set('black')
    // material.opacity   = 0;
    // material.blending  = THREE.NoBlending;

    // cache the material
    THREEx.Portal360.buildTransparentMaterial.material = material;
    return material;
};

//////////////////////////////////////////////////////////////////////////////
//		Build various cache
//////////////////////////////////////////////////////////////////////////////
THREEx.Portal360.buildSquareCache = function () {
    let container = new THREE.Group;
    // add outter cube - invisibility cloak
    let geometry = new THREE.PlaneGeometry(50, 50);
    let material = THREEx.Portal360.buildTransparentMaterial();

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = geometry.parameters.width / 2 + 0.5;
    mesh.position.y = -geometry.parameters.height / 2 + 0.5;
    container.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = -geometry.parameters.width / 2 + 0.5;
    mesh.position.y = -geometry.parameters.height / 2 - 0.5;
    container.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = -geometry.parameters.width / 2 - 0.5;
    mesh.position.y = geometry.parameters.height / 2 - 0.5;
    container.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = +geometry.parameters.width / 2 - 0.5;
    mesh.position.y = geometry.parameters.height / 2 + 0.5;
    container.add(mesh);

    return container;
}

//////////////////////////////////////////////////////////////////////////////
//		build meshes
//////////////////////////////////////////////////////////////////////////////

/**
 * create insideMesh which is visible IIF inside the portal
 */
THREEx.Portal360.prototype._buildInsideMesh = function (texture360, doorWidth, doorHeight) {
    let doorInsideCenter = new THREE.Group

    // let squareCache = THREEx.Portal360.buildSquareCache()
    // squareCache.scale.y = doorWidth
    // squareCache.scale.y = doorHeight
    // doorInsideCenter.add( squareCache )

    let geometry = new THREE.PlaneGeometry(doorWidth, doorHeight)
    let material = THREEx.Portal360.buildTransparentMaterial()
    // let material = new THREE.MeshNormalMaterial()
    let mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.y = Math.PI
    // mesh.position.z = 0.03
    doorInsideCenter.add(mesh)


    //////////////////////////////////////////////////////////////////////////////
    //		add 360 sphere
    //////////////////////////////////////////////////////////////////////////////
    // add 360 texture
    // TODO put that in a this.data
    let radius360Sphere = 10
    // let radius360Sphere = 1

    geometry = new THREE.SphereGeometry(radius360Sphere, 16, 16).rotateZ(Math.PI)
    material = new THREE.MeshBasicMaterial({
        map: texture360,
        // opacity: 0.9,
        side: THREE.DoubleSide,
    });
    // let material = new THREE.MeshNormalMaterial()
    let sphere360Mesh = new THREE.Mesh(geometry, material);
    sphere360Mesh.position.z = -0.1
    sphere360Mesh.rotation.y = Math.PI
    doorInsideCenter.add(sphere360Mesh)

    return doorInsideCenter
}

/**
 * create outsideMesh which is visible IIF outside the portal
 */
THREEx.Portal360.prototype._buildOutsideMesh = function (texture360, doorWidth, doorHeight) {
    let doorOutsideCenter = new THREE.Group

    //////////////////////////////////////////////////////////////////////////////
    //		add squareCache
    //////////////////////////////////////////////////////////////////////////////
    let squareCache = THREEx.Portal360.buildSquareCache()
    squareCache.scale.y = doorWidth
    squareCache.scale.y = doorHeight
    doorOutsideCenter.add(squareCache)

    //////////////////////////////////////////////////////////////////////////////
    //		add 360 sphere
    //////////////////////////////////////////////////////////////////////////////
    // add 360 texture
    let radius360Sphere = 10
    // let radius360Sphere = 1

    // build half sphere geometry
    let geometry = new THREE.SphereGeometry(radius360Sphere, 16, 16, Math.PI, Math.PI, 0, Math.PI).rotateZ(Math.PI)
    // fix UVs
    geometry.faceVertexUvs[0].forEach(function (faceUvs) {
        faceUvs.forEach(function (uv) {
            uv.x /= 2
        })
    })
    geometry.uvsNeedUpdate = true
    let material = new THREE.MeshBasicMaterial({
        map: texture360,
        // opacity: 0.9,
        side: THREE.BackSide,
    });
    // let geometry = new THREE.SphereGeometry( radius360Sphere, 16, 16);
    // let material = new THREE.MeshNormalMaterial()
    let sphere360Mesh = new THREE.Mesh(geometry, material);
    sphere360Mesh.position.z = -0.1
    doorOutsideCenter.add(sphere360Mesh)

    return doorOutsideCenter
}

/**
 * create frameMesh for the frame of the portal
 */
THREEx.Portal360.prototype._buildRectangularFrame = function (radius, width, height) {
    let container = new THREE.Group
    let material = new THREE.MeshNormalMaterial()
    let material = new THREE.MeshPhongMaterial({
        color: 'silver',
        emissive: 'green'
    })

    let geometryBeamVertical = new THREE.CylinderGeometry(radius, radius, height - radius)

    // mesh right
    let meshRight = new THREE.Mesh(geometryBeamVertical, material)
    meshRight.position.x = width / 2
    container.add(meshRight)

    // mesh right
    let meshLeft = new THREE.Mesh(geometryBeamVertical, material)
    meshLeft.position.x = -width / 2
    container.add(meshLeft)

    let geometryBeamHorizontal = new THREE.CylinderGeometry(radius, radius, width - radius).rotateZ(Math.PI / 2)

    // mesh top
    let meshTop = new THREE.Mesh(geometryBeamHorizontal, material)
    meshTop.position.y = height / 2
    container.add(meshTop)

    // mesh bottom
    let meshBottom = new THREE.Mesh(geometryBeamHorizontal, material)
    meshBottom.position.y = -height / 2
    container.add(meshBottom)

    return container
}

//////////////////////////////////////////////////////////////////////////////
//		update function
//////////////////////////////////////////////////////////////////////////////

THREEx.Portal360.prototype.update = function () {
    // determine if the user is isOutsidePortal
    let localPosition = new THREE.Vector3
    this.object3d.worldToLocal(localPosition)
    let isOutsidePortal = localPosition.z >= 0 ? true : false

    // handle mesh visibility based on isOutsidePortal
    if (isOutsidePortal) {
        this.outsideMesh.visible = true
        this.insideMesh.visible = false
    } else {
        this.outsideMesh.visible = false
        this.insideMesh.visible = true
    }
}
