const normalDistribution = () => {
  const u = 1 - Math.random() // Subtraction to flip [0, 1) to (0, 1].
  const v = 1 - Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}
export const quarterTurnAngle = Math.PI / 2

export class Tree {
  constructor (x, y, r, a, stepSize, one, n, grains, branchSplitAngle, branchProb, branchDiminish, branchSplitDiminish, branchAngleMax, branchAngleExp) {
    this.x = x
    this.y = y
    this.r = r
    this.a = a
    this.stepSize = stepSize
    this.branchProb = branchProb
    this.one = one

    // list of branchs
    this.Q = [new Branch(x, y, r, a, 0, n, branchAngleMax, branchDiminish, branchAngleExp, branchSplitDiminish, branchSplitAngle, grains)]
  }

  step () {
    for (let i = this.Q.length - 1; i >= 0; --i) {
      const branch = this.Q[i]

      // Grow our branch
      branch.step(this.one, this.r, this.stepSize)

      // And get rid of it if it is too small
      if (branch.r <= this.one) {
        this.Q.splice(i, 1)
        continue
      }

      // Now, roll the dice and create a new branch if we're lucky
      if (Math.random() < (this.r - branch.r + this.branchProb)) {
        const ra = (Math.random() * 2) - 1

        this.Q.push(new Branch(
          branch.x,
          branch.y,
          branch.r * branch.branchSplitDiminish,
          branch.a + ra * branch.branchSplitAngle,
          branch.g + 1,
          branch.scale,
          branch.branchAngleMax,
          branch.branchDiminish,
          branch.branchAngleExp,
          branch.branchSplitDiminish,
          branch.branchSplitAngle,
          branch.grains
        ))
      }
    }
  }

  draw (ctx) {
    for (const branch of this.Q) {
      branch.draw(ctx)
    }
  }
}

class Branch {
  constructor (x, y, r, a, g, scale, branchAngleMax, branchDiminish, branchAngleExp, branchSplitDiminish, branchSplitAngle, grains) {
    this.x = x
    this.y = y
    this.r = r
    this.a = a
    this.g = g
    this.scale = scale
    this.branchAngleMax = branchAngleMax
    this.branchDiminish = branchDiminish
    this.branchAngleExp = branchAngleExp
    this.branchSplitDiminish = branchSplitDiminish
    this.branchSplitAngle = branchSplitAngle
    this.grains = grains
  }

  step (vw, rootR, stepSize) {
    this.r -= this.branchDiminish
    this.x += Math.cos(this.a) * stepSize
    this.y += Math.sin(this.a) * stepSize
    const da = Math.pow(1 + (vw + rootR - this.r) / rootR, this.branchAngleExp)
    this.a += da * normalDistribution() * this.branchAngleMax
  }

  draw (ctx) {
    const { a, r, scale, grains } = this
    const left = [Math.cos(a + quarterTurnAngle), Math.sin(a + quarterTurnAngle)]
    const right = [Math.cos(a - quarterTurnAngle), Math.sin(a - quarterTurnAngle)]
    const scaleAbsolute = q => q * r * scale
    const absoluteLeft = left.map(scaleAbsolute)
    const absoluteRight = right.map(scaleAbsolute)

    // set a single pixel at (X, Y) the color of `fillStyle'
    const fillPixel = (x, y) => ctx.fillRect(x, y, 1, 1)

    const shadeTrunk = (x, y, len) => {
      const dd = Math.hypot(x, y)
      for (let i = 0; i <= len; i++) {
        const ts = scaleAbsolute(dd * Math.random() * Math.random() - 1)
        fillPixel(x * ts, y * ts)
      }
    }

    ctx.save()
    ctx.translate(this.x * scale, this.y * scale)

    // fill interior of trunk with the color of `strokeStyle'
    ctx.beginPath()
    ctx.moveTo(...absoluteLeft)
    ctx.lineTo(...absoluteRight)
    ctx.stroke()
    ctx.closePath()

    // draw right side of the branch
    fillPixel(...absoluteRight)
    shadeTrunk(...right, grains)

    // draw left side of the branch
    fillPixel(...absoluteLeft)
    shadeTrunk(...left, grains / 5)

    ctx.restore()
  }
}
