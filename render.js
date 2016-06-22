function square(n) {
    return n * n
}

// deal with it
function zip(...rows) {
    return [...rows[0]].map((_,c) => rows.map(row => row[c]))
}

class RenderTree {
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

    fillRect(x, y) {
        var scale = canvas.width;
        var adj_x = x * scale, adj_y = y * scale;
        this.context.fillRect(adj_x, adj_y, 1, 1)
    }

    fillRectN(x, y, n) {
        var scale = canvas.width;
        var adj_x = x * scale, adj_y = y * scale;
        this.context.fillRect(adj_x, adj_y, n, n)
    }

    drawBranch(b) {
        var {a,r,x,y} = b
        var x1 = x + Math.cos(a-0.5*PI)*r
        var x2 = x + Math.cos(a+0.5*PI)*r
        var y1 = y + Math.sin(a-0.5*PI)*r
        var y2 = y + Math.sin(a+0.5*PI)*r

        /*
        this.context.fillStyle = "rgb(0,0,0)"
        for(let _i = 0; _i < 10; _i++) {
            this.context.moveTo(x1, y1)
            this.context.lineTo(x2, y2)
            this.context.stroke()
        }
        */
        this.context.fillStyle = this.trunk
        this.fillRectN(x1,y1,2)
        this.fillRectN(x2,y2,2)

        this.context.fillStyle = this.trunk_stroke

        // Create our outline
        this.fillRect(x1,y1)
        this.fillRect(x2,y2)

        var makeTrunk = (xl, yl, the, dd, len) => {
            if (len == 0) return

            var scales = [];
            for(let i = 0; i <= len; i++) {
                scales[i] = Math.random() * dd * Math.random()
            }
            var xxp = scales.map((s) => xl - s*Math.cos(the))
            var yyp = scales.map((s) => yl - s*Math.cos(the))
            xxp.map((e,i) => {
                this.fillRect(e, yyp[i])
            })
            // zip(xxp,yyp).map(([xx,yy]) => this.fillRect(xx,yy))
        }

        // Trunk shade right
        console.log(x-x2, y-y2)
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
