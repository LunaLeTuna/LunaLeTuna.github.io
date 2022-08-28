import * as THREE from '/js/three.module.js';

import { OBJLoader } from '/js/OBJLoader.js';
import { FBXLoader } from '/js/FBXLoader.js';

var mx = 0;
var my = 0;

const raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();

function updateDisplay(event) {
    mx = event.pageX;
    my = event.pageY;

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

const scene = new THREE.Scene();

var cam_real_pos = new THREE.Vector3();
var cam_target = new THREE.Vector3();

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add( camera );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
//renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function onProgress( xhr ) {

if ( xhr.lengthComputable ) {

    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

}

}

function onError() {}

const textureLoader = new THREE.TextureLoader();

const loader = new OBJLoader();

function loadModel(clack, model, texture, offset_pos, DEAPTJH_AT, bothsided) {

    if(!DEAPTJH_AT)DEAPTJH_AT=1;
    if(offset_pos==null){
        offset_pos=new THREE.Vector3();
    }

    var aaa = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true } );

    if(bothsided)aaa.side = THREE.DoubleSide;

    if(texture){
        var c = textureLoader.load( texture );
        aaa.map = c;
    }

    loader.load( model, function ( obj ) {


        obj.children.forEach( mesh => { mesh.material = aaa; } );

        obj.renderOrder = DEAPTJH_AT;

        obj.position.copy(offset_pos);

        clack[clack.length] = obj

        scene.add(clack[clack.length-1]);

    }, onProgress, onError );

}

function MultiloadModel(model, texture, positions, tree_rotation, tree_sizes) {


    var aaa = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );

    if(texture){
        var c = textureLoader.load( texture );
        aaa.map = c;
    }

    loader.load( model, function ( obj ) {

        obj.children.forEach( mesh => { mesh.material = aaa; } );

        for(let i=0; i < positions.length; i++){
            let imposter = obj.clone();
            imposter.position.set( positions[i].x, positions[i].y, positions[i].z );
            imposter.rotation.set( 0, tree_rotation[i], 0 );
            imposter.scale.set( tree_sizes[i], tree_sizes[i], tree_sizes[i] );
            scene.add(imposter);
            //console.log(i);
        };

    }, onProgress, onError );

}

var wait_till_exist = 0;
var cafe_door;
var cafe_door_glass;
var cafe_door_outline;
var is_cafe_door_hovered = false;
var cafe_door_swing = 0;
var cafe_door_swing_to = 0;
var cafe_fake;
var blahaj_mixer;

let glass_shader = new THREE.MeshPhysicalMaterial({
    metalness: .9,
    roughness: .05,
    clearcoat: 1,
    transparent: true,
    // transmission: .95,
    opacity: .5,
    reflectivity: 0.2,
    ior: 0.9,
    alphaTest: 0.5,
    side: THREE.DoubleSide
});

let awa_shader = new THREE.MeshBasicMaterial({
    color: 0xFF0000,
    depthTest: false
});

var outside_assets = [];

function outside(){
//Lighting & Environment
scene.background = new THREE.Color( 0x97C7CF );

const ambientLight = new THREE.AmbientLight( 0x97C7CF, 0.4 );
scene.add( ambientLight );

const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
camera.add( pointLight );

//Assets
loadModel(outside_assets, '/models/plaza/housing/housing.obj','/models/plaza/housing/houseing.png');

loader.load( '/models/plaza/housing/glass.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = glass_shader; } );

    obj.renderOrder = 2;

    scene.add(obj);

}, onProgress, onError );

loadModel(outside_assets, '/models/plaza/housing/cafe_thingy.obj', '/models/plaza/housing/cafe_thingy.png', null, 1, true);


var aaax = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true } );

var cgg = textureLoader.load( '/models/luma_cafe/cardboard_cutout/inside.jpg' );
aaax.map = cgg;

loader.load( '/models/luma_cafe/cardboard_cutout/cardboard.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = aaax; } );

    obj.renderOrder = 1;

    cafe_fake=obj;

    scene.add(cafe_fake);

}, onProgress, onError );

loadModel(outside_assets, '/models/plaza/luma_sign/sign.obj');

