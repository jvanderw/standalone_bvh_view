
// Check for support of the File API
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}



function animateBvh(bvhFile) {

    var clock = new THREE.Clock();
    var camera, controls, scene, renderer;
    var mixer, skeletonHelper;

    init();
    animate();

    var loader = new THREE.BVHLoader();

    loader.load( "../data/20180816-150805_Free_Form_Sprint_and_Walk_Analysis.h5.bvh", function( result ) {
        skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );
        skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly
        var boneContainer = new THREE.Group();
        boneContainer.add( result.skeleton.bones[ 0 ] );
        scene.add( skeletonHelper );
        scene.add( boneContainer );
        // play animation
        mixer = new THREE.AnimationMixer( skeletonHelper );
        mixer.clipAction( result.clip ).setEffectiveWeight( 1.0 ).play();
    } );

    function init() {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 500 );
        camera.position.set( 0, 100, 200 );
        controls = new THREE.OrbitControls( camera );
        controls.minDistance = 10;
        controls.maxDistance = 400;
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xeeeeee );
        scene.add( new THREE.GridHelper( 100, 10 ) );
        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        requestAnimationFrame( animate );
        var delta = clock.getDelta();
        if ( mixer ) mixer.update( delta );
        renderer.render( scene, camera );
    }
}
