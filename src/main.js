import 'babel-polyfill';
import {RenderTree} from './render.js'
import {Tree} from './tree.js'

var canvas = document.getElementById('tree');

const PI = Math.PI
const size  = canvas.width
const one   = 1/size

const mid = 0.5
const init_branch = size*0.03*one
const grains = Math.floor(size*0.02)

const branch_diminish       = one/32
const branch_split_diminish = 0.71
const branch_prob_scale     = 1/(init_branch)/size*18
const branch_split_angle    = 0.3*PI
const branch_angle_max      = 5*PI/size
const branch_angle_exp      = 2

const back         = "rgba(255,255,255,0)"
const front        = "rgba(0,0,0,0.5)"
const trunk_stroke = "rgba(0,0,0,1)"
const trunk        = "rgba(255,255,255,1)"
const trunk_shade  = "rgba(0,0,0,0.5)"


export function draw() {
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
    } else {
        console.log("No canvas")
        return
    }

    var render = new RenderTree(size, front, back, trunk, trunk_stroke, grains, ctx)

    var tree = new Tree(mid,
                        0.90,
                        init_branch,
                        (-1*PI)*0.5,
                        one,
                        one,
                        branch_split_angle,
                        branch_prob_scale,
                        branch_diminish,
                        branch_split_diminish,
                        branch_angle_max,
                        branch_angle_exp)

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

document.body.onload = () => draw()