loadModel(outside_assets, '/models/plaza/side_walk/sidewalk.obj', '/models/plaza/side_walk/sidewalk.jpg');

loadModel(outside_assets, '/models/plaza/trees/trunks.obj', '/models/plaza/trees/tree_trunks.png');

loadModel(outside_assets, '/models/plaza/trees/leaves.obj', '/models/plaza/trees/tree_leaves.png');

loadModel(outside_assets, '/models/plaza/floor/floor.obj', '/models/plaza/floor/floor.png');

loadModel(outside_assets, '/models/plaza/tables/tab1.obj', '/models/plaza/tables/tab1.png', null, 2, true);

loadModel(outside_assets, '/models/plaza/tables/tab2.obj', '/models/plaza/tables/tab2.png', null, 2, true);

loadModel(outside_assets, '/models/plaza/tables/trash.obj', '/models/plaza/tables/trash.png', null, 2, true);

//characters

var bht = new THREE.MeshStandardMaterial( { color: 0xFFFFFF, roughness: 1.0, metalness: 0.0 } );

var bhl = textureLoader.load( '/models/plaza/characters/blahaj.png' );
bht.map = bhl;

const loaderf = new FBXLoader();
loaderf.load( '/models/plaza/characters/blahaj.fbx', function ( object ) {

    blahaj_mixer = new THREE.AnimationMixer( object );

    const action = blahaj_mixer.clipAction( object.animations[ 0 ] );
    action.play();

    object.children.forEach( mesh => { mesh.material = bht; } );

    outside_assets[outside_assets.length] = object;

    scene.add(outside_assets[outside_assets.length-1]);

} );

//cam

cam_real_pos = new THREE.Vector3(0, 1.2, 5);
cam_target = new THREE.Vector3(0, 1.2, 5);

//doors

let da = new THREE.MeshStandardMaterial( { color: 0x0F0F0F } );

loader.load( '/models/plaza/cafe_door/iron.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = da; } );

    cafe_door = obj;

    cafe_door.position.set(-0.8, 1, -3.2);

    cafe_door.renderOrder = 0;

    scene.add(cafe_door);
    wait_till_exist++;

}, onProgress, onError );

loader.load( '/models/plaza/cafe_door/glass.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = glass_shader; } );

    cafe_door_glass = obj;

    cafe_door_glass.position.set(-0.8, 1, -3.2);
    cafe_door_glass.renderOrder = 3;

    scene.add(cafe_door_glass);
    wait_till_exist++;

}, onProgress, onError );

loader.load( '/models/plaza/cafe_door/outline.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = awa_shader; } );

    cafe_door_outline = obj;
    cafe_door_outline.renderOrder = 4;
    cafe_door_outline.visible = false;

    scene.add(cafe_door_outline);
    wait_till_exist++;

}, onProgress, onError );

}

var cafe_assets = [];

function cafe(){
//Lighting & Environment
// scene.background = new THREE.Color( 0x000000 );

// const ambientLight = new THREE.AmbientLight( 0x97C7CF, 0.4 );
// scene.add( ambientLight );
//
// const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
// camera.add( pointLight );

var cafe_push = new THREE.Vector3(0,0,-5);

//Assets
loadModel(cafe_assets, '/models/luma_cafe/walls/walls.obj', '/models/luma_cafe/walls/walls.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/desks/desks_bottom.obj', '/models/luma_cafe/desks/desks_bottom.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/desks/desks_top.obj', '/models/luma_cafe/desks/desks_top.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/donuts/nyaw.obj', '/models/luma_cafe/donuts/nyaw.png', cafe_push);

loadModel(cafe_assets, '/models/luma_cafe/shelves/shelves.obj', '/models/luma_cafe/shelves/shelves.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/donuts/stuff.obj', '/models/luma_cafe/donuts/stuff.png', cafe_push);

loadModel(cafe_assets, '/models/luma_cafe/art/frames.obj', '/models/luma_cafe/art/painting_frames.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/art/painting1.obj', '/models/luma_cafe/art/wapwap.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/art/painting2.obj', '/models/luma_cafe/art/taco_dog.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/art/painting3.obj', '/models/luma_cafe/art/coffee.png', cafe_push);

loadModel(cafe_assets, '/models/luma_cafe/donuts/donuts.obj', '/models/luma_cafe/donuts/donut_holder.png', cafe_push);
loader.load( '/models/luma_cafe/donuts/donuts_glass.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = glass_shader; } );

    obj.position.copy(cafe_push);
    obj.renderOrder = 3;

    cafe_assets[cafe_assets.length] = obj

    scene.add(cafe_assets[cafe_assets.length-1]);

}, onProgress, onError );

