import {PI, square, zip} from './utils.js'

export class RenderTree {
    constructor(n, front, back, trunk, trunk_stroke, grains, context) {
        this.n            = n
        this.one          = 1
        this.front        = front
        this.back         = back
        this.trunk        = trunk
        this.trunk_stroke = trunk_stroke
        this.grains       = grains
        // keep a copy of our canvas context for local manipulations
        this.context = context
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

    drawBranch(b) {
        var {a,r,x,y} = b

        var x1 = x + Math.cos(a-0.5*PI)*r,
            x2 = x + Math.cos(a+0.5*PI)*r,
            y1 = y + Math.sin(a-0.5*PI)*r,
            y2 = y + Math.sin(a+0.5*PI)*r

        // Clear anything previously here
        this.context.fillStyle = this.trunk
        this.fillRectN(x1,y1,1)
        this.fillRectN(x2,y2,1)

        this.context.fillStyle = this.trunk_stroke

        // Create our outline
        this.fillPixel(x1,y1)
        this.fillPixel(x2,y2)

        let makeTrunk = (xl, yl, the, dd, len) => {
            if (len == 0) return

            var scales = [];
            for(let i = 0; i <= len; i++) {
                scales[i] = Math.random() * dd * Math.random()
            }
            var xxp = scales.map((s) => xl - s*Math.cos(the))
            var yyp = scales.map((s) => yl - s*Math.sin(the))
            /*
            xxp.map((e,i) => {
                this.fillPixel(e, yyp[i])
            })
            */
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
