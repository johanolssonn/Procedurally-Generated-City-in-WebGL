// PROCEDURALLY GENERATED CITY - A project by Johan Olsson
// Linköping University (TNM084)

function buildCity() {

    clearScene();
    buildLight();

    // get value from slider
    numberOfBuildings = document.getElementById('density-slider').value;

    // ground
    var planeGeometry = new THREE.PlaneGeometry(10000, 10000, 32);
    var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    // base geometry for buildings
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    // translate pivot to the bottom
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

    // remove bottom (it's never seen anyway)
    geometry.faces.splice(6, 2);
    geometry.faceVertexUvs[0].splice(6, 2);

    // fix UV mapping so that top face is not textured
    geometry.faceVertexUvs[0][5][2].set(0, 0);
    geometry.faceVertexUvs[0][4][2].set(0, 0);

    var buildingMesh = new THREE.Mesh(geometry);
    cityGeometry = new THREE.Geometry();

    // reset seed
    Math.seed = 1;

    for (var i = 0; i < numberOfBuildings; i++) {

       Math.seed++;

        // position of buildings
        buildingMesh.position.x = Math.floor(Math.seededRandom() * 200 - 100) * 20;
        buildingMesh.position.z = Math.floor(Math.seededRandom() * 200 - 100) * 20;

        // size of buildings
        buildingMesh.scale.x = Math.seededRandom() * Math.seededRandom() * Math.seededRandom() * Math.seededRandom() * 30 + 50;
        buildingMesh.scale.z = buildingMesh.scale.x;

        // height
        // get value from slider
        maxHeight = document.getElementById('height-slider').value;
        buildingMesh.scale.y = (Math.seededRandom() * maxHeight) + maxHeight / 1.4;

        // add light to building
        buildingLight.position = buildingMesh.position;
        scene.add(buildingLight);

        // merge it with cityGeometry - important for performance
        buildingMesh.updateMatrix();
        cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);

    }

    texturizeCity();

}

function texturizeCity() {

    // get value from slider
    awakeness = document.getElementById('awakeness-slider').value;

    var texture = new THREE.Texture(generateTexture());
    texture.anisotropy = renderer.getMaxAnisotropy(); //https://blog.tojicode.com/2012/03/anisotropic-filtering-in-webgl.html - for details
    texture.needsUpdate = true;

    var material = new THREE.MeshLambertMaterial({
        map: texture,
        vertexColors: THREE.VertexColors

    });

    var cityMesh = new THREE.Mesh(cityGeometry, material);

    scene.add(cityMesh);

}

function generateTexture() {

    var step = 2;
    var threhold = 1.0 - awakeness;

    // Small texture
    var canvas = document.createElement('canvas');

    canvas.width = 32;
    canvas.height = 64;

    var context = canvas.getContext('2d');

    context.fillStyle = '#000000';
    context.fillRect(0, 0, 32, 64);

    // reset seed
    Math.seed = 1;

    for (var y = 4; y < canvas.height; y += step) {
        for (var x = 2; x < canvas.width; x += step) {

            // window color
            context.fillStyle = '#fcff72';

            // decide how visable the lights will be depending on how close to the ground they are
            if (y < canvas.height * 0.75) {

                randVal = Math.seededRandom();
                randVal2 = Math.seededRandom();


            }
            else if (y < canvas.height * 0.9) {

                // less visable
                randVal = Math.seededRandom() * Math.seededRandom();
                randVal2 = Math.seededRandom() * Math.seededRandom();

            }
            else {

                // barely visable
                randVal = Math.seededRandom() * Math.seededRandom() * Math.seededRandom();
                randVal2 = Math.seededRandom() * Math.seededRandom() * Math.seededRandom();


            }

            if (randVal < threhold) {

                randVal = 0;
            }
            if (randVal2 < threhold) {

                randVal2 = 0;
            }

            context.fillRect(x, y, randVal, randVal2);

            Math.seed ++;
        }

    }

    // big texture
    var bigCanvas = document.createElement('canvas');
    bigCanvas.width = 512;
    bigCanvas.height = 1024;
    var context = bigCanvas.getContext('2d');

    // disable smoothing to avoid blurry effect when scaling
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    // copy small canvas into big canvas
    context.drawImage(canvas, 0, 0, bigCanvas.width, bigCanvas.height);

    return bigCanvas;

}

function buildLight() {

    var hemLight = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    hemLight.position.set(0.75, 1, 0.25);
    scene.add(hemLight);

    buildingLight = new THREE.PointLight(0xffffff, 5.0);
    scene.add(buildingLight);

}

function clearScene() {


    while (scene.children.length > 0) {

        scene.remove(scene.children[0]);
    }


}


 