loadModel(cafe_assets, '/models/luma_cafe/donuts/coffee.obj', '/models/luma_cafe/donuts/cups.png', cafe_push);

loadModel(cafe_assets, '/models/luma_cafe/donuts/coffee_machin.obj', '/models/luma_cafe/donuts/coffee_machin.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/donuts/cash_eater.obj', '/models/luma_cafe/donuts/cash_eater.png', cafe_push);


loadModel(cafe_assets, '/models/luma_cafe/special/coffee_cat.obj', '/models/luma_cafe/special/coffee_cat.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/special/Kitsune.obj', '/models/luma_cafe/special/Kitsune.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/special/cookie_jar_UwU.obj', '/models/luma_cafe/special/cookie_jar_UwU.png', cafe_push);
loader.load( '/models/luma_cafe/special/cookie_jar_OwO.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = glass_shader; } );

    obj.position.copy(cafe_push);
    obj.renderOrder = 3;


    cafe_assets[cafe_assets.length] = obj

    scene.add(cafe_assets[cafe_assets.length-1]);

}, onProgress, onError );

}

outside();
console.log(outside_assets);

var is_outside = 0;
var is_in_cafe = 0;

function onMouseDown( event ) {
    if(is_cafe_door_hovered && is_cafe_door_hovered!=3){
        is_cafe_door_hovered=3;
        cafe_door_outline.visible = false;
        cafe_door_swing_to=3;
        cafe();
        cam_target = new THREE.Vector3(0, 1.0, -3.5);
        cafe_fake.visible = false;
        on=-1;
        cafe_update();
        document.getElementById("cafe").style.display = "";
        is_in_cafe = 1; is_outside = 0;
    }
}

function goto_cafe() {
    if(is_in_cafe) return;
    is_cafe_door_hovered=3;
    cafe_door_outline.visible = false;
    cafe_door_swing_to=3;
    cafe();
    cam_target = new THREE.Vector3(0, 1.0, -3.5);
    cafe_fake.visible = false;
    on=-1;
    cafe_update();
    document.getElementById("cafe").style.display = "";
    is_in_cafe = 1; is_outside = 0;
}
document.querySelector('#cafe_nav').addEventListener('click', goto_cafe);

function cafe_back_outside() {
    if(is_outside) return;
    is_cafe_door_hovered=false;
    cafe_door_swing_to=0;
    cam_target = new THREE.Vector3(0, 1.2, 5);
    cafe_fake.visible = true;
    document.getElementById("cafe").style.display = "none";
    cafe_assets.forEach(objx => {scene.remove(objx);})
    cafe_assets = [];
    is_in_cafe = 0; is_outside = 1;
}
document.querySelector('#plaza_nav').addEventListener('click', cafe_back_outside);

var on = -1;
var whatdis = [
{
    cam_pos: new THREE.Vector3(0.6, 1.0, -5.8),
    name: "Kitsune Engine",
    custom_tag: "kitsune",
    description: `Basicly made this to help me quickly build aplications and games, mainly for a computer information sience class i'm taking in highschool, rn. It has a very messy V8 implementation. :3 Also, to quickly get it up I kinda barrowed some code from learnopengl.`,
    ingredients: `c++, google v8, bullet physics, opengl`,
    link_lable: "GitHub",
    link: "https://github.com/LunaLeTuna/Kitsune-Engine"
},
{
    cam_pos: new THREE.Vector3(0.87, 1.4, -5.8),
    name: "Coffee Cat",
    custom_tag: "CoffeeCat",
    description: `This was a discord bot I ran for a few years, it was in 100+ discord servers.
    This is a project I would love to bring back. The model here is made by TyJupiter`,
    ingredients: `node.js, discord.js`,
    link_lable: null,
    link: ""
},
{
    cam_pos: new THREE.Vector3(0.18, 1.43, -5.7),
    name: "Cookie Clickers",
    custom_tag: "",
    description: `my first ever programming project, when I was 8. just some coookie clickers clone. but it was a bit of a hit in my school, a few people played it to the point the cookie counter hit the 32-bit integer limit.
    It also has a song made by a good friend.`,
    ingredients: `html, js, css`,
    link_lable: null,
    link: ""
},
{
    cam_pos: new THREE.Vector3(-1.35, 0.85, -5.7),
    name: "Doggo",
    custom_tag: "",
    description: "Woof Woof",
    ingredients: null,
    link_lable: null,
    link: ""
}
]

