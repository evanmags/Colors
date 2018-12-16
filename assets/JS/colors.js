// variable definitions
    //element selectors
    var body = document.querySelector("body");
    var container = document.querySelector(".container");
    var footer = document.querySelector(".footer");
    var generate = document.querySelector("#generator");
    var invert = document.querySelector("#invertor");
    var previous = document.querySelector(".prev");
    var next = document.querySelector(".next");
    var selectColorType = document.querySelector("#selectColorType");
    var spanA = document.querySelector(".spanA");
    var spanB = document.querySelector(".spanB");
    var undo = document.querySelector("#undo");
    var icon = document.getElementsByClassName("tog");
    var toggle = document.getElementById("controlToggle");
    var controls = document.getElementById("controls");
    var colorType = document.getElementById("colorType");
    var converted = document.getElementById("converted1");
    var resetButton = document.getElementById("reset");

    // text value variables
    var aTextI = "The color you inverted to is: ";
    var aTextG = "The color you generated is: ";
    var aTextC = "The color you created is: ";
    var bTextI = "The your original color is: ";
    var bTextG = "The inverse of your color is: ";
    var bTextC = " ";

    //manipulated variables
    var color;
    var inverse;
    var index;
    let t = selectColorType.value;
    let r;
    let g;
    let b;
    let a;
    var ri;
    var gi;
    var bi;

    let xP;
    let zP;
    let yP;

    // array defined variables
    var colorList = [];
        //colorList  data structure: [type, color, inverse]
        //-----------------------------------------------------// 
            // [{type: one of hex3/hex6/rgb/rgba/hsl/hsla,
        //-----------------------------------------------------// 
            // color: {color: the actual color String
                //  r: red value (stored as hex or decimal) or hue,
                //  g: green or Saturation (stored as hex or decimal),
                //  b: blue or lightness (stored as hex or decimal),
                //  a: default 0, or 0-1 if rgba or hsla},
        //-----------------------------------------------------//    
            //inverse: {color: the actual String
                //  r: red  or hue,
                //  g: green or Saturation
                //  b: blue or lightness,
                //  a: default 0, or 0-1 if rgba or hsla}}]
        //-----------------------------------------------------//  

    var pList = document.querySelectorAll(".primary");
    var sList = document.querySelectorAll(".secondary");
    var tiles = document.querySelectorAll(".tile");
    var labels = document.querySelectorAll("label");
        var s1l = labels[1];
        var s2l = labels[2];
        var s3l = labels[3];
    var sliders = document.querySelectorAll("input");
        var s1s = sliders[0];
        var s2s = sliders[1];
        var s3s = sliders[2];
    var slideDisp = document.querySelectorAll(".sDisp");
        var s1d = slideDisp[0];
        var s2d = slideDisp[1];
        var s3d = slideDisp[2];

//Boolian Rules:
    //true = inverse
    //false = color

// listener events for buttons, sliders and drop down
    // listeners for single target variables
    generate.addEventListener("click", function(){
        generateColor(t);
        rgbToHex6(t, r, g, b, false); //color
        rgbToHex6(t, ri, gi, bi, true); //inverse
        hex6ToHex3(t, r, g, b, false); //color
        hex6ToHex3(t, ri, gi, bi, true); //inverse
        rgbToString(t, r, g, b, a, false);
        rgbToString(t, ri, gi, bi, a, true);
        logEntry(t, color, r, g, b, a, inverse, ri, gi, bi)
        display(t, colorList, 0)
        if(colorList.length > 1 && colorList.length < 7){
            reveal(tiles[colorList.length-2]);
        };
        reveal(previous);
        tileColors();
    });

    invert.addEventListener("click", function(){
        if(p === colorList[0].inverse){
            p = colorList[0].color;
            s = colorList[0].inverse;
        }
        else{
            s = colorList[0].color;
            p = colorList[0].inverse;
        }
        textDisplay(aTextI, bTextI, p['color'], s['color']);
        colorDisplay(p['color'], s['color'])
        slideValues(t, p['r'], p['g'], p['b']);
    });

    previous.addEventListener("click", backwards);
    next.addEventListener("click", forwards);
    undo.addEventListener("click", init);
    toggle.addEventListener("click", showControls);
    selectColorType.addEventListener("change", function(){
        t = selectColorType.value;
        colorType.textContent = t;
        slideLabels(t);
        if(colorList[0].type === 'hex6' && t === 'hex3'){
            hex6ToHex3(t, r, g, b, false) 
            slideValues(t, r, g, b);
        }
        else if(colorList[0].type === 'hex3' && t === 'hex6'){
            slideValues(t, r, g, b);
        }
        else{
            slideValues(t, p['r'], p['g'], p['b']);
        } 
    });
    resetButton.addEventListener('click', function(){
        index = 0;
        hide(next);
        reveal(previous);
        selectColorType.value = colorList[0].type;
        slideValues(t, colorList[0].color['r'], colorList[0].color['g'], colorList[0].color['b']);
        colorDisplay(colorList[0].color['color'], colorList[0].inverse['color']);
        textDisplay(aTextG, bTextG, colorList[0].color['color'], colorList[0].inverse['color'])
    })
    
    // listeners for array stored (multi-target) variables
    for(x = 0; x < 5; x++){
        tiles[x].addEventListener("click", function(e){
                display(colorList[this.id].type, colorList, this.id);
        });
    };
    for(x = 0; x < 3; x++){
        sliders[x].addEventListener("mousemove", function(){
            sliderControledColorChange(t, s1s.value, s2s.value, s3s.value);
        });
        sliders[x].addEventListener("click", function(){
            textDisplay(aTextC, "", color, "")
        });
    }

