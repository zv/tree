export const PI = Math.PI

export function square(n) {
    return n * n
}

// deal with it
export function zip(...rows) {
    return [...rows[0]].map((_,c) => rows.map(row => row[c]))
}

export function uniformRandom(n) {
    if (n) {
        return randomInteger(n)
    }
    return Math.random()
}

export function randomInteger(n) {
    return Math.floor(Math.random() * n)
}

export function normalDistribution() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

}
