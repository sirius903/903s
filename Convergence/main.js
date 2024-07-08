const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = 'white';
ctx.fillStyle = 'white';
ctx.lineWidth = 2;

let r = 200;
let theta = Math.PI / 2;

let dx = canvas.width / 2;
let dy = canvas.height / 2;

let px = 0;
let py = 0;
let pn = 4;
let phase = 1;

function animation(e){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ex = e.offsetX - dx;
    let ey = e.offsetY - dy;
    theta = ((ex != 0 ? -Math.atan(ey / ex) : Math.PI / 2) + (ex > 0 ? 0 : -Math.PI)) / 5 * 2 + Math.PI * 3 / 5;

    let n = 2 * Math.PI / theta;
    function angle(x = 1, y = -1){return Math.atan(-ey/ex) + Math.PI * (ex < 0 ? x : y) / 2;}

    if(phase == 5){
        if(angle() >= Math.PI / 3){
            phase = 4;
        }else if(angle() < -Math.PI / 3){
            phase = 1
        }
        let l = 100 * Math.pow(Math.PI * 2 / 3 - (angle() + Math.PI / 3), 6)
        for(let i = 0; i < 3; i++){
            function xy(n = Math.PI / 3 * 2){return [dx - r * Math.sin(a + n), dy - r * Math.cos(a + n)];}
            let a = angle() + Math.PI / 3 * 2 * i;
            let exy = xy(0);
            let pxy = [[dx, Math.cos], [dy, Math.sin]].map(x => (x[0] - l * x[1](-(a + Math.PI / 6 * 5))))
            ctx.beginPath();
            let axy = [0, 1].map(x => (exy[x] + xy()[x]) / 2);
            function tan(array){return (pxy[1] - array[1])/(pxy[0] - array[0]);}
            let middle = a + Math.PI / 6 * 5;
            let dif = Math.atan((tan(axy) - tan(exy))/(1 + tan(axy) * tan(exy)));
            ctx.arc(pxy[0], pxy[1], Math.sqrt((exy[0] - pxy[0]) ** 2 + (exy[1] - pxy[1]) ** 2), -middle - dif, -middle + dif, true);
            ctx.stroke();
        }
        drawTri();
    }else if([4, 3, 2].includes(phase)){
        ctx.beginPath();
        ctx.arc(dx, dy, r, Math.PI / 6 * 7, -angle(2, 0), false);
        ctx.stroke();
        if(phase == 4){
            if(angle(-3) >= -Math.PI){
                phase = 3;
            }else if(angle(-3) < -Math.PI * 5 / 3){
                phase = 5;
                ctx.beginPath();
                ctx.arc(dx, dy, r, 0, Math.PI * 2, false);
                ctx.stroke();
            }
        }else if(phase == 3){
            if(angle(-3) >= -Math.PI / 3){
                phase = 2;
            }else if(angle(-3) < -Math.PI){
                phase = 4;
            }
        }else if(phase == 2){
            if(angle() >= Math.PI / 3){
                phase = 1;
            }else if(angle() < -Math.PI / 3){
                phase = 3;
            }
        }
        if(phase == 5){
            ctx.beginPath();
            ctx.arc(dx, dy, r, 0, Math.PI * 2, false);
            ctx.stroke();
            drawTri();
        }else{
            function xy(coor, i = 0){
                let a = Math.PI * 2 / 15 * (i - phase) + Math.PI * 7 / 15;
                if(i == 0){
                    a = Math.atan(-coor[1]/coor[0]) + Math.PI * (ex < 0 ? 1 : -1) / 2;
                }else if(phase != 2){
                    if(phase - i == 2){
                        a = -Math.PI / 3;
                    }else if(phase - i == 3){
                        a = -Math.PI;
                    }
                }
                return [dx - r * Math.sin(a), dy - r * Math.cos(a)];
            }
            drawPoly(xy, [ex, ey], 4 + phase - Math.atan(ey/ex) / Math.PI / 2 * 15 + (ex < 0 ? (phase == 2 ? 3 : -1) : 1) * 15 / 4);
        }
    }else if(phase == 1){
        if(n > 3 && !(ex == 0 && ey < 0)){
            if(n >= 15) phase = 2;
        }else{
            phase = 0;
        }
        function xy(t, i = 0){
            let a = t * (5 / 2 - i);
            return [dx - r * Math.sin(a), dy - r * Math.cos(a)];
        }
        drawPoly(xy, theta, n);
    }else{
        if(n > 3 && n < 4 && pn <= 3) phase = 1;
        drawTri();
    }
    function drawTri(){
        function xy(coor, i = 0){
            let a = Math.atan(-coor[1]/coor[0]) + Math.PI * (ex < 0 ? 1 : -1) / 2 + Math.PI / 3 * 2 * i;
            return [dx - r * Math.sin(a), dy - r * Math.cos(a)];
        }
        drawPoly(xy, [ex, ey]);
    }
    px = ex, py = ey, pn = n;
}
canvas.addEventListener("mousemove", e => animation(e))

function drawPoly(xy, param, n = 3){
    ctx.beginPath();
    for(let i = 0; i < n; i++){
        ctx.lineTo(...xy(param, i));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(...xy(param, i));
        ctx.lineTo(dx, dy);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(...xy(param, i));
    }
    ctx.lineTo(...xy(param));
    ctx.stroke();

    for(let i = 0; i < n; i++){
        dot(...xy(param, i))
    }
    dot();
}

function dot(x = dx, y = dy){
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.fillStyle = 'black';

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.fillStyle = 'white';
}