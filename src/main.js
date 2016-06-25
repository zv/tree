import 'babel-polyfill';
import {RenderTree} from './render.js'
import {Tree} from './tree.js'

var canvas = document.getElementById('tree');

export var config = {
    size: canvas.width,
    mid: 0.5,
    branch_split_diminish: 0.71,
    branch_split_angle: 0.3*Math.PI,
    branch_angle_exp: 2,
    trunk_stroke: "black",
    trunk: "white",
    trunk_shade: "rgba(0,0,0,0.5)",

    get init_branch() {
        return this.size * 0.03 * this.one
    },

    get branch_angle_max() {
        return 5*Math.PI / this.size
    },

    get grains() {
        return Math.ceil(this.size*0.02)
    },

    get branch_diminish() {
        return this.one / 32
    },

    get one() {
        return 1/this.size
    },

    get branch_prob_scale() {
        return 1/this.init_branch/this.size*18
    }
}


export function draw() {
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
    } else {
        console.log("No canvas")
        return -1;
    }

    var render = new RenderTree({n: config.size,
                                 trunk: config.trunk,
                                 trunk_stroke: config.trunk_stroke,
                                 grains: config.grains,
                                 one: 1, // scaling factor
                                 context: ctx})

    var tree = new Tree({root_x: config.mid,
                         root_y: 0.90,
                         root_r: config.init_branch,
                         root_a: (-1*Math.PI)*0.5,
                         stepsize: config.one,
                         one: config.one,
                         branch_split_angle: config.branch_split_angle,
                         branch_prob_scale: config.branch_prob_scale,
                         branch_diminish: config.branch_diminish,
                         branch_split_diminish: config.branch_split_diminish,
                         branch_angle_max: config.branch_angle_max,
                         branch_angle_exp: config.branch_angle_exp})
    debugger

    function drawStep() {
        tree.step()
        tree.Q.map((x) => render.drawBranch(x))

        if (tree.Q.length) {
            setTimeout(drawStep, 10)
        } else {
            console.log("done")
        }
    }

    drawStep();
}
