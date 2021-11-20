import { Tree, quarterTurnAngle } from './tree.js'

const defaultConfig = (canvas) => ({
  mid: 0.5,
  branchSplitDiminish: 0.725,
  branchSplitAngle: Math.PI / 4,
  branchAngleExp: 2,
  trunk_stroke: 'black',
  trunk: 'white',
  trunk_shade: 'rgba(0,0,0,0.5)',
  initBranch: 1 / 32,

  get size () {
    return canvas.width
  },

  get branchAngleMax () {
    return (4 * Math.PI) / this.size
  },

  get grains () {
    return Math.ceil(this.size / 64)
  },

  get branchDiminish () {
    return this.one / 32
  },

  get one () {
    return 1 / this.size
  },

  get branchProbScale () {
    return (this.one / this.initBranch) * 16
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
