class EllipseCircle {

    /**
     * @constructor
     * 
     * @param {string} DOM selector
     * @param {array} sliders
     */
    constructor({ DOMselector, sliders }) {
        this.DOMselector = DOMselector;
        this.container = document.querySelector(this.DOMselector);  // EllipseCircle container
        this.sliderWidth = 400;                                     // EllipseCircle width
        this.sliderHeight = 400;                                    // EllipseCircle length
        this.cx = this.sliderWidth / 2;                             // EllipseCircle center X coordinate
        this.cy = this.sliderHeight / 2;                            // EllipseCircle center Y coordinate
        this.tau = 2 * Math.PI;                                     // Tau constant
        this.sliders = sliders;                                     // Sliders array with opts for each slider
        this.arcFractionSpacing = 0.85;                             // Spacing between arc fractions
        this.arcFractionLength = 10;                                // Arc fraction length
        this.arcFractionThickness = 25;                             // Arc fraction thickness
        this.arcBgFractionColor = '#D8D8D8';                        // Arc fraction color for background slider
        this.handleFillColor = '#fff';                              // EllipseCircle handle fill color
        this.handleStrokeColor = '#888888';                         // EllipseCircle handle stroke color
        this.handleStrokeThickness = 3;                             // EllipseCircle handle stroke thickness    
        this.mouseDown = false;                                     // Is mouse down
        this.activeSlider = null; 
        this.currentElement = null;                                  // Stores active (selected) slider
    }

    /**
     * Draw sliders on init
     * 
     */
    draw() {

        // Create legend UI
        // this.createLegendUI();

        // Create and append SVG holder
        const svgContainer = document.createElement('div');
        svgContainer.classList.add('svg_container');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('height', this.sliderWidth);
        svg.setAttribute('width', this.sliderHeight);
        svgContainer.appendChild(svg);
        this.container.appendChild(svgContainer);

        // Draw sliders
        this.sliders.forEach((slider, index) => this.drawSingleSliderOnInit(svg, slider, index));

        // Event listeners
       svgContainer.addEventListener('mousedown', this.mouseTouchStart.bind(this), false);
        // svgContainer.addEventListener('touchstart', this.mouseTouchStart.bind(this), false);
       svgContainer.addEventListener('mousemove', this.mouseTouchMove.bind(this), false);
        // svgContainer.addEventListener('touchmove', this.mouseTouchMove.bind(this), false);
        window.addEventListener('mouseup', this.mouseTouchEnd.bind(this), false);
        // window.addEventListener('touchend', this.mouseTouchEnd.bind(this), false);
    }

    /**
     * Draw single slider on init
     * 
     * @param {object} svg 
     * @param {object} slider 
     * @param {number} index 
     */
    drawSingleSliderOnInit(svg, slider, index) {

        // Default slider opts, if none are set
        slider.radius = slider.radius ?? 50;
        slider.min = slider.min ?? 0;
        slider.max = slider.max ?? 1000;
        slider.step = slider.step ?? 50;
        slider.initialValue = slider.initialValue ?? 0;
        slider.color = slider.color ?? '#FF5733';

        // Calculate slider circumference
        // const circumference = slider.radius * this.tau;

        // Calculate initial angle
        const initialAngle = 90;

        // Calculate spacing between arc fractions
        // const arcFractionSpacing = this.calculateSpacingBetweenArcFractions(circumference, this.arcFractionLength, this.arcFractionSpacing);

        // Create a single slider group - holds all paths and handle
        const sliderGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        sliderGroup.setAttribute('class', 'sliderSingle');
        sliderGroup.setAttribute('data-slider', index);
        // sliderGroup.setAttribute('transform', 'rotate(-90,' + this.cx + ',' + this.cy + ')');
        sliderGroup.setAttribute('rad', slider.radius);
        svg.appendChild(sliderGroup);
        
        // Draw background arc path
        this.drawArcPath('#2D2E2B', slider.radius, 'bg', sliderGroup, '4', '2');

        // Draw active arc path
        this.drawArcPath('orange', slider.radius, 'active', sliderGroup , '2' , '1');

        // Draw handle
        this.drawHandle(slider, initialAngle, sliderGroup, 'sliderHandle', this.cx, this.cy);
        // Draw handle
        this.drawHandle(slider, initialAngle + 180, sliderGroup, 'sliderHandle2' , this.cx, this.cy);
        this.activeSlider = sliderGroup;
    }

