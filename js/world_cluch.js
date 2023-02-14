import * as THREE from '/js/three.module.js';

import { OBJLoader } from '/js/OBJLoader.js';
import { FBXLoader } from '/js/FBXLoader.js';

var phone_mode = false;

var mx = 0;
var my = 0;

const raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();

function updateDisplay(event) {
    mx = event.pageX;
    my = event.pageY;

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if(window.innerWidth < 1000)
    phone_mode=true;
    else
    phone_mode=false;
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


    if(window.innerWidth < 1000)
    phone_mode=true;
    else
    phone_mode=false;
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

var allow_hover = true;

var wait_till_exist = 0;
var cafe_door;
var cafe_door_glass;
var cafe_door_outline;
var is_cafe_door_hovered = false;
var cafe_door_swing = 0;
var cafe_door_swing_to = 0;
var cafe_fake;

var blahaj_mixer;
var THE_BLAHAJ_IS_REAL = 0;
var bht;
var blahaj;
var is_blahaj_hovered = false;

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
    color: 0xFE00FE,
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

bht = new THREE.MeshStandardMaterial( { color: 0xFFFFFF, roughness: 1.0, metalness: 0.0 } );

var bhl = textureLoader.load( '/models/plaza/characters/blahaj.png' );
bht.map = bhl;

const loaderf = new FBXLoader();
loaderf.load( '/models/plaza/characters/blahaj.fbx', function ( object ) {

    blahaj_mixer = new THREE.AnimationMixer( object );

    const action = blahaj_mixer.clipAction( object.animations[ 0 ] );
    action.play();

    object.children.forEach( mesh => { mesh.material = bht; } );

    object.children[0].frustumCulled = false;

    scene.add(object);

} );

const geometry4 = new THREE.BoxGeometry( 0.6, 1, 0.4 );
const material4 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
blahaj = new THREE.Mesh( geometry4, material4 );
blahaj.position.set(2.5, 0.7, 0);
blahaj.visible=false;
scene.add( blahaj );
THE_BLAHAJ_IS_REAL=1;

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

loader.load( '/models/luma_cafe/cof_hol/glass.obj', function ( obj ) {


    obj.children.forEach( mesh => { mesh.material = glass_shader; } );

    obj.position.copy(cafe_push);
    obj.renderOrder = 3;

    cafe_assets[cafe_assets.length] = obj

    scene.add(cafe_assets[cafe_assets.length-1]);

}, onProgress, onError );
loadModel(cafe_assets, '/models/luma_cafe/cof_hol/bars.obj', '/models/luma_cafe/cof_hol/bars.png', cafe_push);
loadModel(cafe_assets, '/models/luma_cafe/cof_hol/coffee.obj', '/models/luma_cafe/cof_hol/coffee.png', cafe_push);

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

var is_outside = 1;
var is_in_cafe = 0;
var is_in_arcade = 0;

function onMouseDown( event ) {
    if(is_cafe_door_hovered && allow_hover){
        is_cafe_door_hovered=3;
        cafe_door_outline.visible = false;
        cafe_door_swing_to=3;
        allow_hover=false;
        cafe();
        cam_target = new THREE.Vector3(0, 1.0, -3.5);
        cafe_fake.visible = false;
        on=-1;
        cafe_update();
        document.getElementById("cafe").style.display = "";
        is_in_cafe = 1; is_outside = 0;
    }

    if(is_blahaj_hovered && allow_hover){
        allow_hover=false;
        bht.color = new THREE.Color( 0xfcfcfc );
        cam_target = new THREE.Vector3(2.3, 1.0, 1);
        document.getElementById("speak").style.display = "";
        speaker="blahaj";
        on=-1;
        spnext();
    }
}

function goto_cafe() {
    if(is_in_cafe) return;
    is_cafe_door_hovered=3;
    allow_hover=false;
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
    allow_hover=true;
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
    description: `Basicly made this to help me quickly build aplications and games, mainly for a computer information sience class i'm taking in highschool, rn. It has a very messy V8 implementation. :3`, //sneaky, i know, to remove it >:3 (Shut up, don't @ me)
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
        document.getElementById("cafe_ingredients").style.display = "none";
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

var speaker = "";

var speaks = {
    "blahaj":[
        ["I'm currently suffocating...","there is no water.",false],
        ["AAAAAAAAAA",false],
        ["I HOPE YOU HAVE A WONDERFUL TRANSITION!!!!!", false],
        ["meow meow- I mean uhhhhh- *blahaj noises*", false],
        ["everyone says they want half-life 3 or portal 3 or Team-Fortress 3","but nobody ever asks where Ricochet 2 is. 3;",false],
        ["grrrr",false],
        ["i sold the end of the world in my dreams",false],
        ["Did you know", "Hatsune Miku made minecraft! :3", "she is so talented",false],
        ["...", "...", "...", "...", "nya ^^",false],
        ["this place looks really really unfinished", "like look at the building behind me...", "so lazy",false],
        ["could go for some saltine cracker right about now",false]
    ],
    "sniz":[

    ]

}

var on_chat = 0;
var is_speaking = false;
var words_being_said = " ";
var current_letter = 0;

function spnext() {
    if(on==-1){
        on_chat=Math.floor(Math.random() * speaks[speaker].length);
    }
    on++;
    if(speaks[speaker][on_chat][on] != false){
        document.getElementById("spname").innerHTML = speaker;
        words_being_said = speaks[speaker][on_chat][on];
        document.getElementById("top_bar").className = "blu_disabled";
        is_speaking=true;
        current_letter=0;
        return;
    }else{
        document.getElementById("speak").style.display = "none";
        cam_target = new THREE.Vector3(0, 1.2, 5);
        allow_hover=true;
        document.getElementById("top_bar").className = "";
        is_speaking=false;
        return;
    }
}
document.querySelector('#spnext').addEventListener('click', spnext)


let balls = .5;
const clock = new THREE.Clock();

function animate() {
    
    if(is_outside && !is_speaking){
        let avx = document.documentElement.scrollLeft/document.documentElement.scrollWidth;
        let avy = document.documentElement.scrollTop;
        cam_target = new THREE.Vector3(13*avx,1.2-avy, 5);
        if(phone_mode){
            cam_real_pos = cam_target;
            camera.position.copy(cam_real_pos);
        }
        //console.log(document.documentElement.scrollLeft)
        document.getElementById("screen_buffer").style.display = "list-item";
    }else
    document.getElementById("screen_buffer").style.display = "none";

    if(window.innerWidth < 1000)
    phone_mode=true;
    else
    phone_mode=false;

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    if(blahaj_mixer) blahaj_mixer.update( delta );
    
    if(phone_mode || is_outside){
        camera.rotation.y = 0;
        camera.rotation.x = 0;
    }else{
        camera.rotation.y = (0.5-(mx/window.innerWidth))*balls;
        camera.rotation.x = (0.5-(my/window.innerHeight))*balls;
    }

    camera.updateMatrixWorld();

    raycaster.setFromCamera( pointer, camera );

    if(wait_till_exist == 3 && allow_hover){
        let intersects = raycaster.intersectObjects( [cafe_door_glass, cafe_door] );

        if (intersects.length > 0){
            cafe_door_outline.visible = true;
            is_cafe_door_hovered = true;
        }else{
            cafe_door_outline.visible = false;
            is_cafe_door_hovered = false;
        }
    }


    if(THE_BLAHAJ_IS_REAL!=0 && allow_hover){
        let intersects = raycaster.intersectObjects( [blahaj] );

        if ( intersects.length > 0){
            bht.color = new THREE.Color( 0xFEaaFE );
            is_blahaj_hovered = true;
        }else{
            bht.color = new THREE.Color( 0xfcfcfc );
            is_blahaj_hovered = false;
        }
    }


    if(is_speaking)
    if(current_letter <= words_being_said.length-1){
        document.getElementById("sptext").innerHTML = words_being_said.slice(0,(Math.round(current_letter)-words_being_said.length));
        current_letter+=20*delta;
    }else{
        document.getElementById("sptext").innerHTML = words_being_said;
    }
    
    cam_real_pos.lerp(cam_target, 1*delta);
    camera.position.copy(cam_real_pos);

    if(Math.round(cafe_door_swing_to * 10) / 10 != Math.round(cafe_door_swing * 10) / 10){
        if(cafe_door_swing_to > cafe_door_swing) cafe_door_swing+= 1*delta;
        else if(cafe_door_swing_to < cafe_door_swing) cafe_door_swing-= 1*delta;
        cafe_door.rotation.y=cafe_door_swing;
        cafe_door_glass.rotation.y=cafe_door_swing;
    }

    //console.log("x:"+camera.rotation.y+" | y:"+camera.rotation.x);

    renderer.render( scene, camera );
};

animate();

renderer.domElement.addEventListener("mousemove", updateDisplay, false);
renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'resize', onWindowResize, false );
renderer.domElement.addEventListener("click", onMouseDown, false);
