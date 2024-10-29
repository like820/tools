document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('tooltip');
  // Assuming burger.png is the last image in the menu
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
});
let menu = document.querySelector('.menu');
let burger = document.querySelector('#burger');

burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    console.log('burger clicked')
    // menu.classList.toggle('wet');
});

let lastScrollY = 0; // Store the last scroll position
let lastCheckTime = 0; // Store the last check time

document.addEventListener('scroll', () => {
    const currentTime = Date.now();
    const currentScrollY = window.scrollY;
    const deltaScroll = currentScrollY - lastScrollY; // Calculate the delta

    if (currentTime - lastCheckTime > 82) { // Check if 820ms have passed
        if (Math.abs(deltaScroll) > 200) { // Check if the absolute delta exceeds 200
            menu.classList.remove('open');
        }

        lastScrollY = currentScrollY; // Update the last scroll position
        lastCheckTime = currentTime; // Update the last check time
    }
});

    //add the mailerlist 
    (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
        .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
        n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
        (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
        ml('account', '1115383');




    //enlarge pictures on click and remove class when another gallery-item is clicked

    const galleryItems = document.querySelectorAll('.gallery-item img');

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

    document.addEventListener('scroll', () => {
        galleryItems.forEach((item) => {
            item.classList.remove('enlarged');
        });
    });


    const checkbox = document.querySelector(".wetcheckbox");
    checkbox.addEventListener('change', () => {
        document.body.classList.toggle('wet');
 
            let blurValue = 0;
            const blurInterval = setInterval(() => {
                blurValue += 1;
                document.documentElement.style.filter = `blur(${blurValue}px)`;
                if (blurValue === 3) {
                    clearInterval(blurInterval);
                    setTimeout(() => {
                        let blurValue = 3;
                        const blurInterval = setInterval(() => {
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

    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
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
    }

   