const randomInteger = (n) => Math.floor(Math.random() * n)
const normalDistribution = () => {
    var u = 1 - Math.random() // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}
const halfPi = Math.PI / 2

class Branch {
    constructor(x, y, r, a, g, scale, grains) {
        this.x = x
        this.y = y
        this.r = r
        this.a = a
        this.g = g
        this.grains = grains
        this.scale = scale
    }

    step(vw, root_r, stepSize, branchAngleMax, branchDiminish, branchAngleExp) {
        this.r -= branchDiminish
        this.x += Math.cos(this.a) * stepSize
        this.y += Math.sin(this.a) * stepSize
        const da = Math.pow(1 + (vw + root_r - this.r) / root_r, branchAngleExp)
        this.a += da * normalDistribution() * branchAngleMax
    }

    draw(ctx) {
        const { a, r, x, y, scale, grains } = this
        const left  = [Math.cos(a + halfPi), Math.sin(a + halfPi)],
              right = [Math.cos(a - halfPi), Math.sin(a - halfPi)]
        const scaleAbsolute = a => a * r * scale
        const absoluteLeft  = left.map(scaleAbsolute),
              absoluteRight = right.map(scaleAbsolute)

        const clearTrunk = () => {
            ctx.beginPath()
            ctx.moveTo(...absoluteLeft)
            ctx.lineTo(...absoluteRight)
            ctx.stroke()
            ctx.closePath()
        }

        const shadeTrunk = (x, y, len) => {
            const dd = Math.hypot(x, y)
            for (let i = 0; i <= len; i++) {
                const stretch = scaleAbsolute(dd * Math.random() * Math.random()) - r * scale
                ctx.fillRect(x * stretch, y * stretch, 1, 1)
            }
        }

        ctx.save()
        ctx.translate(x * scale, y * scale)

        // fill interior of trunk with white (`fillStyle')
        clearTrunk()

        // draw right side of the branch
        ctx.fillRect(...absoluteRight, 1, 1)
        shadeTrunk(...right, grains)

        // draw left side of the branch
        ctx.fillRect(...absoluteLeft, 1, 1)
        shadeTrunk(...left, grains / 5)

        ctx.restore()
    }
}

export class Tree {
    constructor(kwargs) {
        for (const k in kwargs) {
            this[k] = kwargs[k]
        }

        // All of the tree's branches
        this.Q = [
            new Branch(
                this.root_x,
                this.root_y,
                this.root_r,
                this.root_a,
                0,
                this.n,
                this.grains
            ),
        ]
    }

    step() {
        for (let i = this.Q.length - 1; i >= 0; --i) {
            const branch = this.Q[i]

            // Grow our branch
            branch.step(
                this.one,
                this.root_r,
                this.stepsize,
                this.branch_angle_max,
                this.branch_diminish,
                this.branch_angle_exp
            )

            // And get rid of it if it is too small
            if (branch.r <= this.one) {
                this.Q.splice(i, 1)
                continue
            }

            // Now, roll the dice and create a new branch if we're lucky
            const branch_prob = this.root_r - branch.r + this.one
            if (Math.random() < branch_prob * this.branch_prob_scale) {
                const ra = Math.pow(-1, randomInteger(2)) * Math.random()
                this.Q.push(
                    new Branch(
                        branch.x,
                        branch.y,
                        branch.r * this.branch_split_diminish,
                        branch.a + ra * this.branch_split_angle,
                        branch.g + 1,
                        this.n,
                        this.grains
                    )
                )
            }
        }
    }

    draw(ctx) {
        for (const branch of this.Q) {
            branch.draw(ctx)
        }
    }
}
