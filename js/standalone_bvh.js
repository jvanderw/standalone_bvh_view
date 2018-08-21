
// Check for support of the File API
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

var _grid = null;
var _renderer = null;

document.getElementById('toggle-grid-btn').onclick = function() {
    if (!_grid) {
        return;
    }
    if(_grid.visible) {
        _grid.visible = false;
    } else {
        _grid.visible = true;
    }
};

function getFiles(files) {
    document.getElementById('current-file-name')
        .textContent = files[0].name;
    clearScene();
    var reader = new FileReader();
    reader.onload = function () {
        animateBvh(this.result);
    };
    reader.readAsText(files[0]);

}

function animateBvh(bvhFile) {

    var clock = new THREE.Clock();
    var camera, controls, scene, renderer;
    var mixer, skeletonHelper;

    init();
    animate();

    var loader = new THREE.BVHLoader();

    var result = loader.parse(bvhFile);
    skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );
    skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly
    var boneContainer = new THREE.Group();
    boneContainer.add( result.skeleton.bones[ 0 ] );
    scene.add( skeletonHelper );
    scene.add( boneContainer );
    // play animation
    mixer = new THREE.AnimationMixer( skeletonHelper );
    mixer.clipAction( result.clip ).setEffectiveWeight( 1.0 ).play();

    function init() {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 500 );
        camera.position.set( 25, 25, 25 );
        controls = new THREE.OrbitControls( camera );
        controls.minDistance = 10;
        controls.maxDistance = 400;
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xeeeeee );
        _grid = new THREE.GridHelper(20, 10);
        scene.add(_grid);
        // renderer
        _renderer = new THREE.WebGLRenderer( { antialias: true } );
        _renderer.setPixelRatio( window.devicePixelRatio );
        _renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( _renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        _renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        requestAnimationFrame( animate );
        var delta = clock.getDelta();
        if ( mixer ) mixer.update( delta );
        _renderer.render( scene, camera );
    }
}

function clearScene() {
    if (_renderer) {
        _renderer.domElement.remove();
    }
}
