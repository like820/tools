let lastScrollY = 0; // Store the last scroll position
let lastCheckTime = 0; // Store the last check time
let menu = document.querySelector('.menu');
let burger = document.querySelector('#burger');

document.addEventListener('DOMContentLoaded', () => {
    // Select all elements you want to reveal
    const textElements = document.querySelectorAll('.links h1, .links h2, .links h3');

    // Add the reveal class to each element
    textElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('reveal');
        }, index * 200); // Stagger the reveal by 200ms for each element
    });

    // Add the reveal class to the content
    document.body.classList.add('reveal-content');

    // Set a timeout to remove the overlay after the animation
    setTimeout(() => {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none'; // Hide overlay after animation
    }, 1000); // Match the duration of the animation
});

burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    console.log('burger clicked')
    // menu.classList.toggle('wet');
});

document.addEventListener('scroll', () => {
    let currentTime = Date.now();
    let currentScrollY = window.scrollY;
    let deltaScroll = currentScrollY - lastScrollY; // Calculate the delta

    if (currentTime - lastCheckTime > 82) { // Check if 820ms have passed
        if (Math.abs(deltaScroll) > 200) { // Check if the absolute delta exceeds 200
            menu.classList.remove('open');
        }

        lastScrollY = currentScrollY; // Update the last scroll position
        lastCheckTime = currentTime; // Update the last check time
    }
    // let floatie = document.querySelector('.floatie');
    // if(window.scrollY>650){
        galleryItems.forEach((item) => {
            item.classList.remove('enlarged');
        });
    // }
});


//add the mailerlist 
    (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
        .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
        n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
        (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
        ml('account', '1115383');




    //enlarge pictures on click and remove class when another gallery-item is clicked

    let galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            galleryItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove('enlarged');
                }
            });
            item.classList.toggle('enlarged');
        });
    });

//wetmode
    let checkbox = document.querySelector(".wetcheckbox");
    checkbox.addEventListener('change', () => {
        document.body.classList.toggle('wet');
 
            let blurValue = 0;
            let blurInterval = setInterval(() => {
                blurValue += 1;
                document.documentElement.style.filter = `blur(${blurValue}px)`;
                if (blurValue === 3) {
                    clearInterval(blurInterval);
                    setTimeout(() => {
                        let blurValue = 3;
                        let blurInterval = setInterval(() => {
                            blurValue -= 1;
                            document.documentElement.style.filter = `blur(${blurValue}px)`;
                            if (blurValue === 0) {
                                clearInterval(blurInterval);
                            }
                        }, 10);
                    }, 42);
                }
            }, 22);
     
    });

//tooltip for more info