function cafe_update() {
    if(on == -1){
        cam_target = new THREE.Vector3(0, 1.0, -3.5);
        document.getElementById("cafe_title").innerHTML = "Luma Cafe";
        document.getElementById("cafe_bio").innerHTML = "click the arrows to look through projects";
        document.getElementById("cafe_title").className = "";
        document.getElementById("cafe_lunk").style.display = "none";
        return;
    }
    document.getElementById("cafe_title").innerHTML = whatdis[on].name;
    document.getElementById("cafe_title").className = whatdis[on].custom_tag;
    document.getElementById("cafe_bio").innerHTML = whatdis[on].description;

    if(whatdis[on].ingredients !== null){
        document.getElementById("cafe_ingredients").style.display = "";
        document.getElementById("cafe_ingredients").innerHTML = "ingredients: "+whatdis[on].ingredients;
        //document.getElementById("cafe_lunk").innerHTML = whatdis[on].link_lable;
    }else{
        document.getElementById("cafe_ingredients").style.display = "none";
    }

    if(whatdis[on].link_lable !== null){
        document.getElementById("cafe_lunk").style.display = "";
        document.getElementById("cafe_lunk").innerHTML = whatdis[on].link_lable;
        document.getElementById("cafe_lunk").onclick = function(){window.open(whatdis[on].link)};
        //document.getElementById("cafe_lunk").innerHTML = whatdis[on].link_lable;
    }else{
        document.getElementById("cafe_lunk").style.display = "none";
    }
    cam_target = whatdis[on].cam_pos;
}

function cafe_left() {
    on--;
    if(on < -1) on = whatdis.length-1;
    else if(on > whatdis.length-1) on = -1;
    cafe_update();
}
document.querySelector('#cafe_left').addEventListener('click', cafe_left)

function cafe_right() {
    on++;
    if(on < -1) on = whatdis.length-1;
    else if(on > whatdis.length-1) on = -1;
    cafe_update();
}
document.querySelector('#cafe_right').addEventListener('click', cafe_right)


let balls = .5;
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    if(blahaj_mixer) blahaj_mixer.update( delta );
    
    camera.rotation.y = (0.5-(mx/window.innerWidth))*balls;
    camera.rotation.x = (0.5-(my/window.innerHeight))*balls;

    camera.updateMatrixWorld();

    if(wait_till_exist == 3 && is_cafe_door_hovered!=3){
        raycaster.setFromCamera( pointer, camera );

        var intersects = raycaster.intersectObjects( [cafe_door_glass, cafe_door] );

        if ( intersects.length > 0){
            cafe_door_outline.visible = true;
            is_cafe_door_hovered = true;
        }else{
            cafe_door_outline.visible = false;
            is_cafe_door_hovered = false;
        }
    }
    
    cam_real_pos.lerp(cam_target, 0.05);
    camera.position.copy(cam_real_pos);

    if(Math.round(cafe_door_swing_to * 10) / 10 != Math.round(cafe_door_swing * 10) / 10){
        if(cafe_door_swing_to > cafe_door_swing) cafe_door_swing+= 0.01;
        else if(cafe_door_swing_to < cafe_door_swing) cafe_door_swing-= 0.01;
        cafe_door.rotation.y=cafe_door_swing;
        cafe_door_glass.rotation.y=cafe_door_swing;
    }

    //console.log("x:"+camera.rotation.y+" | y:"+camera.rotation.x);

    renderer.render( scene, camera );
};

animate();

window.addEventListener("mousemove", updateDisplay, false);
window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'resize', onWindowResize, false );
