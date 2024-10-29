import { Renderer, Program, Texture, Mesh, Vec2, Flowmap, Triangle } from '../src/index.js';

            const vertex = /* glsl */ `
                attribute vec2 uv;
                attribute vec2 position;

                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 0, 1);
                }
            `;

            const fragment = /* glsl */ `
                precision highp float;

                uniform sampler2D tWater;
                uniform sampler2D tFlow;
                uniform float uTime;

                varying vec2 vUv;

                void main() {

                    // R and G values are velocity in the x and y direction
                    // B value is the velocity length
                    vec3 flow = texture2D(tFlow, vUv).rgb;

                    // Use flow to adjust the uv lookup of a texture
                    vec2 uv = vUv; // Use vUv directly to cover the entire canvas
                    uv += flow.xy * 0.42;
                    vec3 tex = texture2D(tWater, uv).rgb;

                    // Oscillate between raw values and the affected texture above
                    // tex = mix(tex, flow * 24 + 24, smoothstep( -0.3, 0.7, sin(uTime)));
                    tex = tex;

                    gl_FragColor.rgb = tex;
                    gl_FragColor.a = 1.0;
                }
            `;
            

// resizeCanvasToDisplaySize(gl.canvas);
            {
                const renderer = new Renderer({ dpr: 2 });
                const gl = renderer.gl;
                document.body.appendChild(gl.canvas);

                // Variable inputs to control flowmap
                let aspect = 4;
                const mouse = new Vec2(-4);
                const velocity = new Vec2();

                function resize() {
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    aspect = window.innerWidth / window.innerHeight;
                }
                window.addEventListener('resize', resize, false);
                resize();

                const flowmap = new Flowmap(gl);

                // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
                const geometry = new Triangle(gl);

                // const texture = new Texture(gl, { wrapS: gl.MIRRORED_REPEAT, wrapT: gl.MIRRORED_REPEAT });
                const texture = new Texture(gl);
                const img = new Image();
                img.onload = () => (texture.image = img);
            
                // Add drag-and-drop functionality
                const dropArea = document.createElement('div');
                dropArea.style.position = 'absolute';
                dropArea.style.top = '0';
                dropArea.style.left = '0';
                dropArea.style.width = '100%';
                dropArea.style.height = '100vh';
                dropArea.style.zIndex = '-200';
                dropArea.style.opacity = '0';
                dropArea.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                document.body.appendChild(dropArea);

                dropArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropArea.style.opacity = '1';
                    dropArea.style.zIndex = '-200';
                
                });

                dropArea.addEventListener('dragleave', () => {
                    dropArea.style.opacity = '0';
                    dropArea.style.zIndex = '-200';
                    console.log('dragleave');
                });

                dropArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropArea.style.opacity = '0';
                    dropArea.style.zIndex = '-200';
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const newImg = new Image();
                            newImg.onload = () => (texture.image = newImg);
                            newImg.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                // Prevent default behavior for drag and drop
                document.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });
                document.addEventListener('drop', (e) => {
                    e.preventDefault();
                });

                // Enable pointer events when dragging starts
                document.addEventListener('dragstart', () => {
                    dropArea.style.pointerEvents = 'auto';
                    dropArea.style.zIndex = '10';
       
                });

                // Disable pointer events when dragging ends
                document.addEventListener('dragend', () => {
                    dropArea.style.pointerEvents = 'none';
                    dropArea.style.zIndex = '-200';
                });

                img.src = './assets/water5.jpg';

                const program = new Program(gl, {
                    vertex,
                    fragment,
                    uniforms: {
                        uTime: { value: 0 },
                        tWater: { value: texture },

                        // Note that the uniform is applied without using an object and value property
                        // This is because the class alternates this texture between two render targets
                        // and updates the value property after each render.
                        tFlow: flowmap.uniform,
                    },
                });

                const mesh = new Mesh(gl, { geometry, program });

                // Create handlers to get mouse position and velocity
                const isTouchCapable = 'ontouchstart' in window;
                if (isTouchCapable) {
                    window.addEventListener('touchstart', updateMouse, false);
                    window.addEventListener('touchmove', updateMouse, false);
                } else {
                    window.addEventListener('mousemove', updateMouse, false);
                }

                let lastTime;
                const lastMouse = new Vec2();
                function updateMouse(e) {
                    if (e.changedTouches && e.changedTouches.length) {
                        e.x = e.changedTouches[0].pageX;
                        e.y = e.changedTouches[0].pageY;
                    }
                    if (e.x === undefined) {
                        e.x = e.pageX;
                        e.y = e.pageY;
                    }

                    // Get mouse value in 0 to 1 range, with y flipped
                    mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

                    // Calculate velocity
                    if (!lastTime) {
                        // First frame
                        lastTime = performance.now();
                        lastMouse.set(e.x, e.y);
                    }

                    const deltaX = e.x - lastMouse.x;
                    const deltaY = e.y - lastMouse.y;

                    lastMouse.set(e.x, e.y);

                    let time = performance.now();

                    // Avoid dividing by 0
                    let delta = Math.max(42, time - lastTime);
                    lastTime = time;

                    velocity.x = deltaX / delta;
                    velocity.y = deltaY / delta;

                    // Flag update to prevent hanging velocity values when not moving
                    velocity.needsUpdate = true;
             
                }

                requestAnimationFrame(update);
                function update(t) {
                    requestAnimationFrame(update);

                    // Reset velocity when mouse not moving
                    if (!velocity.needsUpdate) {
                        mouse.set(-1);
                        velocity.set(0);
                    }
                    velocity.needsUpdate = false;

                    // Update flowmap inputs
                    flowmap.aspect = aspect;
                    flowmap.mouse.copy(mouse);

                    // Ease velocity input, slower when fading out
                    flowmap.velocity.lerp(velocity, velocity.len() ? 0.8 : 0.1);

                    flowmap.update();

                    program.uniforms.uTime.value = t * 0.1;

                    // Check if texture needs update
                    if (texture.needsUpdate) {
                        texture.update();
                        texture.needsUpdate = false;
                    }

                    renderer.render({ scene: mesh });
                }
             
            }   
            function coordinate(event) {
                let x = event.pageX/(window.innerWidth/10);
                let y = event.pageY/(window.innerHeight/10);
            //move shadow of
            console.log(x); 
            document.querySelector('.info').style.textShadow = x+ "px "+ y + "px "+ (x+y+3) +"px #000082";

       
        // document.querySelector('.about').style.fontSize= x +'em';
            }



  (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '1115383');



    
const menu = document.querySelector('.menu');
const burger = document.querySelector('.menu img:last-child'); // Assuming burger.png is the last image in the menu

burger.addEventListener('click', () => {
    menu.classList.toggle('open');
});
