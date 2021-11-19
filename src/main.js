import { Tree, quarterTurnAngle } from './tree.js'

const defaultConfig = (canvas) => ({
  mid: 0.5,
  branchSplitDiminish: 0.71,
  branchSplitAngle: 0.3 * Math.PI,
  branchAngleExp: 2,
  trunk_stroke: 'black',
  trunk: 'white',
  trunk_shade: 'rgba(0,0,0,0.5)',
  initBranch: 0.03,

  get size () {
    return canvas.width
  },

  get branchAngleMax () {
    return (5 * Math.PI) / this.size
  },

  get grains () {
    return Math.ceil(this.size * 0.02)
  },

  get branchDiminish () {
    return this.one / 32
  },

  get one () {
    return 1 / this.size
  },

  get branchProbScale () {
    return (this.one / this.initBranch) * 18
  }
})

export const draw = (canvas, config = {}) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')
    config = { ...defaultConfig(canvas), ...config }

    ctx.lineWidth = 2
    ctx.fillStyle = config.trunk_stroke
    ctx.strokeStyle = config.trunk

    const tree = new Tree(
      config.mid,
      1.0,
      config.initBranch,
      -quarterTurnAngle,
      config.one,
      config.one,
      config.size,
      config.grains,
      config.branchSplitAngle,
      config.branchProbScale,
      config.branchDiminish,
      config.branchSplitDiminish,
      config.branchAngleMax,
      config.branchAngleExp
    )

    const drawStep = () => {
      if (tree.Q.length > 0) {
        tree.step()
        tree.draw(ctx)
        window.requestAnimationFrame(drawStep)
      }
    }

    window.requestAnimationFrame(drawStep)
  } else {
    throw new Error('Could not get canvas context')
  }
}
