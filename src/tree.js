const square = (n) => Math.pow(n, 2)
const randomInteger = (n) => Math.floor(Math.random() * n)
const normalDistribution = () => {
    var u = 1 - Math.random() // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

class Branch {
    constructor(kwargs) {
        for (let k in kwargs) this[k] = kwargs[k]
    }

    step() {
        this.r -= this.tree.branch_diminish
        const angle = normalDistribution() * this.tree.branch_angle_max
        const scale = this.tree.one + this.tree.root_r - this.r

        // Calculate our Thue path and...
        const da = Math.pow(
            1 + scale / this.tree.root_r,
            this.tree.branch_angle_exp
        )
        const dx = Math.cos(this.a) * this.tree.stepsize
        const dy = Math.sin(this.a) * this.tree.stepsize

        // Increment
        this.a += da * angle
        this.x += dx
        this.y += dy
    }

    draw(ctx) {
        const { a, r, x, y } = this
        const scale = this.tree.n
        const x1 = x + Math.cos(a - 0.5 * Math.PI) * r,
            x2 = x + Math.cos(a + 0.5 * Math.PI) * r,
            y1 = y + Math.sin(a - 0.5 * Math.PI) * r,
            y2 = y + Math.sin(a + 0.5 * Math.PI) * r

        // Make our line white & one pixel wide
        const fillLine = (start, end) => {
            ctx.beginPath()
            ctx.moveTo(scale * start.x, scale * start.y)
            ctx.lineTo(scale * end.x, scale * end.y)
            ctx.stroke()
        }
        fillLine({ x: x1, y: y1 }, { x: x2, y: y2 })

        // Create our outline
        const fillPixel = (x, y) => ctx.fillRect(x * scale, y * scale, 1, 1)
        fillPixel(x1, y1)
        fillPixel(x2, y2)

        // shade the trunk of this branch
        const makeTrunk = (xl, yl, the, len) => {
            let dd = Math.sqrt(square(x - xl) + square(y - yl))

            for (let i = 0; i <= len; i++) {
                let s = Math.random() * Math.random() * dd
                fillPixel(xl - s * Math.cos(the), yl - s * Math.sin(the))
            }
        }

        // left trunk
        makeTrunk(x1, y1, a - 0.5 * Math.PI, this.tree.grains / 5)

        // right trunk
        makeTrunk(x2, y2, 0.5 * Math.PI + a, this.tree.grains)
    }
}

export class Tree {
    constructor(kwargs) {
        for (let k in kwargs) {
            this[k] = kwargs[k]
        }

        this.Q = [] // All of the tree's branches
        let branch = new Branch({
            tree: this,
            x: this.root_x,
            y: this.root_y,
            r: this.root_r,
            a: this.root_a,
            g: 0,
        })
        this.Q.push(branch)
    }

    /*
     * Generate the next iteration of the Tree's growth
     */
    step() {
        var q_remove = [] // What we will prune
        var q_new = [] // Any new branches we might grow

        for (let [i, branch] of this.Q.entries()) {
            branch.step() // Grow our branch

            if (branch.r <= this.one) {
                // And get rid of it if it is too small
                q_remove.push(i)
                continue
            }

            // Now, roll the dice and create a new branch if we're lucky
            let branch_prob = this.root_r - branch.r + this.one
            if (Math.random() < branch_prob * this.branch_prob_scale) {
                let ra = Math.pow(-1, randomInteger(2)) * Math.random()
                q_new.push(
                    new Branch({
                        tree: this,
                        x: branch.x,
                        y: branch.y,
                        r: branch.r * this.branch_split_diminish,
                        a: branch.a + ra * this.branch_split_angle,
                        g: branch.g + 1,
                    })
                )
            } else {
                // Otherwise just keep growing our branch!
                q_remove.push(i)
                q_new.push(branch)
            }
        }

        q_remove.reverse()

        for (let r of q_remove) {
            this.Q.splice(r, 1)
        }

        this.Q = this.Q.concat(q_new)
    }

    draw(ctx) {
        ctx.lineWidth = 2
        ctx.strokeStyle = this.trunk
        ctx.fillStyle = this.trunk_stroke

        for (let branch of this.Q) {
            branch.draw(ctx)
        }
    }
}
