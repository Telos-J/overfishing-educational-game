function add(point1, point2) {
    const newPoint = point1.clone()
    newPoint.set(point1.x + point2.x, point1.y + point2.y)
    return newPoint
}

function sub(point1, point2) {
    const newPoint = point1.clone()
    newPoint.set(point1.x - point2.x, point1.y - point2.y)
    return newPoint
}

function scale(point, k) {
    const newPoint = point.clone()
    newPoint.set(k * point.x, k * point.y)
    return newPoint
}

function dot(point1, point2) {
    return point1.x * point2.x + point1.y * point2.y
}

function magnitude(point) {
    return Math.sqrt(point.x ** 2 + point.y ** 2)
}

function normalize(point, k = 1) {
    if (magnitude(point)) return scale(point, k / magnitude(point))
    else return point
}


export { add, sub, dot, magnitude, scale, normalize }

