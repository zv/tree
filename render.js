function square(n) {
    return n * n
}

class RenderTree {
    constructor(n, front, back, trunk, trunk_stroke, grains, context) {
        this.n = n
        this.one = 1

        this.front = front
        this.back = back
        this.trunk = trunk
        this.trunk_stroke = trunk_stroke
        this.grains = grains

        // initialize our context???
        this.context = context
    }

    circle(x, y, radius) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2*Math.PI);
        this.context.stroke();
    }

    fillRect(x, y) {
        var scale = canvas.width;
        var adj_x = x * scale, adj_y = y * scale;
        this.context.fillRect(adj_x, adj_y, 1, 1)
    }

    drawBranch(b) {
        var {a,r,x,y} = b
        var x1 = x + Math.cos(a-0.5*PI)*r
        var x2 = x + Math.cos(a+0.5*PI)*r
        var y1 = y + Math.sin(a-0.5*PI)*r
        var y2 = y + Math.sin(a+0.5*PI)*r

        /*
        rx.fillStyle = this.trunk
        for(let i = 0; i < 10; i++) {
            rx.moveTo(x1, y1)
            rx.lineTo(x2, y2)
            rx.stroke()
        }
        */

        this.context.fillStyle = this.trunk_stroke

        // Create our outline
        this.fillRect(x1,y1)
        this.fillRect(x2,y2)

        var makeTrunk = (the, dd) => {
            var scale1 = dd*uniformRandom()*uniformRandom()
            var xx1 = x2 - scale1*Math.cos(the)
            var yy1 = y2 - scale1*Math.sin(the)
            this.fillRect(xx1, yy1)

            //var scale2 = dd*uniformRandom()*uniformRandom()
            // var xx2 = x2 - scale2*Math.cos(the)
            // var yy2 = y2 - scale2*Math.sin(the)

            /*
            this.fillRect(xx2, yy1)
            this.fillRect(xx1, yy2)
            this.fillRect(xx2, yy2)
            */
        }
        // Trunk shade right
        var the_val = 0.5*PI+a
        var the_dd = Math.sqrt(square(x-x2) + square(y-y2))
        makeTrunk(the_val, the_dd)

        // Trunk shade right
        the_dd = Math.sqrt(square(x-x1) + square(y-y1))
        the_val = a - 0.5*PI
        makeTrunk(the_val, the_dd)
    }
}
