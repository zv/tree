import {normalDistribution, randomInteger, uniformRandom} from './utils.js'

// const fname = './img/xx'
class Branch {
    constructor(kwargs) {
        for(let k in kwargs)
            this[k] = kwargs[k]
    }

    step() {
        this.r -= this.tree.branch_diminish
        var angle = normalDistribution() * this.tree.branch_angle_max
        var scale = this.tree.one + this.tree.root_r - this.r

        var da = Math.pow((1+scale/this.tree.root_r), this.tree.branch_angle_exp)
        var dx = Math.cos(this.a)*this.tree.stepsize
        var dy = Math.sin(this.a)*this.tree.stepsize

        this.a += da*angle
        this.x += dx
        this.y += dy
    }
}

export class Tree {
    constructor(kwargs) {
        for(let k in kwargs) {
            this[k] = kwargs[k]
        }

        this.Q = []
        this.Q.push(new Branch({tree: this,
                                x: this.root_x,
                                y: this.root_y,
                                r: this.root_r,
                                a: this.root_a,
                                g: 0}))
        console.log(this)
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
            if (uniformRandom() < branch_prob) {
                let {x,y,a,r,g} = branch
                let new_r = this.branch_split_diminish*r
                let ra = (Math.pow(-1, randomInteger(2)) * uniformRandom()) * this.branch_split_angle
                q_new.push(new Branch({tree: this, x: x, y: y, r: new_r, a: a + ra, g: g + 1}))
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