    /**
     * Output arch path
     * 
     * @param {number} cx 
     * @param {number} cy 
     * @param {string} color 
     * @param {number} angle 
     * @param {number} singleSpacing 
     * @param {string} type 
     */
    drawArcPath( color, radius, type, group, width , width2 ) {

        // EllipseCircle path class
        const pathClass = (type === 'active') ? 'sliderSinglePathActive' : 'sliderSinglePath';

        // Create svg path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        path.classList.add(pathClass);
        path.setAttribute('cx', this.cx.toString());
        path.setAttribute('cy', this.cy.toString());
        path.setAttribute('rx', radius);
        path.setAttribute('ry', radius);
        // path.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, angle));
        path.style.stroke = color;
        path.style.strokeWidth = width;
        path.style.fill = 'none';
        // path.setAttribute('stroke-dasharray', this.arcFractionLength + ' ' + singleSpacing);
        group.appendChild(path);
        rect.classList.add(pathClass);
        rect.setAttribute('x', (this.cx / 2).toString());
        rect.setAttribute('y', (this.cy / 2).toString());
        rect.setAttribute('width', 2 * radius);
        rect.setAttribute('height', 2 * radius);
        // rect.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, angle));
        rect.style.stroke = color;
        rect.style.strokeWidth = width2;
        rect.style.fill = 'none';
        rect.setAttribute('stroke-dasharray', width2);
        group.appendChild(rect);
    }

    /**
     * Draw handle for single slider
     * 
     * @param {object} slider 
     * @param {number} initialAngle 
     * @param {group} group 
     */
    drawHandle(slider, initialAngle, group, className , cx , cy) {

        // Calculate handle center
        const handleCenter = this.calculateHandleCenter(initialAngle * this.tau / 360, slider.radius, cx , cy );

        // Draw handle
        const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        handle.setAttribute('class', className);
        handle.setAttribute('cx', handleCenter.x);
        handle.setAttribute('cy', handleCenter.y);
        handle.setAttribute('r', 6);
        handle.style.stroke = '#2B2D2E';
        handle.style.strokeWidth = 1;
        handle.style.fill = 'orange';
        handle.style.cursor = 'nwse-resize';
        group.appendChild(handle);
        handle.addEventListener('mousedown', this.mouseTouchStart.bind(this), false);
        // handle.addEventListener('touchstart', this.mouseTouchStart.bind(this), false);
        handle.addEventListener('mousemove', this.mouseTouchMove.bind(this), false);
        
    }

