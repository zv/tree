// const fname = './img/xx'
class Branch {
    constructor(tree, x, y, r, a, g) {
        this.tree = tree
        this.x    = x
        this.y    = y
        this.r    = r
        this.a    = a
        // this.i = 0
        this.g = g
    }

    step() {
        // this.r *= BRANCH_DIMINISH
        this.r -= this.tree.branch_diminish
        var angle = normalDistribution() * this.tree.branch_angle_max
        var scale = this.tree.one + this.tree.root_r - this.r
        var da = Math.pow((1+scale/this.tree.root_r), this.tree.branch_angle_exp)

        var dx = Math.cos(this.a)*this.tree.stepsize
        var dy = Math.sin(this.a)*this.tree.stepsize

        this.a += da*angle
        this.x += dx
        this.y += dy
        // this.i++
    }
}


class Tree {
    constructor(root_x, root_y, root_r,
                root_a, one, stepsize,
                branch_split_angle,
                branch_prob_scale,
                branch_diminish,
                branch_split_diminish,
                branch_angle_max,
                branch_angle_exp) {
        this.root_x                = root_x
        this.root_y                = root_y
        this.root_r                = root_r
        this.root_a                = root_a
        this.stepsize              = stepsize
        this.one                   = one
        this.branch_split_angle    = branch_split_angle
        this.branch_diminish       = branch_diminish
        this.branch_split_diminish = branch_split_diminish
        this.branch_angle_max      = branch_angle_max
        this.branch_angle_exp      = branch_angle_exp
        this.branch_prob_scale     = branch_prob_scale
        this.init()
    }

    init() {
        this.Q = []
        this.Q.push(new Branch(this,
                                this.root_x,
                                this.root_y,
                                this.root_r,
                                this.root_a,
                               0))
    }

    step() {
        var q_remove = []
        var q_new = []

        for (let [i, branch] of this.Q.entries()) {
            branch.step()

            if (branch.r <= this.one) {
                q_remove.push(i)
                continue
            }

            let branch_prob = (this.root_r - branch.r + this.one) * this.branch_prob_scale
            if (Math.random() < branch_prob) {
                let {x,y,a,r,g} = branch
                let new_r = this.branch_split_diminish*r
                let ra = (Math.pow(-1, randomInteger(2)) * uniformRandom()) * this.branch_split_angle
                q_new.push(new Branch(this, x, y, new_r, a + ra, g + 1))
            }
            else {
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
}

