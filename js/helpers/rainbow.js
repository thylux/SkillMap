//
// Adapted from
// http://blog.adamcole.ca/2011/11/simple-javascript-rainbow-color.html
//
function rainbow(numOfSteps, step) {
    let r, g, b;
    let brightness = 0.9; 
    let h = step / numOfSteps;
    let i = ~~(h * 6); // ~~ is a faster substitute for Math.floor http://stackoverflow.com/questions/5971645/what-is-the-double-tilde-operator-in-javascript
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    
    let c = "#" + ("00" + (~ ~(r * 255 * brightness)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255 * brightness)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255 * brightness)).toString(16)).slice(-2);
    return (c);
}