let tooltip= document.querySelector(".tooltip");
document.querySelectorAll('.toggle-title').forEach(element => {
            element.addEventListener('mouseenter', (event) => {
                if (tooltip) {
                    tooltip.innerText = element.getAttribute('title');
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${event.pageX + 10}px`; // Position tooltip slightly to the right
                    tooltip.style.top = `${event.pageY + 10}px`; // Position tooltip slightly below
                    element.removeAttribute('title'); // Remove title to prevent default tooltip
                }
            });

            element.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none'; // Hide tooltip
                element.setAttribute('title', tooltip.innerText); // Restore title
            });

            element.addEventListener('click', () => {
                if (element.hasAttribute('title')) {
                    tooltip.innerText = element.getAttribute('title');
                    element.removeAttribute('title');
                } else {
                    element.setAttribute('title', tooltip.innerText);
                }
            });
        });
    

    // let emailLink = document.getElementById('email-link');
    // let copyMessage = document.getElementById('copy-message');

    // emailLink.addEventListener('click', (event) => {
    //     event.preventDefault(); // Prevent the default mailto action

    //     // Copy the email address to the clipboard
    //     let email = emailLink.getAttribute('href').replace('mailto:', '');
    //     navigator.clipboard.writeText(email).then(() => {
    //         // Show the copy message
    //         copyMessage.style.display = 'block';
    //         copyMessage.style.opacity = '1'; // Make it visible

    //         // Fade out the message after 1 second
    //         setTimeout(() => {
    //             copyMessage.style.opacity = '0'; // Start fade out
    //             setTimeout(() => {
    //                 copyMessage.style.display = 'none'; // Hide after fade out
    //             }, 500); // Match this with the CSS transition duration
    //         }, 1000); // Show for 1 second
    //     }).catch(err => {
    //         console.error('Failed to copy: ', err);
    //     });
    // });

   



    let canvas = document.getElementById('cursorCanvas');
    let ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    let cursor = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2
    };

    let shape = {
      kiki: 0.5,
      points: 12,
      size: 40,
      targetKiki: 0.5,
      targetPoints: 12,
      targetSize: 40,
      time: 0
    };

    function easeValue(current, target, speed = 0.02) {  // Slowed down easing
      return current + (target - current) * speed;
    }

    function updateCursor() {
      // Much slower cursor following
      cursor.vx = cursor.vx * 0.95 + (cursor.targetX - cursor.x) * 0.005;
      cursor.vy = cursor.vy * 0.95 + (cursor.targetY - cursor.y) * 0.005;
      
      cursor.x += cursor.vx;
      cursor.y += cursor.vy;
    }

    function drawShape() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Slower shape property updates
      shape.kiki = easeValue(shape.kiki, shape.targetKiki, 0.01);
      shape.points = easeValue(shape.points, shape.targetPoints, 0.01);
      shape.size = easeValue(shape.size, shape.targetSize, 0.01);
      shape.time += 0.01; // Slower time increment for animation

      ctx.beginPath();
      
      for (let i = 0; i <= shape.points; i++) {
        let angle = (i / shape.points) * Math.PI * 2;
        let radius = shape.size;

        // Increased base variation
        let baseVariation = Math.sin(angle * shape.points + shape.time) * (shape.size * 0.82);
        
        // Additional distance-based variation
        let mouseAngle = Math.atan2(cursor.vy, cursor.vx);
        let angleDiff = Math.abs(((angle - mouseAngle) + Math.PI) % (Math.PI * 0.82) - Math.PI);
        let distanceVariation = (1 - (angleDiff / Math.PI)) * shape.size * 1.2;

        // Combine variations based on kiki value
        radius += baseVariation * shape.kiki + distanceVariation * (1 - shape.kiki);

        let px = cursor.x + Math.cos(angle) * radius;
        let py = cursor.y + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          if (shape.kiki < 0.5) {
            // Smoother curves for bubba shapes
            let prevAngle = ((i - 1) / shape.points) * Math.PI * 2;
            let prevRadius = shape.size + 
              Math.sin(prevAngle * shape.points + shape.time) * (shape.size * 0.8) +
              (1 - (Math.abs(((prevAngle - mouseAngle) + Math.PI) % (Math.PI * 2) - Math.PI) / Math.PI)) * shape.size * 1.2;
            
            let prevPx = cursor.x + Math.cos(prevAngle) * prevRadius;
            let prevPy = cursor.y + Math.sin(prevAngle) * prevRadius;
            
            let cpx = cursor.x + Math.cos((angle + prevAngle) / 2) * ((radius + prevRadius) / 2) * 1.2;
            let cpy = cursor.y + Math.sin((angle + prevAngle) / 2) * ((radius + prevRadius) / 2) * 1.2;
            
            ctx.quadraticCurveTo(cpx, cpy, px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      
      ctx.closePath();
      ctx.strokeStyle = '#004282';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function animate() {
      updateCursor();
      drawShape();
      requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
      cursor.targetX = e.clientX;
      cursor.targetY = e.clientY;
    });

    document.querySelectorAll('.shape-target').forEach(target => {
      target.addEventListener('mouseenter', () => {
        shape.targetKiki = parseFloat(target.dataset.kiki) || 0.8;
        shape.targetPoints = parseInt(target.dataset.points) || 82;
        shape.targetSize = parseInt(target.dataset.size) || 42;
      });
      
      target.addEventListener('mouseleave', () => {
        shape.targetKiki = 0.5;
        shape.targetPoints = 12;
        shape.targetSize = 40;
      });
    });

    animate();


    let steps = document.querySelectorAll('.step');

    let observerOptions = {
        root: null, // Use the viewport as the root
        threshold: 0.2 // Trigger when 20% of the element is visible
    };
    
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add visible class
            } else {
                entry.target.classList.remove('visible'); // Remove visible class when out of view
            }
        });
    }, observerOptions);
    
    steps.forEach(step => {
        observer.observe(step); // Observe each step
    });

    // // Trigger animations on page load
    // window.addEventListener('load', () => {
    //     // Add visible class to hero image
    //     const heroImage = document.querySelector('.hero img');
    //     const headline = document.querySelector('.headline');

    //     // Add the visible class to trigger the animation
    //     heroImage.classList.add('visible');
    //     headline.classList.add('visible');
    // });


//testimonials interaction
    const testimonialContainer = document.querySelector('.testimonial-container');

    testimonialContainer.addEventListener('mouseover', () => {
        testimonialContainer.style.animationPlayState = 'paused'; // Pause scrolling
    });
    
    testimonialContainer.addEventListener('mouseout', () => {
        testimonialContainer.style.animationPlayState = 'running'; // Resume scrolling
    });
    