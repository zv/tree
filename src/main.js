import { Tree, quarterTurnAngle } from './tree.js'

const defaultConfig = (canvas) => ({
  branchAngleExp: 2,
  branchSplitAngle: Math.PI / 4,
  branchSplitDiminish: 0.725,
  initBranch: 1 / 32,
  mid: 0.5,
  fillStyle: 'black',
  lineWidth: 2,
  strokeStyle: 'white',

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

  get branchProb () {
    return this.one * (this.one / this.initBranch) * 16
  }
})

export const draw = (canvas, config = {}) => {
  config = { ...defaultConfig(canvas), ...config }

  if (!canvas.getContext) {
    throw new Error('Could not get canvas context')
  }

  const ctx = canvas.getContext('2d')

  ctx.fillStyle = config.fillStyle
  ctx.lineWidth = config.lineWidth
  ctx.strokeStyle = config.strokeStyle

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
    config.branchProb,
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

  drawStep()
}