//Function definitions
//determine color type

//set r, g, b values && ri, gi, bi values
    function setRGBA(type, rx, gx, bx, ax, boolian){
        if(!boolian){
            if(type === 'hex6'){
                padZero(rx, gx, bx, boolian);
                a = ax;
            }
            else{
                r = rx
                g = gx
                b = bx
                a = ax
            }
            return r, g, b, a;
        }
        else{
            if(type === 'hex6'){
                padZero(rx, gx, bx, boolian);
            }
            else{
                ri = rx
                gi = gx
                bi = bx
                a = ax
            }
            return ri, gi, bi, a;
        }
    }

//generate r, g, b values
    function generateColor(x){
        if(x === 'rgb' || x === 'rgba' || x === 'hex6' || x === 'hex3'){
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
        }
        else if(x === 'hsl' || x === 'hsla'){
            //use the same variables names as other colors to avoid unused variables or value confusion
            r = Math.floor(Math.random() * 361); //h
            g = Math.floor(Math.random() * 101); //s
            b = Math.floor(Math.random() * 101); //l
        }
        
        //generate a value if necessary default is 1;
        if(x === 'rgba' || x === 'hsla'){
            a = Math.floor(Math.random() * 100) / 100;
        }
        else{
            a = 1;
        }
        calculateInverse(x, r, g, b)
        return r, g, b, a, index = 0;
    }
    
//convert rgb to hex6  if necessary (xh6 = hex6 variant of any color)
    function rgbToHex6(t, r, g, b, boolian){
        if(t === "hex6" || t === "hex3"){
            rx = r.toString(16);
            gx = g.toString(16);
            bx = b.toString(16);

            setRGBA(t, rx, gx, bx, a, boolian);

        }
    }

//convert hex6 to hex3  if necessary (xh3 = hex3 variant of any color)
    function hex6ToHex3(x, rh6, gh6, bh6, boolian){
        if(x === "hex3"){
            rh3 = rh6[0];
            gh3 = gh6[0];
            bh3 = bh6[0];
        
            setRGBA(t, rh3, gh3, bh3, a, boolian);
      }
    }
    
//concatenate to inverse string
function rgbToString(x, r, g, b, a, boolian){
    if(x === 'hex3' || x === 'hex6'){
       q = '#' + r + g + b;
    } else if(x === 'rgb'){
       q = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    } else if(x === 'rgba'){
       q = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    } else if(x === 'hsl'){
       q = 'hsl(' + r + ', ' + g + '%, ' + b + '%)';
    } else if(x === 'hsla'){
       q = 'hsla(' + r + ', ' + g + '%, ' + b + '%, ' + a + ')';
    }

    if(boolian){
        inverse = q;
        return inverse;
    }
    else{
        color = q;
        return color;
    }
}
    
//inverse color functions
// convert r, g, b to inverse
    function calculateInverse(x, r, g, b){
        if(x === 'rgb' || x === 'rgba' || x === 'hex6' || x === 'hex3'){
            ri = 255 - r;
            gi = 255 - g;
            bi = 255 - b;
        }
        else if(x === 'hsl' || x === 'hsla'){
            //use the same logic as generator
            ri = 360 - r; //h
            gi = 100 - g; //s
            bi = 100 - b; //l
        }
        return ri, gi, bi;
    }

//add variables to array and objects    
//unshift all variables into colorList
    function logEntry(t, color, r, g, b, a, inverse, ri, gi, bi){
        colorList.unshift(
            {type: t, color: {color: color, r: r, g: g, b: b, a: a},
                    inverse: {color: inverse, r: ri, g: gi, b: bi, a: a}
        });
    }

//convert hex3 to hex 6
    function hex3ToHex6(rh3, gh3, bh3, boolian){
            rh6 = rh3 + rh3;
            gh6 = gh3 + gh3;
            bh6 = bh3 + bh3;
            
            setRGBA(t, rh6, gh6, bh6, a, boolian);
    }