    /**
     * Redraw active slider
     * 
     * @param {element} activeSlider
     * @param {obj} rmc
     */
    redrawActiveSlider(rmc, e) {
        // const activePath = this.activeSlider.querySelector('.sliderSinglePathActive');
        const radius = +this.activeSlider.getAttribute('rad');
        const currentAngle = this.calculateMouseAngle(rmc) * 0.999;

        console.log('e', e, e.srcElement.classList.contains('sliderHandle'));
        if(this.currentElement = 'sliderHandle'){
            let handle = this.activeSlider.querySelector('.sliderHandle');
            let handleCenter = this.calculateHandleCenter(currentAngle, radius , this.cx, this.cy);
            handle.setAttribute('cx', handleCenter.x);
            handle.setAttribute('cy', handleCenter.y);
            handle = this.activeSlider.querySelector('.sliderHandle2');
            // handleCenter = this.calculateHandleCenter(currentAngle, radius , this.cx, this.cy);
            // console.log('t', currentAngle);
            handle.setAttribute('cx', 400 - handleCenter.x);
            handle.setAttribute('cy', 400 - handleCenter.y);
        } else{
            let handle = this.activeSlider.querySelector('.sliderHandle2');
            let handleCenter = this.calculateHandleCenter(currentAngle, radius , this.cx, this.cy);
            handle.setAttribute('cx', handleCenter.x);
            handle.setAttribute('cy', handleCenter.y);
            handle = this.activeSlider.querySelector('.sliderHandle');
            // handleCenter = this.calculateHandleCenter(currentAngle + 180, radius , this.cx, this.cy);
            // console.log('t', currentAngle);
            handle.setAttribute('cx', 400 - handleCenter.x);
            handle.setAttribute('cy', 400 - handleCenter.y);
        }

        // Redraw active path
        // activePath.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, this.radiansToDegrees(currentAngle)));

        // Redraw handle
        // const handle = this.activeSlider.querySelector('.sliderHandle');
        // const handleCenter = this.calculateHandleCenter(currentAngle, radius , this.cx, this.cy);
        // // console.log('t', currentAngle);
        // handle.setAttribute('cx', handleCenter.x);
        // handle.setAttribute('cy', handleCenter.y);

        // Update legend
        // this.updateLegendUI(currentAngle);
    }

    /**
     * Mouse down / Touch start event
     * 
     * @param {object} e 
     */
    mouseTouchStart(e) {
        if (this.mouseDown) return;
        this.mouseDown = true;

        if(e.srcElement.classList.contains('sliderHandle')){
            this.currentElement = 'sliderHandle';
        } else{
            this.currentElement = 'sliderHandle2';
            
        }
        // const rmc = this.getRelativeMouseOrTouchCoordinates(e);
        // this.findClosestSlider(rmc);
        // this.redrawActiveSlider(rmc);
    }

    /**
     * Mouse move / touch move event
     * 
     * @param {object} e 
     */
    mouseTouchMove(e) {
        if (!this.mouseDown) return;
        // e.preventDefault();
        const rmc = this.getRelativeMouseOrTouchCoordinates(e);
        this.redrawActiveSlider(rmc, e);
    }

    /**
     * Mouse move / touch move event
     * Deactivate slider
     * 
     */
    mouseTouchEnd() {
        if (!this.mouseDown) return;
        this.mouseDown = false;
        // this.activeSlider = null;
    }

    // /**
    //  * Calculate number of arc fractions and space between them
    //  * 
    //  * @param {number} circumference 
    //  * @param {number} arcBgFractionLength 
    //  * @param {number} arcBgFractionBetweenSpacing 
    //  * 
    //  * @returns {number} arcFractionSpacing
    //  */
    // calculateSpacingBetweenArcFractions(circumference, arcBgFractionLength, arcBgFractionBetweenSpacing) {
    //     const numFractions = Math.floor((circumference / arcBgFractionLength) * arcBgFractionBetweenSpacing);
    //     const totalSpacing = circumference - numFractions * arcBgFractionLength;
    //     return totalSpacing / numFractions;
    // }

    // /**
    //  * Helper functiom - describe arc
    //  * 
    //  * @param {number} x 
    //  * @param {number} y 
    //  * @param {number} radius 
    //  * @param {number} startAngle 
    //  * @param {number} endAngle 
    //  * 
    //  * @returns {string} path
    //  */
    // describeArc (x, y, radius, startAngle, endAngle) {
    //     let path,
    //         endAngleOriginal = endAngle, 
    //         start, 
    //         end, 
    //         arcSweep;

    //     if(endAngleOriginal - startAngle === 360)
    //     {
    //         endAngle = 359;
    //     }

