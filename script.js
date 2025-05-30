let scene,camera,renderer,wizard,techStacks=[],particles=[];
let mouseX=0,mouseY=0;

function initialize_world()
{
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0,0,5);
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setClearColor(0x000000,0);
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  create_stars();
  create_wizard();
  create_tech_stack_boxes();

  //-----------------LIGHTS FOR CAMERA---------------- 
  
  const ambient_light=new THREE.AmbientLight(0x8A2BE2,0.7);
  scene.add(ambient_light)
  const point_light = new THREE.PointLight(0xDA70D6, 1.3);
  point_light.position.set(0, 5, 5);
  scene.add(point_light); 
  
  const spot_light=new THREE.SpotLight(0xFF69B4,0.8);
  spot_light.position.set(-5,5,5);
  spot_light.target.position.set(0,0,0);
  spot_light.castShadow=true;
  scene.add(spot_light);
  scene.add(spot_light.target)

  animate();
  window.addEventListener('resize',onWindowResize);
}

//creating wizard with shapes
function create_wizard()
{
    const wizard_group =new THREE.Group()
    const body_shape=new THREE.CylinderGeometry(0.3,0.4,1.5,8);
    const body_material=new THREE.MeshPhongMaterial({
        color:0x4B0082,
        transparent:true,
        opacity:0.9
    });
    const body=new THREE.Mesh(body_shape,body_material);
    body.position.y=0;
    wizard_group.add(body)
    const head_shape=new THREE.SphereGeometry(0.25,16,16);
    const head_material=new THREE.MeshPhongMaterial({
        color:0xFFDBB5,
    });
    const head=new THREE.Mesh(head_shape,head_material);
    head.position.y=1;
    wizard_group.add(head)
    const hat_shape=new THREE.ConeGeometry(0.3,0.8,8);
    const hat_material=new THREE.MeshPhongMaterial({color:0x2F1B69});
    const hat=new THREE.Mesh(hat_shape,hat_material);
    hat.position.y=1.6;
    wizard_group.add(hat)
    const arms_shape=new THREE.CylinderGeometry(0.08,0.06,0.8,6);
    const arm_material= new THREE.MeshPhongMaterial({color:0xFFDBB5});
    const left_arms=new THREE.Mesh(arms_shape,arm_material);
    left_arms.position.set(-0.6,0.3,0);
    left_arms.rotation.z=Math.PI/4;
    wizard_group.add(left_arms);
    
    right_arms=new THREE.Mesh(arms_shape,arm_material);
    right_arms.position.set(0.6,0.3,0);
    right_arms.rotation.z=-Math.PI/4;
    wizard_group.add(right_arms);
    
    wizard=wizard_group;
    scene.add(wizard);
}

   
//function to handle resizing of windows
function onWindowResize() 
{
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
}
 
//function to create floating boxes
function create_tech_stack_boxes()
{
    const tech_names=['C++','JS','Node.JS','MongoDB','HTML','CSS','ExpressJS','MySQL','Docker','Python','ML'];
    const colors=[0x61DAFB, 0x339933, 0x000000, 0x3776AB, 0x47A248, 0x4FC08D, 0x2496ED, 0xFF9900,0x2496ED,0x3776AB,0xFF6F00];
    const loader=new THREE.TextureLoader();
    const tech_logos=['c++.png','JavaScript-logo.png','Node.js_logo.png','MongoDB_Logo.png','html.png','CSS3.png','C_Logo.png','mysql-logo.png','Docker5.png','Python-logo.png','machine-learning.png']
    tech_names.forEach((name,index)=>{
        const logo_texture=loader.load(`./logos/${tech_logos[index]}`);
        const shape=new THREE.BoxGeometry(0.4,0.4,0.4);
        const materials=
        [
            new THREE.MeshPhongMaterial({ color: colors[index], transparent: true, opacity: 0.8 }), // right
            new THREE.MeshPhongMaterial({ color: colors[index], transparent: true, opacity: 0.8 }), // left
            new THREE.MeshPhongMaterial({ color: colors[index], transparent: true, opacity: 0.8 }), // bottom
            new THREE.MeshPhongMaterial({ color: colors[index], transparent: true, opacity: 0.8 }), // front
            new THREE.MeshBasicMaterial({ map: logo_texture }), // top (with logo)
            new THREE.MeshPhongMaterial({ color: colors[index], transparent: true, opacity: 0.8 })  // back
        ];
        const cube=new THREE.Mesh(shape,materials);
        const angle=(index/tech_names.length)*Math.PI*2;
        const radius=2.2;
        cube.position.set(Math.cos(angle)*radius,Math.sin(angle*0.5)*2,Math.sin(angle)*radius);
        cube.old_data={
            original_position:cube.position.clone(),
            angle:angle,
            radius:radius,
            name:name
        };
        techStacks.push(cube);
        scene.add(cube);
    })
}