//display settings
    function display(t, x, i){
        p = x[i].color
        s = x[i].inverse;
        textDisplay(aTextG, bTextG, p['color'], s['color']);
        colorDisplay(p['color'], s['color'])
        slideLabels(t)
        slideValues(t, p['r'], p['g'], p['b']);
    }
    
    function initDisplay(t, x, i){
        p = x[i].color
        s = x[i].inverse;
        textDisplay('Generate a Color!', bTextC, bTextC, bTextC);
        colorDisplay(p['color'], s['color'])
        slideLabels(t)
        slideValues(t, p['r'], p['g'], p['b']);
    }

// Function definitions
    // Initiation function (also used on reset)
    function init(){
        colorList = []
        hide(previous);
        hide(next);
        for(var x = 0; x < 5; x++){
            hide(tiles[x]);
        }

        generateColor(t);
        rgbToHex6(t, r, g, b, false); //color
        hex6ToHex3(t, r, g, b, false); //color
        rgbToHex6(t, ri, gi, bi, true); //inverse
        hex6ToHex3(t, ri, gi, bi, true); //inverse
        rgbToString(t, r, g, b, a, false)
        rgbToString(t, ri, gi, bi, a, true);
        logEntry(t, color, r, g, b, a, inverse, ri, gi, bi)
        initDisplay(t, colorList, 0)
        for(var x = 0; x < 5; x++){
            hide(tiles[x]);
        }

        console.log("init to winit");
    }

//button functions, to trigger on user action

    function forwards(){
        index--;
        display(t, colorList, index);
        reveal(previous);
        if(index <= 0){
            hide(next);
        }
    }

    function backwards(){
        index++;
        display(t, colorList, index);
        reveal(next);
        if(index === colorList.length - 1){
            hide(previous);
        }
    }

    function tileColors(){
        for(var i = 0; i < 5; i++){
            if(colorList[i+1]){
                pList[i].style.backgroundColor = colorList[i+1].color['color'];
                sList[i].style.backgroundColor = colorList[i+1].inverse['color'];
            }
        }
    }

    function textDisplay(a, b, c, i){
        spanA.textContent = a + c;
        spanB.textContent = b + i;
        }
    
    function colorDisplay(c, i){   
        body.style.background = c;
        spanB.style.color = i;
    }

    function slideLabels(type){
        if(type === "hsl" || type === "hsla"){
            s1l.textContent = "Hue:";
            s2l.textContent = "Saturation:";
            s3l.textContent = "Lightness:";

            s1s.max = 360;
            s2s.max = 100;
            s3s.max = 100;
        }
        else{
            if(type === 'hex3'){
                s1s.max = 15;
                s2s.max = 15;
                s3s.max = 15;
            }
            else{
                s1s.max = 255;
                s2s.max = 255;
                s3s.max = 255;
            }

            s1l.textContent = "Red:";
            s2l.textContent = "Green:";
            s3l.textContent = "Blue:";
        }
    }

    //text display functions
    function sliderControledColorChange(x, rx, gx, bx){
        if(x === 'hex6' || x === 'hex3'){
            rv = parseInt(rx).toString(16);
            gv = parseInt(gx).toString(16);
            bv = parseInt(bx).toString(16); 
        }
        else{
            rv = s1s.value;
            gv = s2s.value;
            bv = s3s.value;
        }
        
        setRGBA(t, rv, gv, bv, a, false)

        s1d.textContent = r;
        s2d.textContent = g;
        s3d.textContent = b;

        rgbToString(t, r, g, b, a, false)
        colorDisplay(color, "")
    }    

    function slideValues(x, r, g, b){
        if(x === 'hex3'){
            hex3ToHex6(r, g, b);

            rv = parseInt(r, 16);
            gv = parseInt(g, 16);
            bv = parseInt(b, 16);
        }
        else if(x === 'hex6'){
            rv = parseInt(r, 16);
            gv = parseInt(g, 16);
            bv = parseInt(b, 16);
        }
        else{
            rv = r;
            gv = g;
            bv = b;
        }
        s1s.value = rv;
        s2s.value = gv;
        s3s.value = bv;

        s1d.textContent = r;
        s2d.textContent = g;
        s3d.textContent = b;
    }

    function hide(x){
        x.classList.add("hide");
    }

    function reveal(x){
        x.classList.remove("hide");
    }

    function showControls(){
        container.classList.toggle("large");
        controls.classList.toggle("hidden");
        footer.classList.toggle("hidden");
        icon[0].classList.toggle("hide");
        icon[1].classList.toggle("hide");
    }
//padding functions for inverse and
    function padZero(x, y, z, boolian){
        
        if(!x[1]){ red = String("0" + x);} 
        else{ red = x; };

        if(!y[1]){ green = String("0" + y);} 
        else{ green = y; };

        if(!z[1]){ blue = String("0" + z);}
        else{ blue = z; };

        if(boolian){
            ri = red;
            gi = green;
            bi = blue;
        }
        else{
            r = red;
            g = green;
            b = blue;
        }
    }

//functions to run on load, without user interaction
init();