    //     start = this.polarToCartesian(x, y, radius, endAngle);
    //     end = this.polarToCartesian(x, y, radius, startAngle);
    //     arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    //     path = [
    //         'M', start.x, start.y,
    //         'A', radius, radius, 0, arcSweep, 0, end.x, end.y
    //     ];

    //     if (endAngleOriginal - startAngle === 360) 
    //     {
    //         path.push('z');
    //     } 

    //     return path.join(' ');
    // }

    // /**
    //  * Helper function - polar to cartesian transformation
    //  * 
    //  * @param {number} centerX 
    //  * @param {number} centerY 
    //  * @param {number} radius 
    //  * @param {number} angleInDegrees 
    //  * 
    //  * @returns {object} coords
    //  */
    //  polarToCartesian (centerX, centerY, radius, angleInDegrees) {
    //     const angleInRadians = angleInDegrees * Math.PI / 180;
    //     const x = centerX + (radius * Math.cos(angleInRadians));
    //     const y = centerY + (radius * Math.sin(angleInRadians));
    //     return { x, y };
    // }

    /**
     * Helper function - calculate handle center
     * 
     * @param {number} angle 
     * @param {number} radius
     * 
     * @returns {object} coords 
     */
    calculateHandleCenter (angle, radius , cx , cy) {
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        return { x, y };
    }

    /**
     * Get mouse/touch coordinates relative to the top and left of the container
     *  
     * @param {object} e
     * 
     * @returns {object} coords
     */ 
    getRelativeMouseOrTouchCoordinates (e) {
        const containerRect = document.querySelector('.svg_container').getBoundingClientRect();
        let x, 
            y, 
            clientPosX, 
            clientPosY;
 
        // Touch Event triggered
        if (window.TouchEvent && e instanceof TouchEvent) 
        {
            clientPosX = e.touches[0].pageX;
            clientPosY = e.touches[0].pageY;
        }
        // Mouse Event Triggered
        else 
        {
            clientPosX = e.clientX;
            clientPosY = e.clientY;
        }

        // Get Relative Position
        x = clientPosX - containerRect.left;
        y = clientPosY - containerRect.top;
        // console.log('clientPosX,clientPosY',clientPosX,clientPosY,e,x, y);
        return { x, y };
    }

    /**
     * Calculate mouse angle in radians
     * 
     * @param {object} rmc 
     * 
     * @returns {number} angle
     */
    calculateMouseAngle(rmc) {
        const angle = Math.atan2(rmc.y - this.cy, rmc.x - this.cx);

        // if (angle > - this.tau / 2 && angle < - this.tau / 4) 
        // {
        //     return angle + this.tau * 1.25;
        // } 
        // else 
        // {
        //     return angle + this.tau * 0.25;
        // }
        return angle;
    }

    // /**
    //  * Helper function - transform radians to degrees
    //  * 
    //  * @param {number} angle 
    //  * 
    //  * @returns {number} angle
    //  */
    // radiansToDegrees(angle) {
    //     return angle / (Math.PI / 180);
    // }

    /**
     * Find closest slider to mouse pointer
     * Activate the slider
     * 
     * @param {object} rmc
     */
    // findClosestSlider(rmc) {
    //     const mouseDistanceFromCenter = Math.hypot(rmc.x - this.cx, rmc.y - this.cy);
    //     const container = document.querySelector('.svg_container');
    //     const sliderGroups = Array.from(container.querySelectorAll('g'));

    //     // Get distances from client coordinates to each slider
    //     const distances = sliderGroups.map(slider => {
    //         const rad = parseInt(slider.getAttribute('rad'));
    //         return Math.min( Math.abs(mouseDistanceFromCenter - rad) );
    //     });

    //     // Find closest slider
    //     const closestSliderIndex = distances.indexOf(Math.min(...distances));
    //     this.activeSlider = sliderGroups[closestSliderIndex];
    //     console.log(this.activeSlider);
    // }
}

  
  