function create_stars()
{
    for(let i=0;i<400;i++)
    {
        const shape=new THREE.SphereGeometry(0.02,4,4);
        const   material=new THREE.MeshPhongMaterial({
            color: Math.random() > 0.5 ? 0x8A2BE2 : 0xDA70D6,
            transparent:true,
            shininess:100,
            opacity:Math.random()*0.8+0.2
        });
        const particle=new THREE.Mesh(shape,material);
        particle.position.set((Math.random()-0.5)*20,(Math.random()-0.5)*20,(Math.random()-0.5)*20);
        particle.old_data={
            velocity:new THREE.Vector3((Math.random()-0.5)*0.02,(Math.random()-0.5)*0.02,(Math.random()-0.5)*0.02)
        };
        particles.push(particle);
        scene.add(particle);
    }
}

function animate_tech_stacks()
{
    const time=Date.now()*0.001;
    techStacks.forEach((cube,index)=>{
        const new_angle=cube.old_data.angle+time*0.5;
        const radius=cube.old_data.radius;
        cube.position.x=Math.cos(new_angle)*radius;
        cube.position.z=Math.sin(new_angle)*radius;
        cube.position.y=Math.sin(new_angle*0.5)*2;
        cube.rotation.x+=0.01;
        cube.rotation.y+=0.01;
    });
}

function animate_particles()
{
    particles.forEach(particle=>{
        particle.position.add(particle.old_data.velocity);
         if (particle.position.length() > 15) {
                particle.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                );
            }
    });
}

    function animate_wizard()
    {
        const time=Date.now()*0.001;
        if(wizard)
        {
            wizard.rotation.y=Math.sin(time*0.5)*0.1;
            wizard.position.y=Math.sin(time)*0.2;
            const left_arm=wizard.children[3];
            const right_arm=wizard.children[4];
            
            left_arm.rotation.z=Math.PI/4 + Math.sin(time*2)*0.3;
            right_arm.rotation.z=-Math.PI/4 - Math.sin(time*2)*0.3;

            const distance_from_wizard=Math.sqrt(mouseX*mouseX+mouseY*mouseY);
            if(distance_from_wizard<1)
            {
                wizard.rotation.x=mouseY*0.2;
            }
            wizard.rotation.y=mouseX;

        }
    }
    
    function animate()
    {
        requestAnimationFrame(animate);
        animate_particles();
        animate_wizard();
        animate_tech_stacks();
        renderer.render(scene,camera);
    }

    function reveal_name()
    {
        let index=0;
        const text="Hey, I am Advitiya Prakash.";
        const name_reveal=document.getElementById("name_reveal");
        name_reveal.textContent="";
        name_reveal.style.opacity=1;
        const interval=setInterval(()=>{
            name_reveal.textContent+=text[index];
            index++;
            if(index>=text.length) clearInterval(interval);
        },100);
    }
    
    document.getElementById('enter_btn').addEventListener("click",()=>{
        document.querySelector('.portal_gate').classList.add('hide');
        const animate_camera_in=()=>{
        let targetZ=2.5;
        let delta=0;
        if(delta<1)
        {
            delta+=0.01;
            camera.position.z=5-(5-targetZ)*delta;
            requestAnimationFrame(animate_camera_in);
        }
        };
        animate_camera_in();
        reveal_name();
    });

    const observer = new IntersectionObserver((entries) => 
    {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               entry.target.classList.add('show');
           }
           else 
           {
            entry.target.classList.remove('show');
           }
       });
    }, {
    threshold: 0.1
});

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

async function get_messages() {
    respose=await fetch('https://silentcanary-github-io.onrender.com/get_messages');
    const data=await respose.json();
    const container=document.getElementById('notes-container');
    container.innerHTML=' ';
    data.forEach(note=>{
        const note_element=document.createElement('div');
        note_element.className='note';
        note_element.innerHTML=`
        <div class="note-author">${note.name}</div>
        <div>${note.message}</div> `;
        container.appendChild(note_element);
    })
}
async function handle_submit(ev)
{
    ev.preventDefault();

    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const message=document.getElementById('message').value;

    const respose=await fetch('https://silentcanary-github-io.onrender.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,message})
    });
    if(respose.ok)
    {       
        alert('Your magical message has been sent✨');
        const note_element=document.createElement('div');
        note_element.className='note';
        note_element.innerHTML=`
        <div class="note-author">${name}</div>
        <div>${message}</div> `
    document.getElementById('notes-container').appendChild(note_element);
    document.getElementById('contact-form').reset();
    }
    else
    {
        alert('Failed to send the message');
    }
}

 document.addEventListener('DOMContentLoaded',()=>{
        initialize_world();
        get_messages();
    });

    document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
