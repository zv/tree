import { Tree } from './tree.js'

const canvas = document.getElementById('tree')

export const config = {
    mid: 0.5,
    branch_split_diminish: 0.71,
    branch_split_angle: 0.3 * Math.PI,
    branch_angle_exp: 2,
    trunk_stroke: 'black',
    trunk: 'white',
    trunk_shade: 'rgba(0,0,0,0.5)',
    init_branch: 0.03,

    get size() {
        return canvas.width
    },

    get branch_angle_max() {
        return (5 * Math.PI) / this.size
    },

    get grains() {
        return Math.ceil(this.size * 0.02)
    },

    get branch_diminish() {
        return this.one / 32
    },

    get one() {
        return 1 / this.size
    },

    get branch_prob_scale() {
        return (this.one / this.init_branch) * 18
    },
}

export function draw() {
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d')

        const tree = new Tree({
            context: ctx,
            root_x: config.mid,
            root_y: 1.0,
            root_r: config.init_branch,
            root_a: -1 * Math.PI * 0.5,
            stepsize: config.one,
            one: config.one,
            branch_split_angle: config.branch_split_angle,
            branch_prob_scale: config.branch_prob_scale,
            branch_diminish: config.branch_diminish,
            branch_split_diminish: config.branch_split_diminish,
            branch_angle_max: config.branch_angle_max,
            branch_angle_exp: config.branch_angle_exp,
            n: config.size,
            trunk: config.trunk,
            trunk_stroke: config.trunk_stroke,
            grains: config.grains,
        })

        ctx.lineWidth = 2
        ctx.fillStyle = tree.trunk_stroke
        ctx.strokeStyle = tree.trunk

        const drawStep = () => {
            if (tree.Q.length > 0) {
                tree.step()
                window.requestAnimationFrame(drawStep)
                tree.draw(ctx)
            }
        }

        window.requestAnimationFrame(drawStep)
    } else {
        console.log('No canvas')
        return -1
    }
}
