import {PI, square, zip} from './utils.js'

export class RenderTree {
    constructor(kwargs) {
        for (let k in kwargs) {
            this[k] = kwargs[k]
        }
    }

    // Fill in a pixel on the canvas
    fillPixel(x, y) {
        this.fillRectN(x, y, 1)
    }

    // Fill in a square of size N
    fillRectN(x, y, n) {
        let scale = this.n;
        let adj_x = x * scale, adj_y = y * scale;
        this.context.fillRect(adj_x, adj_y, n, n)
    }

    fillLine(start, end) {
        let ctx = this.context
        let scale = this.n;

        ctx.beginPath();
        ctx.moveTo(scale * start.x, scale * start.y);
        ctx.lineTo(scale * end.x, scale * end.y);
        ctx.stroke();
    }

    drawBranch(b) {
        var {a,r,x,y} = b

        var x1 = x + Math.cos(a-0.5*PI)*r,
            x2 = x + Math.cos(a+0.5*PI)*r,
            y1 = y + Math.sin(a-0.5*PI)*r,
            y2 = y + Math.sin(a+0.5*PI)*r


        let ctx = this.context

        // Make our line white & one pixel wide
        ctx.strokeStyle = this.trunk
        ctx.lineWidth = 2
        this.fillLine(
            {x: x1, y: y1}, // start
            {x: x2, y: y2}  // end
        )

        ctx.fillStyle = this.trunk_stroke

        // Create our outline
        this.fillPixel(x1,y1)
        this.fillPixel(x2,y2)

        let makeTrunk = (xl, yl, the, dd, len) => {
            var scales = [];

            for(let i = 0; i <= len; i++) {
                scales[i] = Math.random() * dd * Math.random()
            }
            let xxp = scales.map((s) => xl - s*Math.cos(the)),
                yyp = scales.map((s) => yl - s*Math.sin(the))
            zip(xxp,yyp).map(([xx,yy]) => this.fillPixel(xx,yy))
        }

        // Trunk shade right
        makeTrunk(x2, y2,
                  0.5*PI+a,                               // val
                  Math.sqrt(square(x-x2) + square(y-y2)), // dd
                  this.grains)                            // len

        // Trunk shade left
        makeTrunk(x1, y1,
                  a - 0.5*PI,                             // val
                  Math.sqrt(square(x-x1) + square(y-y1)), // dd
                  this.grains/5)                          // len
    }
}
