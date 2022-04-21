import React from "react";

import styles from "./RightTriangle.module.scss";

interface RightTriangleProps {
    a: number,
    b: number,
    c: number,
    angle: "A" | "B",
    hideA?: boolean,    // For inverse trig questions, we may want to hide unneeded side lengths
    hideB?: boolean,
    hideC?: boolean
}

interface Vertex {
    x: number,
    y: number,
    label: string,
    type: "angle" | "side",
    textAnchor: "start" | "middle" | "end",
    alignmentBaseline: "baseline" | "middle" | "hanging"
}

const TRIANGLE_WIDTH = 400; // Not actual pixels, the SVG viewport can be scaled responsively
const PADDING = 40;         // Padding around the triangle so that the text doesn't get clipped

// Offset for text labels depending on alignment
const TEXT_OFFSET_X = {
    end: -8,
    middle: 0,
    start: 8
}
const TEXT_OFFSET_Y = {
    baseline: -8,
    middle: 0,
    hanging: 8
}

// Class for each vertex type
const VERTEX_TYPE_CLASS = {
    angle: styles.angleLabel,
    side: styles.sideLabel
}

const RightTriangle: React.FC<RightTriangleProps> = props => {
    /*
    Note that a < b < c in length. We want the triangle to span
    the full width of its bounding box, so we let the side along
    the horizontal axis be side b. Thus, side a, which is shorter
    than side b, will lie along the vertical axis, minimizing the
    height of the diagram.
    */

    const pixelsPerUnit = TRIANGLE_WIDTH / props.b;
    const height = pixelsPerUnit * props.a;

    // Array of vertices
    let vertices: Vertex[] = [
        {
            x: 0,
            y: 0,
            label: "B",
            type: "angle",
            textAnchor: "end",
            alignmentBaseline: "baseline"
        },
        {
            x: 0,
            y: height,
            label: "C",
            type: "angle",
            textAnchor: "end",
            alignmentBaseline: "hanging"
        },
        {
            x: TRIANGLE_WIDTH,
            y: height,
            label: "A",
            type: "angle",
            textAnchor: "start",
            alignmentBaseline: "hanging"
        }
    ];
    // Array of midpoints
    let midpoints: Vertex[] = [];
    if (!props.hideA) {
        midpoints.push({
            x: 0,
            y: height/2,
            label: props.a.toString(),
            type: "side",
            textAnchor: "end",
            alignmentBaseline: "middle"
        });
    }
    if (!props.hideB) {
        midpoints.push({
            x: TRIANGLE_WIDTH/2,
            y: height,
            label: props.b.toString(),
            type: "side",
            textAnchor: "middle",
            alignmentBaseline: "hanging"
        });
    }
    if (!props.hideC) {
        midpoints.push({
            x: TRIANGLE_WIDTH/2,
            y: height/2,
            label: props.c.toString(),
            type: "side",
            textAnchor: "start",
            alignmentBaseline: "baseline"
        });
    }

    // Add padding
    const addPadding = (vertex: Vertex) => ({
        ...vertex,
        x: vertex.x + PADDING,
        y: vertex.y + PADDING
    });
    vertices = vertices.map(addPadding);
    midpoints = midpoints.map(addPadding);

    // Convert vertex array to string of points
    const points = vertices
        .map(({x, y}) => `${x},${y}`)
        .join(" ");

    // Create text labels for angles and side lengths
    const labels = vertices
        .concat(midpoints)
        .map(vertex => (
            <text
                className={VERTEX_TYPE_CLASS[vertex.type]}
                x={vertex.x + TEXT_OFFSET_X[vertex.textAnchor]}
                y={vertex.y + TEXT_OFFSET_Y[vertex.alignmentBaseline]}
                textAnchor={vertex.textAnchor}
                alignmentBaseline={vertex.alignmentBaseline}
            >
                {vertex.label}
            </text>
        ));

    // Radius of arc used to demarcate specified angle
    const arcRadius = (props.angle === "A") ? TRIANGLE_WIDTH / 4 : height / 3;

    // Determine center, left point, and right point of arc
    const arcCenter = (props.angle === "A") ? vertices[2] : vertices[0];
    const arcLeft =   (props.angle === "A") ? vertices[1] : vertices[2];
    const arcRight =  (props.angle === "A") ? vertices[0] : vertices[1];

    // Calculate left and right bound vectors of arc
    let vectorLeft  = { x:  arcLeft.x - arcCenter.x, y:  arcLeft.y - arcCenter.y };
    let vectorRight = { x: arcRight.x - arcCenter.x, y: arcRight.y - arcCenter.y };

    // Calculate magnitude of vectors
    const magnitudeLeft =  Math.sqrt( vectorLeft.x *  vectorLeft.x +  vectorLeft.y *  vectorLeft.y);
    const magnitudeRight = Math.sqrt(vectorRight.x * vectorRight.x + vectorRight.y * vectorRight.y);

    // Adjust vector lengths to be of ARC_RADIUS length
    vectorLeft  = { x:  vectorLeft.x /  magnitudeLeft * arcRadius, y:  vectorLeft.y /  magnitudeLeft * arcRadius};
    vectorRight = { x: vectorRight.x / magnitudeRight * arcRadius, y: vectorRight.y / magnitudeRight * arcRadius};

    const viewWidth = TRIANGLE_WIDTH + 2*PADDING;
    const viewHeight = height + 2*PADDING;

    return (
        <svg className={styles.svg} viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
            <polygon
                className={styles.triangleFill}
                points={points}
            />
            <path
                className={styles.arc}
                d={`M ${arcCenter.x} ${arcCenter.y}
                    l ${vectorLeft.x} ${vectorLeft.y}
                    a ${arcRadius} ${arcRadius} 0 0 1
                    ${vectorRight.x - vectorLeft.x} ${vectorRight.y - vectorLeft.y}
                    z`}
            />
            <polygon
                className={styles.triangleStroke}
                points={points}
            />
            {labels}
        </svg>
    )
}

export default RightTriangle;
