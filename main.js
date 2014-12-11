/*
 * Belouzov Zhabotinsky reaction in canvas 2d for experimental purposes.
 */

var d = document,
canvas = d.body.appendChild( d.createElement('canvas')),
ctx = canvas.getContext('2d'),
w = canvas.width = 200,
h = canvas.height = 150;
m = Math;
floor = Math.floor;

// initialize p and q buffer selection
var p = 0;
var q = 1;
// initialize a b and c substances
var a = initializeArray(w,h);
var b = initializeArray(w,h);
var c = initializeArray(w,h);
function initializeArray(w,h){
  var arr = new Array(w);
  for (var i = 0; i < w; i++) {
    arr [i] = new Array(h);
    for(var j = 0; j < h; j++){
      arr[i][j] = new Array(2);
      arr[i][j][p]=m.random();
    }
  }
  return arr;
}
var reaction = function(a,b,c,ca,cb,cc){
  var na = a + ca*(cb-cc);
  var nb = b + cb*(cc-ca);
  var nc = c + cc*(ca-cb);
  na = na > 0 ? na : 0;
  nb = nb > 0 ? nb : 0;
  nc = nc > 0 ? nc : 0;
  na = na < 1 ? na : 1;
  nb = nb < 1 ? nb : 1;
  nc = nc < 1 ? nc : 1;
  return [na,nb,nc];
};

setInterval(function(){
  // clear canvas
  canvas.width = canvas.width;

  // for every cell
  for(var x = 0; x < w; x++ ){
    for(var y = 0; y < h; y++ ){
      var ca = 0;
      var cb = 0;
      var cc = 0;
      // average the neighborhood

      for(var i = x - 1; i <= x + 1; i++){
        for(var j = y - 1; j <= y + 1; j++){
          ca += a[(i+w )% w ][(j+h)% h ][p];
          cb += b[(i+w )% w ][(j+h)% h ][p];
          cc += c[(i+w )% w ][(j+h)% h ][p];
        }
      }

      ca /= 9.0;
      cb /= 9.0;
      cc /= 9.0;

      // calculate next concentrations
      var nextConcentrations = reaction(a[x][y][p], b[x][y][p], c[x][y][p], ca, cb, cc);


      a[x][y][q] = nextConcentrations[0];
      b[x][y][q] = nextConcentrations[1];
      c[x][y][q] = nextConcentrations[2];

   }
  }

  // switch buffer
  p = q;
  q = p === 0 ? 1: 0;

  // draw the resulting reaction

  for (x=0; x < w; x++) {
    for (y=0; y < h; y++) {
      ctx.fillStyle = 'rgb('+floor(a[x][y][q]*255)+','+floor(b[x][y][q]*255)+','+floor(c[x][y][q]*255)+')';
      ctx.fillRect(x,y,1,1);
    }
  }
},16);
