import {type InternalNode, Position} from '@xyflow/svelte';

export function getDaysInMonth() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())

    const lastDayOfMonth = new Date(year, month + 1, 0)
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()))

    const dates: Date[] = []
    let currentDate = new Date(firstDayOfMonth)

    while (currentDate <= lastDayOfMonth) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
}

// returns the position (top,right,bottom or right) passed node compared to
function getParams(nodeA: InternalNode, nodeB: InternalNode): [number, number, Position] {
    const centerA = getNodeCenter(nodeA);
    const centerB = getNodeCenter(nodeB);

    // const horizontalDiff = Math.abs(centerA.x - centerB.x);
    const verticalDiff = Math.abs(centerA.y - centerB.y);

    let position: Position;

    if (verticalDiff > (nodeA.measured.width ?? 0) / 2) {
        position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
    } else {
        position = centerA.x > centerB.x ? Position.Left : Position.Right;
    }

    const [x, y] = getHandleCoordsByPosition(nodeA, position);
    return [x, y, position];
}

function getHandleCoordsByPosition(node: InternalNode, handlePosition: Position): [number, number] {
    // all handles are from type source, that's why we use handleBounds.source here
    const handle = node.internals.handleBounds?.source?.find((h) => h.position === handlePosition);

    if (!handle?.width || !handle?.height) {
        return [0, 0];
    }

    let offsetX = handle.width / 2;
    let offsetY = handle.height / 2;

    // this is a tiny detail to make the markerEnd of an edge visible.
    // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
    // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
    switch (handlePosition) {
        case Position.Left:
            offsetX = 0;
            break;
        case Position.Right:
            offsetX = handle.width;
            break;
        case Position.Top:
            offsetY = 0;
            break;
        case Position.Bottom:
            offsetY = handle.height;
            break;
    }

    const x = node.internals.positionAbsolute.x + handle.x + offsetX;
    const y = node.internals.positionAbsolute.y + handle.y + offsetY;

    return [x, y];
}

function getNodeCenter(node: InternalNode) {
    return {
        x: node.internals.positionAbsolute.x + (node.measured.width ?? 0) / 2,
        y: node.internals.positionAbsolute.y + (node.measured.height ?? 0) / 2
    };
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: InternalNode, target: InternalNode) {
    const [sx, sy, sourcePos] = getParams(source, target);
    const [tx, ty, targetPos] = getParams(target, source);

    return {
        sx,
        sy,
        tx,
        ty,
        sourcePos,
        targetPos
    };
}
