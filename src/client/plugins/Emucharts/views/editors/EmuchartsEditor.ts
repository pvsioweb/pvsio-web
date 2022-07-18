import * as Backbone from 'backbone';
import { MIN_HEIGHT, MIN_WIDTH, PictureSize } from '../../../PrototypeBuilder/BuilderUtils';
import { Coords } from "../../../../common/interfaces/Widgets";
import { edgeUUID, nodeUUID } from '../../../../common/utils/uuidUtils';
import { colors, getMouseCoords } from '../../../../common/utils/pvsiowebUtils';
import * as d3Shape from 'd3-shape';

// max refresh rate for re-drawing the diagram
const MAX_REFRESH_RATE: number = 4; //ms

// text line width, used to make it easier to select edges
const TEXT_LINE_WIDTH: number = 16; //px

// radius of the control point for edges
const CONTROL_POINT_RADIUS: number = 12; //px

// text position
const TEXT_BASELINE_MARGIN: number = -4; //px
const TEXT_START_OFFSET: string = "50%";

/**
 * Returns svg coordinates relative to the SVG
 */
// export function screenToSVGCoords(evt: JQuery.MouseUpEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent | JQuery.MouseDownEvent | JQuery.ContextMenuEvent | JQuery.ClickEvent, $el: JQuery<HTMLElement>): Coords<number> {
//     // Read the bounding rectangle
//     let canvasRect: DOMRect = $el[0]?.getBoundingClientRect();
//     // transform to relative coords
//     return {
//         top: evt?.clientY - canvasRect?.y,
//         left: evt?.clientX - canvasRect?.x
//     };
// }

/**
 * DOM elements used by the editor
 */
export interface EmuchartsEditorElements extends Backbone.ViewOptions {
    panel: HTMLElement,
    parent: HTMLElement,
    coords: HTMLElement
};

// useful constants
export const DEFAULT_NODE_COLOR: string = colors.blue;
export const DEFAULT_TOOLBAR_BTN_EDIT_COLOR: string = "green";
export const DEFAULT_TOOLBAR_BTN_WIDTH: number = 60; //px
export const DEFAULT_TOOLBAR_BTN_HEIGHT: number = 100; //px
const DEFAULT_NODE_FILL: string = `${DEFAULT_NODE_COLOR}`;
const DEFAULT_NODE_SIZE: number = 48; // px
const DEFAULT_NODE_LEFT: number = 48; // px
const DEFAULT_NODE_TOP : number = 10; // px
const DEFAULT_FONT_SIZE: number = 14; // px


const lineFunction = d3Shape.line<Coords<number>>()
    .curve(d3Shape.curveCardinal)
    .x((d) => { return d?.left; })
    .y((d) => { return d?.top; });
//.interpolate("basic");
// .interpolate("cardinal");

// templates
const svgStyleTemplate: string = `
<style>
svg text{
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.node {
    cursor: move;
}
.node-box {
    stroke: black;
    fill: ${DEFAULT_NODE_FILL};
    opacity: 0.9;
    stroke-width: 1;
}
.node-label {
    font: ${DEFAULT_FONT_SIZE}px sans-serif;
    text-rendering: optimizelegibility;
    text-anchor: middle;
}
</style>
`;

export interface NodeTemplate {
    id?: string,
    label?: string,
    width?: number,
    height?: number,
    top?: number,
    left?: number,
    color?: string
};
export interface EdgeTemplate {
    id?: string,
    label?: string,
    color?: string,
    from?: string,
    to?: string,
    controlPoint?: Coords<number>,
    extraControlPoints?: Coords<number>[],
    text?: string
};
export interface SVGNode {
    node: SVGElement,
    dragLine: SVGElement
};
export interface SVGEdge {
    id: string,
    edge: SVGElement,
    controlPoint: SVGElement
};
export interface EdgePoints {
    origin: Coords<number>,
    mid: Coords<number>,      // main control point
    extra?: Coords<number>[], // extra control points
    target: Coords<number>
};
/**
 * Utility function, creates an svg element with given attributes
 */
function createSvgElement(tag: "g" | "circle" | "rect" | "text", attributes: {[key:string]: string }): SVGElement {
    const elem: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attributes) {
        elem.setAttribute(k, attributes[k]);
    }
    return elem;
};
/**
 * Utility function, creates a drag line path from the center of a node to the given position (relative to the node)
 */
function createDragLine (top: number, left: number): string {
    const center: number = DEFAULT_NODE_SIZE / 2;
    return `M ${center} ${center} L ${left + center} ${top + center}`;
}
/**
 * Utility function to obtain control points for edges
 * To identify control points, we split the space around the control point into 8 quadrants (note that the y axis is reversed in svg, and 0,0 is the top-left)
 * Depending on where the origin and target nodes are, we use a different formula to adjust the start and end points of the edge
 * The width of II is the width of origin
 * The width of VI is the width of target
 * The height of IV is the height of origin
 * The height of VIII is the height of target
 *      
 */
function computeEdgePoints (desc: EdgeTemplate, opt?: { origin?: Coords<number>, target?: Coords<number>}): EdgePoints {
    if (desc?.from && desc?.to) {
        opt = opt || {};
        const origin: Coords<number> = opt?.origin || getNodeCoords(desc?.from, { center: true });
        const target: Coords<number> = opt?.target || getNodeCoords(desc?.to, { center: true });
        const MIN_DISTANCE_FROM_BOX: number = 18; //px

        // check if this is a self-loop
        if (desc?.from === desc?.to) {
            // self-edge  
            // target dimensions
            const targetWidth: number = parseInt($(`#${desc.to} .node-box`).css("width"));
            const targetHeight: number = parseInt($(`#${desc.to} .node-box`).css("height"));
            const targetWidth05  = targetWidth / 2;
            const targetHeight05 = targetHeight / 2;

            // the control point is next to the top-right corner of the target node by default
            let controlPointX = desc.controlPoint?.left ? desc.controlPoint.left : target.left + targetWidth;
            let controlPointY = desc.controlPoint?.top ? desc.controlPoint.top : target.top - (targetHeight * 1.4);

            // extra control points for creating a rounder shape
            let extra: Coords<number>[] = [];
            const dx: number = controlPointX - target.left; // dx > 0 means control point is to the right of target node
            const dy: number = target.top - controlPointY; // dy > 0 means control point is above target node (y axis is inverted)

            let offsetX: number = Math.abs(dx);
            offsetX = (offsetX > targetWidth) ? offsetX : targetWidth05;
            let offsetY: number = Math.abs(dy);
            offsetY = (offsetY > targetHeight) ? offsetY : targetHeight05;
    
            // quadrants (target node is at the center) the extra points of the curve are given in cw order
            //  II  |  I
            // -----t-----
            // III  |  IV
            if (dx >= 0 && dy >= 0) {
                console.log("Quadrant I");
                // --> place self-edge at the top-right corner of the target
                target.left += (targetWidth05 < 20) ? 20 : targetWidth05;
                origin.top -= targetHeight05;
                extra = [{
                    left: controlPointX - offsetX / 2,
                    top: controlPointY - offsetY / 16
                }, {
                    left: (controlPointX + offsetX / 16 < target.left + offsetX) ? target.left + offsetX : controlPointX + offsetX / 16,
                    top: controlPointY + offsetY / 2 
                }];                
            } else if (dx < 0 && dy >= 0) {
                console.log("Quadrant II");
                // --> place self-edge at the top-left corner of the target
                target.top -= targetHeight05;
                origin.left -= (targetWidth05 < 20) ? 20 : targetWidth05;
                extra = [{ 
                    left: (controlPointX - offsetX / 16 < target.left - offsetX) ? controlPointX - offsetX / 16 : target.left - offsetX,
                    top: controlPointY + offsetY / 2
                }, { 
                    left: (controlPointX + target.left) / 2,
                    top: (offsetY > targetHeight) ? controlPointY - offsetY / 4 : controlPointY - offsetY / 2 
                }];// controlPoint1Y + offsetY / 16 };
            } else if (dx < 0 && dy < 0) {
                console.log("Quadrant III");
                // --> place the self-edge at the left side of the target
                target.left -= (targetWidth05 < 20) ? 20 : targetWidth05;
                origin.top += targetHeight05;
                extra = [{
                    left: controlPointX + offsetX * 0.6,
                    top: (offsetY > targetHeight) ? controlPointY - offsetY / 4 : controlPointY - offsetY / 2
                }, { 
                    left: (controlPointX - offsetX / 16 < target.left - offsetX) ? controlPointX - offsetX / 16 : target.left - offsetX,
                    top: controlPointY - offsetY / 2
                }];
            } else { //if (dx >= 0 && dy < 0) {
                console.log("Quadrant IV");
                // --> place the self-edge at the bottom-right corner of the target
                target.top += targetHeight05;
                origin.left += (targetWidth05 < 20) ? 20 : targetWidth05;
                extra = [{
                    left: (offsetX > targetWidth) ? controlPointX + offsetX / 16 : controlPointX + offsetX / 4,
                    top: controlPointY - offsetY / 2
                }, { 
                    left: controlPointX - offsetX * 0.6,
                    top: (offsetY > targetHeight) ? controlPointY - offsetY / 16 : controlPointY + offsetY / 2
                }];
            }
            return {
                origin,
                mid: {
                    left: desc.controlPoint?.left ? desc.controlPoint.left : controlPointX,
                    top: desc.controlPoint?.top ? desc.controlPoint.top : controlPointY
                },
                extra,
                target
            };

        } else {
            // regular edge
            // the control point is in the middle of the edge by default
            let controlPoint1X = desc.controlPoint?.left ? desc.controlPoint.left : (target.left + origin.left) / 2;
            let controlPoint1Y = desc.controlPoint?.top ? desc.controlPoint.top : (target.top + origin.top) / 2;

            // check the direction of the arrow
            const dx_target: number = controlPoint1X - target.left; // dx_target >= 0 means control point is to the right of target node
            const dy_target: number = controlPoint1Y - target.top; // dy_target >= 0 means control point is below target node (y axis is reversed in svg)
            const dx_origin: number = controlPoint1X - origin.left; // dx_source >= 0 means control point is to the right of origin node
            const dy_origin: number = controlPoint1Y - origin.top; // dy_source >= 0 means control point is below origin node (y axis is reversed in svg)

            // source and target dimensions
            const targetWidth: number = parseInt($(`#${desc.to} .node-box`).css("width"));
            const targetHeight: number = parseInt($(`#${desc.to} .node-box`).css("height"));
            const sourceWidth: number = parseInt($(`#${desc.from} .node-box`).css("width"));
            const sourceHeight: number = parseInt($(`#${desc.from} .node-box`).css("height"));

            // source and target dimensions / 2
            const sourceWidth05: number = sourceWidth / 2;
            const sourceHeight05: number = sourceHeight / 2;
            const targetWidth05: number = targetWidth / 2;
            const targetHeight05: number = targetHeight / 2;

            /* quadrants
            *   III  |   II   |  I
            * -----------------------
            *    IV  |   c    | VIII
            * -----------------------
            *    V   |   VI   | VII
            */
            if (dx_target >= targetWidth05 && dy_target >= -targetHeight05 && dy_target < targetHeight05) {
                // console.log("t-VIII");
                target.left += (targetWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : targetWidth05;
            } else if (dx_target >= targetWidth05 && dy_target >= targetHeight05) {
                // console.log("t-VII");
                target.top += targetHeight05;
                target.left += (targetWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : targetWidth05;
            } else if (dx_target < targetWidth05 && dx_target >= -targetWidth05 && dy_target >= targetHeight05) {
                // console.log("t-VI");
                target.top += targetHeight05;
            } else if (dx_target < targetWidth05 && dy_target >= targetHeight05) {
                // console.log("t-V");
                target.left -= (targetWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : targetWidth05;
                target.top += sourceHeight05;
            } else if (dx_target < targetWidth05 && dy_target < targetHeight05 && dy_target >= -targetHeight05) {
                // console.log("t-IV");
                target.left -= (targetWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : targetWidth05;
            } else if (dx_target < -targetWidth05 && dy_target < -targetHeight05) {
                // console.log("t-III");
                target.left -= (targetWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : targetWidth05;
                target.top -= targetHeight05;
            } else if (dx_target < targetWidth05 && dx_target >= -targetWidth05 && dy_target < -targetHeight05) {
                // console.log("t-II");
                target.top -= targetHeight05;
            } else { //if (dx_target >= targetWidth05 && dy_target < -targetHeight05) {
                // console.log("t-I");
                target.top -= targetHeight05;
                target.left += (targetWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : targetWidth05;
            }

            /* quadrants
            *   III  |   II   |  I
            * -----------------------
            *    IV  |   c    | VIII
            * -----------------------
            *    V   |   VI   | VII
            */
            if (dx_origin < sourceWidth05 && dy_origin < sourceHeight05 && dy_origin >= -sourceHeight05) {
                // console.log("o-VIII");
                origin.left -= (sourceWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : sourceWidth05;
            } else if (dx_origin < -sourceWidth05 && dy_origin < -sourceHeight05) {
                // console.log("o-VII");
                origin.left -= (sourceWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : sourceWidth05;
                origin.top -= sourceHeight05;
            } else if (dx_origin < sourceWidth05 && dx_origin >= -sourceWidth05 && dy_origin < -sourceHeight05) {
                // console.log("o-VI");
                origin.top -= sourceHeight05;
            } else if (dx_origin >= sourceWidth05 && dy_origin < -sourceHeight05) {
                // console.log("o-V");
                origin.top -= sourceHeight05;
                origin.left += (sourceWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : sourceWidth05;
            } else if (dx_origin >= sourceWidth05 && dy_origin >= -sourceHeight05 && dy_origin < sourceHeight05) {
                // console.log("o-IV");
                origin.left += (sourceWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : sourceWidth05;
            } else if (dx_origin >= sourceWidth05 && dy_origin >= sourceHeight05) {
                // console.log("o-III");
                origin.top += sourceHeight05;
                origin.left += (sourceWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : sourceWidth05;
            } else if (dx_origin < sourceWidth05 && dx_origin >= -sourceWidth05 && dy_origin >= sourceHeight05) {
                // console.log("o-II");
                origin.top += sourceHeight05;
            } else { //if (dx_source < sourceWidth05 && dy_source >= sourceHeight05) {
                // console.log("o-I");
                origin.left -= (sourceWidth05 < MIN_DISTANCE_FROM_BOX) ? MIN_DISTANCE_FROM_BOX : sourceWidth05;
                origin.top += sourceHeight05;
            }
            return {
                origin,
                mid: {
                    left: desc.controlPoint?.left ? desc.controlPoint.left : (target.left + origin.left) / 2,
                    top: desc.controlPoint?.top ? desc.controlPoint.top : (target.top + origin.top) / 2
                },
                target
            };
        }
    }
    return null;
};
/**
 * Utility function, creates a drag line path from the center of a node to the given position (relative to the node)
 */
function createEdgePath (controlPoints: EdgePoints): string {
    const from: Coords<number> = controlPoints?.origin;
    const to: Coords<number> = controlPoints?.target;
    const mid: Coords<number> = controlPoints?.mid;
    const extra: Coords<number>[] = controlPoints?.extra || [];
    const points: Coords<number>[] = extra?.length > 0 ? [ from, extra[0], mid, extra[1], to ] : [ from, mid, to ];
    const edgePath: string = lineFunction(points);
    return edgePath;
    // return `M ${controlPoints?.origin?.left} ${controlPoints?.origin?.top} Q ${controlPoints?.mid?.left} ${controlPoints?.mid?.top} ${controlPoints?.target?.left} ${controlPoints?.target?.top}`;
}
/**
 * Utility function, creates a node representing a mode of the state machine
 * The node has a drag line that can be used to render a temporary edge while creating a transition to another node
 */
function createSVGNode (desc?: NodeTemplate): SVGNode {
    desc = desc || {};
    const id: string = desc.id || nodeUUID();
    const label: string = desc.label || "";
    const width: number = isNaN(desc.width) ? DEFAULT_NODE_SIZE : desc.width;
    const height: number = isNaN(desc.height) ? DEFAULT_NODE_SIZE : desc.height;
    const left: number = (isNaN(desc.left) ? DEFAULT_NODE_LEFT : desc.left) - (width / 2);
    const top: number = (isNaN(desc.top) ? DEFAULT_NODE_TOP : desc.top) - (height / 2);
    const fill: string = desc.color;
    const node: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "g"); // node group, will contain all the elements below
    const box: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "rect"); // node box
    const text: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "text"); // node label
    const dragLine: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "svg:path"); // dragline for creating edges from this node to another node
    $(node).addClass("node")
        .attr("id", id).attr("transform", `translate(${left},${top})`);
    $(box).addClass("node-box")
        .attr("width", width).attr("height", height).attr("rx", "4").attr("ry", "4").css("fill", fill);
    $(text).addClass("node-label")
        .attr("x", `${width / 2}`).attr("y", `${DEFAULT_FONT_SIZE / 3 + height / 2}`).text(label);
    $(dragLine).attr("id", `${id}-drag-arrow`).attr("d", createDragLine(0,0)).css({
        "marker-end": "url(#drag-arrow)", 
        stroke: "black",
        display: "none"
    });
    node.appendChild(dragLine);
    node.appendChild(box);
    node.appendChild(text);
    return { node, dragLine };
};
/**
 * Utility function, creates an edge between two nodes
 * The edge has a control point that can be used to adjust the curve
 * A hidden thick line is used to render the edge label
 */
function createSvgEdge (desc: EdgeTemplate): SVGEdge {
    desc = desc || {};
    const edge: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "g"); // edge group, will contain all the elements below
    const svgEdgeLine: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "svg:path"); // visible line path
    const svgTextLine: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "svg:path"); // transparent text line
    const svgControlPoint: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "circle"); // control point for adjusting the curve of the edge
    const svgText: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "text"); // edge label

    // generate unique edge id
    const edgeId: string = desc.id || edgeUUID(); // edge id
    const linePoints: EdgePoints = computeEdgePoints(desc); // edge points (origin, mid, target)

    // render the text left-to-right
    const origin: Coords<number> = getNodeCoords(desc?.from, { center: true });
    const target: Coords<number> = getNodeCoords(desc?.to, { center: true });
    $(svgText).attr("dy", TEXT_BASELINE_MARGIN);

    // text line should always go from left to right otherwise the text is not rendered upside-down or right-to-left
    const textLinePoints: EdgePoints = computeEdgePoints(origin.left < target.left ? desc : { ...desc, from: desc.to, to: desc.from });

    if (desc.from === desc.to) {
        // self-edge, text line is in a box
        $(svgText).addClass("edge-text-box")
            .attr("x", linePoints.mid.left)
            .attr("y", linePoints.mid.top)
            .text("test");
    } else {
        // regular edge, text line follows the path
        const svgTextPath: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "textPath"); // label path
        svgText.appendChild(svgTextPath);
        $(svgTextPath).addClass("edge-text text")
            .attr("href", `#${edgeId}-text-line`)
            .attr("startOffset", TEXT_START_OFFSET)
            .text("test");
    }

    // compose the svg elements
    $(edge).attr("id", edgeId).addClass(desc.from === desc.to ? "self-edge" : "edge")
        .attr("origin", desc.from)
        .attr("target", desc.to)
        .attr("control-point", `${linePoints.mid.left},${linePoints.mid.top}`)
        .addClass(`${desc.from} ${desc.to}`);
    const pathLine: string = createEdgePath(linePoints);
    const textLine: string = createEdgePath(textLinePoints);
    $(svgEdgeLine).addClass("edge-path line")
        .attr("id", `${edgeId}-edge-path`)
        .attr("d", pathLine)
        .css({
            "marker-end": "url(#drag-arrow)", 
            stroke: desc.color || "black",
            fill: "transparent"
        });
    $(svgTextLine).addClass("edge-text-line")
        .attr("id", `${edgeId}-text-line`)
        .attr("d", textLine)
        .css({
            stroke: "transparent",
            "stroke-width": TEXT_LINE_WIDTH,
            fill: "transparent"
        });
    $(svgControlPoint).addClass(`${desc.from === desc.to ? "self-control" : ""} control-point`)
        .attr("id", `${edgeId}-control-point`)
        .attr("cx", linePoints.mid.left)
        .attr("cy", linePoints.mid.top)
        .attr("r", CONTROL_POINT_RADIUS)
        .attr("stroke-dasharray", "4")
        .css({ fill: "transparent", stroke: "transparent", cursor: "grab" });
    edge.appendChild(svgEdgeLine);
    edge.appendChild(svgTextLine);
    edge.appendChild(svgText);
    return { id: edgeId, edge, controlPoint: svgControlPoint };
};
/**
 * Utility function, recomputes the edge path
 */
function redrawPath ($edges: JQuery<SVGElement>, opt?: { controlPointCoords?: Coords<number> }): void {
    for (let i = 0; i < $edges.length; i++) {
        const from: string = $edges[i].getAttribute("origin");
        const to: string = $edges[i].getAttribute("target");
        const edgeId: string = $edges[i].getAttribute("id");
        const controlPoint: Coords<number> = opt?.controlPointCoords || getEdgeControlPointCoords(edgeId);
        const desc: EdgeTemplate = { from, to, controlPoint };
        const points: EdgePoints = computeEdgePoints(desc);

        const origin: Coords<number> = getNodeCoords(desc?.from, { center: true });
        const target: Coords<number> = getNodeCoords(desc?.to, { center: true });    
        const textLinePoints: EdgePoints = computeEdgePoints(origin.left < target.left ? desc : { ...desc, from: desc.to, to: desc.from });
    
        const $edge: JQuery<SVGElement> = $($edges[i]);
        const $controlPoint: JQuery<SVGElement> = <any> $(`#${edgeId}-control-point`);
        $edge.find(".edge-path").attr("d", createEdgePath(points));
        $edge.find(".edge-text-line").attr("d", createEdgePath(textLinePoints));
        $edge.find(".edge-text-box").attr("x", controlPoint.left).attr("y", controlPoint.top);
        $edge.attr("control-point", `${points?.mid?.left}, ${points?.mid?.top}`);
        $controlPoint.attr("cx", points?.mid?.left).attr("cy", points?.mid?.top);
    }
}
/**
 * Utility function, performs a rigid translation of an edge path by a given offset
 */
function translateEdgePath ($edges: JQuery<SVGElement>, offset: Coords<number>): void {
    $edges.attr("transform", `translate(${offset.left},${offset.top})`);
    // for (let i = 0; i < $edges.length; i++) {
    //     const id: string = $edges[i].getAttribute("id");
    //     const from: string = $edges[i].getAttribute("origin");
    //     const to: string = $edges[i].getAttribute("target");

    //     const controlPoint: Coords<number> = getEdgeControlPoint(id);
    //     const origin: Coords<number> = getNodeCoords(from, { center: true });
    //     const target: Coords<number> = getNodeCoords(to, { center: true });
    //     // controlPoint.top += offset.top;
    //     // controlPoint.left += offset.left;
    //     origin.top += offset.top;
    //     origin.left += offset.left;
    //     target.top += offset.top;
    //     target.left += offset.left;

    //     const desc: EdgeTemplate = { from, to, controlPoint };
    //     const points: EdgePoints = computeEdgePoints(desc, { origin, target });
    //     const $edge: JQuery<SVGElement> = $($edges[i]);
    //     $edge.find(".edge-path").attr("d", createEdgePath(points));
    //     $edge.find(".control-point").attr("cx", points?.mid?.left).attr("cy", points?.mid?.top);
    //     $edge.attr("control-point", `${points?.mid?.left}, ${points?.mid?.top}`);
    // }
}
/**
 * Utility function, returns the coordinates of a given node
 * By default, the top-left corner is returned
 * option center can be used to return the center of the box
 */
function getNodeCoords (id: string, opt?: { center?: boolean }): Coords<number> {
    if (id) {
        opt = opt || {};
        const $node: JQuery<HTMLElement> = $(`#${id}`);
        if ($node) {
            const data: string[] = /translate\((.*)\)/g.exec($node.attr("transform"))[1]?.split(",");
            const coords: Coords<number> = {
                left: +data[0],
                top: +data[1]
            };
            if (opt.center) {
                const width: number = parseInt($($node).find(".node-box").css("width"));
                const height: number = parseInt($($node).find(".node-box").css("height"));
                coords.left += width / 2;
                coords.top += height / 2;
            }
            return coords;
        }
    }
    return null;
}
/**
 * Utility function, returns the coordinates of the control point of an edge
 */
function getEdgeControlPointCoords (id: string): Coords<number> {
    const $edge: JQuery<HTMLElement> = $(`#${id}`);
    const controlPoints: string[] = $edge.attr("control-point")?.split(",");
    const translation: string[] = $edge.attr("transform")?.replace("translate(", "")?.split(",");
    const cp1: Coords<number> = controlPoints?.length > 1 ? { left: +controlPoints[0], top: +controlPoints[1] } : { left: 0, top: 0 };
    const cp2: Coords<number> = translation?.length > 1 ? { left: parseFloat(translation[0]), top: parseFloat(translation[1]) } : { left: 0, top: 0 };
    $edge.removeAttr("transform");
    return { left: cp1.left + cp2.left, top: cp1.top + cp2.top };
}


// Editor modes
export enum EditorMode { BROWSE, NEW_NODE, NEW_EDGE, NEW_SELF_EDGE };

/**
 * Utility class, defines which methods can be used by handlers that want to read the Editor mode
 */
interface EditorModeReader {
    getMode (): EditorMode;
}
/**
 * Utility class, defines which methods can be used by handlers that want to set the editor mode
 */
interface EditorModeWriter {
    setMode (mode: EditorMode): boolean; // returns true if the mode change was successful, false otherwise
}

/**
 * Mouse event handlers
 */
class EditHandler {
    // svg element where the handler is active
    protected $svg: JQuery<SVGElement>;

    // nodes and edges groups in the svg
    protected $nodes: JQuery<SVGElement>;
    protected $edges: JQuery<SVGElement>;
    protected $edges_control_points: JQuery<SVGElement>;

    // flag indicating an element is being dragged
    protected dragging: boolean = false;

    // pointer to the editor
    protected editor: EditorModeReader;

    // local variable used to support the creation of edges between a node (origin) and other nodes
    protected origin: SVGElement = null;

    // timers, used for delayed refresh
    protected timers: { renderEdge: NodeJS.Timeout, translateEdge: NodeJS.Timeout } = { renderEdge: null, translateEdge: null };

    /**
     * Constructor
     */
    constructor ($svg: JQuery<SVGElement>, editor: EditorModeReader) {
        this.editor = editor;
        this.$svg = $svg;
        // create svg groups for nodes and edges
        const nodes: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "g");
        const edges: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "g");
        // control point for edges, grouped together so they are always rendered above the edge line
        // this is necessary because z-index cannot be used in svg, and the rendering order defines which element is on top of which
        const edges_control_points: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "g");
        $(nodes).attr("id", "nodes");
        $(edges).attr("id", "edges");
        $(edges_control_points).attr("id", "edges-control-points");
        this.$svg.append(edges).append(edges_control_points);
        this.$svg.append(nodes); // nodes are appended last so they are on top of the edges
        this.$nodes = $(nodes);
        this.$edges = $(edges);
        this.$edges_control_points = $(edges_control_points);
    }

    /**
     * Utility function, creates an edge between two nodes
     */
    createEdge (desc: EdgeTemplate): void {
        // create svg element
        const svgEdge: SVGEdge = createSvgEdge(desc);
        this.$edges.append(svgEdge.edge);
        this.$edges_control_points.append(svgEdge.controlPoint);
        // append handlers
        $(svgEdge.edge).on("mouseover", (evt: JQuery.MouseOverEvent) => {
            if (!this.dragging) {
                this.selectEdge(svgEdge.id);
                this.revealControlPoint(svgEdge.id);
            }
        }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
            if (!this.dragging) {
                this.deselectEdge(svgEdge.id);
                this.hideControlPoint(svgEdge.id);
            }
        });
        $(svgEdge.controlPoint).on("mouseover", (evt: JQuery.MouseOverEvent) => {
            if (!this.dragging) {
                this.selectEdge(svgEdge.id);
                this.revealControlPoint(svgEdge.id);
            }
        }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
            if (!this.dragging) {
                this.deselectEdge(svgEdge.id);
                this.hideControlPoint(svgEdge.id);
            }
        }).on("mousedown", (evt: JQuery.MouseDownEvent) => {
            this.dragEdge(svgEdge, evt);
        });
    }
    /**
     * mouse down handler for the svg
     */
    onMouseDown (evt: JQuery.MouseDownEvent): void {
        const mode: EditorMode = this.editor.getMode();
        const coords: Coords<number> = getMouseCoords(evt, this.$svg);
        switch (mode) {
            case EditorMode.NEW_NODE: {
                // create new node
                const data: NodeTemplate = {
                    label: "X",
                    top: coords.top,
                    left: coords.left
                };
                // const node: SVGElement = makeSvgElement("rect", {
                //     width: `${DEFAULT_NODE_SIZE}`,
                //     height: `${DEFAULT_NODE_SIZE}`,
                //     top: `${coords.top}`,
                //     left: `${coords.left}`
                // });
                const svgNode: SVGNode = createSVGNode(data);
                this.$nodes.append(svgNode.node);
                // append mouse handlers for moving the node
                $(svgNode.node).on("mousedown", (evt: JQuery.MouseDownEvent) => {
                    const mode: EditorMode = this.editor.getMode();
                    switch (mode) {
                        case EditorMode.NEW_EDGE: {
                            this.origin = svgNode.node;
                            // show dragline
                            this.dragLine(svgNode, evt);
                            break;
                        }
                        case EditorMode.NEW_SELF_EDGE: {
                            this.origin = evt.currentTarget;
                            // create self-edge
                            console.log("[EmuchartsEditor] onMouseDown: creating new self-edge", { origin: this.origin, target: evt.currentTarget });
                            this.createEdge({
                                from: this.origin.id,
                                to: evt.currentTarget.id
                            });
                            break;
                        }
                        case EditorMode.NEW_NODE: 
                        case EditorMode.BROWSE: {
                            // drag node
                            this.dragNode(evt.currentTarget.id, evt);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }).on("mouseover", (evt: JQuery.MouseOverEvent) => {
                    this.selectNode(evt.currentTarget.id);
                    const mode: EditorMode = this.editor.getMode();
                    switch (mode) {
                        case EditorMode.NEW_EDGE:
                        case EditorMode.NEW_SELF_EDGE:
                        case EditorMode.NEW_NODE: 
                        case EditorMode.BROWSE:
                        default: {
                            break;
                        }
                    }
                }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
                    this.deselectNode(evt.currentTarget.id);
                    const mode: EditorMode = this.editor.getMode();
                    switch (mode) {
                        case EditorMode.NEW_EDGE:
                        case EditorMode.NEW_EDGE:
                        case EditorMode.NEW_NODE: 
                        case EditorMode.BROWSE:
                        default: {
                            break;
                        }
                    }
                }).on("mouseup", (evt: JQuery.MouseUpEvent) => {
                    const mode: EditorMode = this.editor.getMode();
                    switch (mode) {
                        case EditorMode.NEW_EDGE: {
                            // create edge between origin and currentTarget
                            if (this.origin?.id !== evt.currentTarget.id) {
                                console.log("[EmuchartsEditor] onMouseUp: creating new edge", { origin: this.origin, target: evt.currentTarget });
                                this.createEdge({
                                    from: this.origin.id,
                                    to: evt.currentTarget.id
                                });
                            }
                            break;
                        }
                        case EditorMode.NEW_SELF_EDGE: // do nothing, self-edge created on mouse down
                        case EditorMode.NEW_NODE:
                        case EditorMode.BROWSE:
                        default: {
                            break;
                        }
                    }
                });
                break;
            }
            case EditorMode.NEW_EDGE: {
                // try to create initial transition to a node
                // TODO
                break;
            }
            case EditorMode.NEW_SELF_EDGE: {
                break;
            }
            case EditorMode.BROWSE: {
                break;
            }
            default: {
                break;
            }
        }
    }
    /**
     * Utility function, shows a given node as selected
     */
    selectNode (nodeId: string): void {
        const $node: JQuery<SVGElement> = <any> this.$nodes.find(`#${nodeId}`);
        $node.find(".node-box").css({
            "stroke-width": "2px"
        });
    }
    /**
     * Utility function, deselects a given node
     */
    deselectNode (nodeId: string): void {
        const $node: JQuery<SVGElement> = <any> this.$nodes.find(`#${nodeId}`);
        $node.find(".node-box").css({
            "stroke-width": "1px"
        });
    }
    /**
     * Utility function, deselects all nodes
     */
    deselectAllNodes (): void {
        $(".node-box").css({
            "stroke-width": "1px"
        });
    }
    /**
     * Utility function, shows a given edge as selected
     */
    selectEdge (edgeId: string): void {
        this.$edges.find(`#${edgeId} .edge-path.line`).css("stroke-width", "1.2px").attr("stroke-dasharray", "1");
    }
    /**
     * Utility function, deselects a given edge
     */
    deselectEdge (edgeId: string): void {
        this.$edges.find(`#${edgeId} .edge-path.line`).css("stroke-width", "1px").attr("stroke-dasharray", "0");
    }
    /**
     * Utility function, shows a given edge as selected
     */
    revealControlPoint (edgeId: string): void {
        this.$edges_control_points.find(`#${edgeId}-control-point`).css("stroke", "black");
    }
    /**
     * Utility function, deselects a given edge
     */
    hideControlPoint (edgeId: string): void {
        this.$edges_control_points.find(`#${edgeId}-control-point`).css("stroke", "transparent");
    }
    /**
     * Internal function, handles dragging of nodes
     */
    protected dragNode (nodeId: string, evt: JQuery.MouseDownEvent): void {
        const $node: JQuery<SVGElement> = <any> this.$nodes.find(`#${nodeId}`);
        this.dragging = true;
        // mouse coordinates at drag start
        const dragStartCoords: Coords<number> = getMouseCoords(evt, this.$svg);
        // node coordinates at drag start
        const trans: string = $node.attr("transform").replace(/\s+/g, "");
        const match: RegExpMatchArray = /translate\((\d+),(\d+)\)/g.exec(trans);
        const left: number = match?.length > 1 ? +match[1] : 0;
        const top: number = match?.length > 2 ? +match[2] : 0;
        // mouse move drags the node; the handler is on the entire svg, so we don't risk of losing the node while moving (e.g., because the mouse goes out of the box)
        const mousemove = (evt: JQuery.MouseMoveEvent) => {
            const mousePosition: Coords<number> = getMouseCoords(evt, this.$svg);
            const offset: Coords<number> = {
                left: mousePosition.left - dragStartCoords?.left,
                top: mousePosition.top - dragStartCoords?.top
            };
            $node.attr("transform", `translate(${left + offset.left},${top + offset.top})`);
            // adjust all edges connected to this node
            // const $edgesToNode: JQuery<HTMLElement> = this.$edges.find(`[target=${node.id}]`);
            // const $edgesFromNode: JQuery<HTMLElement> = this.$edges.find(`[origin=${node.id}]`);
            const $edges: JQuery<SVGElement> = <any> $(`.edge.${nodeId}`);
            this.redrawEdge($edges);
            const $self: JQuery<SVGElement> = <any> $(`.self-edge.${nodeId}`);
            this.translateEdge($self, offset);
            console.log(offset);
        };
        // mouse up stops dragging
        const mouseup = (evt: JQuery.MouseUpEvent) => {
            // disable handlers
            $(this.$svg).off("mousemove", mousemove).off("mouseup", mouseup);
            this.dragging = false;
            // redraw edges that have been translated, so the changes become permanent
            const $self: JQuery<SVGElement> = <any> $(`.self-edge.${nodeId}`);
            this.redrawEdge($self);
        };
        $(this.$svg).on("mousemove", mousemove);
        $(this.$svg).on("mouseup", mouseup);
        evt.stopPropagation();
    }
    /**
     * Internal function, handles draggging of edge control points
     */
    protected dragEdge (svgEdge: SVGEdge, evt: JQuery.MouseDownEvent | JQuery.MouseMoveEvent): void {
        // change cursor
        $(svgEdge?.controlPoint).css("cursor", "grabbing");
        this.revealControlPoint(svgEdge.id);
        this.dragging = true;
        // mouse move drags the edge; the handler is on the entire svg, so we don't risk of losing the edge while moving (e.g., because the mouse is not exactly over the edge)
        const mousemove = (evt: JQuery.MouseMoveEvent) => {
            const mousePosition: Coords<number> = getMouseCoords(evt, this.$svg);
            // refresh the curve of the edge
            this.redrawEdge($(svgEdge?.edge), { controlPointCoords: mousePosition });
        };
        // mouse up stops dragging
        const mouseup = (evt: JQuery.MouseUpEvent) => {
            // disable handlers
            $(this.$svg).off("mousemove", mousemove).off("mouseup", mouseup);
            $(svgEdge?.controlPoint).css("cursor", "grab");
            this.hideControlPoint(svgEdge.id);
            this.dragging = false;
        };
        $(this.$svg).on("mousemove", mousemove);
        $(this.$svg).on("mouseup", mouseup);
        evt.stopPropagation();
    }

    /**
     * Utility function, re-renders the given edge
     */
    redrawEdge ($edges: JQuery<SVGElement>, opt?: { controlPointCoords?: Coords<number> }): void {
        clearTimeout(this.timers.renderEdge);
        this.timers.renderEdge = setTimeout(() => {
            redrawPath($edges, opt);
        }, MAX_REFRESH_RATE);
    }
    /**
     * Utility function, performs a rigid translation of an edge
     */
    translateEdge ($edges: JQuery<SVGElement>, offset: Coords<number>): void {
        clearTimeout(this.timers.translateEdge);
        this.timers.translateEdge = setTimeout(() => {
            translateEdgePath($edges, offset);
        }, MAX_REFRESH_RATE);
    }
    /**
     * Internal function, handles mouse move events when moving the drag line
     */
    protected dragLine (svgNode: SVGNode, evt: JQuery.MouseDownEvent): void {
        const $dragLine: JQuery<SVGElement> = $(svgNode.dragLine);
        // mouse coordinates at drag start
        const dragStartCoords: Coords<number> = getMouseCoords(evt, this.$svg);
        // reveal dragline and initialize size to 0
        $dragLine.css("display", "block").attr("d", createDragLine(0, 0));
        // mouse move drags the arrowline; the handler is on the entire svg, so we don't risk of losing the node while moving (e.g., because the mouse goes out of the box)
        const mousemove = (evt: JQuery.MouseMoveEvent) => {
            const mousePosition: Coords<number> = getMouseCoords(evt, this.$svg);
            const offset: Coords<number> = {
                left: mousePosition.left - dragStartCoords?.left,
                top: mousePosition.top - dragStartCoords?.top
            };
            $dragLine.attr("d", createDragLine(offset.top, offset.left));
            // console.log("[dragLine]", offset);
        };
        // mouse up stops dragging; a new edge is created if the mouse is released on another node
        const mouseup = (evt: JQuery.MouseUpEvent) => {
            // disable handlers
            $(this.$svg).off("mousemove", mousemove).off("mouseup", mouseup);
            // hide dragline
            $dragLine.css("display", "none");
        };
        $(this.$svg).on("mousemove", mousemove);
        $(this.$svg).on("mouseup", mouseup);
        evt.stopPropagation();
    }
}

/**
 * Utility class, keeps track of the editor mode
 */
export class EditorModeManager implements EditorModeReader, EditorModeWriter {
    // current editor mode
    protected mode: EditorMode = EditorMode.BROWSE;
    /**
     * Returns the editor mode
     */
    getMode (): EditorMode {
        return this.mode;
    }
    /**
     * Sets the editor mode
     */
    setMode (mode: EditorMode): boolean {
        this.mode = mode;
        return true;
    }
}

/**
 * Emucharts Editor (main class)
 * To use the editor:
 * 1. create an editor instance
 * 2. render the view
 */
export class EmuchartsEditor extends Backbone.View {
    /**
     * Mouse event handlers
     */
    protected editHandler: EditHandler;

    /**
     * Editor modes
     */
    protected modeManager: EditorModeManager = new EditorModeManager();

    /**
     * DOM elements used for overlay and coordinates
     */
    protected elems: EmuchartsEditorElements;

    /**
     * DOM element for rendering mouse coordinates
     */
    protected $coords: JQuery<HTMLElement>;
    /**
     * DOM element for rendering overlay, markers, and tooltips
     * - overlay layer is used for rendering the contours of the hotspot
     * - markers layer is used for the corners of the hotspot
     * - tooltips layers is used for tooltips
     */
    protected $svg: JQuery<SVGElement>; 

    /**
     * Constructor
     */
    constructor (elems: EmuchartsEditorElements) {
        super(elems);
        this.elems = elems;
    }
    /**
     * Returns the list of events triggered when performing a gesture on the panel ($el)
     */
    events (): Backbone.EventsHash {
        return {
            scroll: "onScroll"
        };
    }
    /**
     * Utility function, sets the editor mode
     */
    setMode (mode: EditorMode): boolean {
        const success: boolean = this.modeManager.setMode(mode);
        if (success) {
            $(".node").css("cursor", (mode === EditorMode.NEW_EDGE || mode === EditorMode.NEW_SELF_EDGE) ? "cell" : "move");
        }
        return success;
    }
    /**
     * Returns the editor mode
     */
    getMode (): EditorMode {
        return this.modeManager.getMode();
    }
    /**
     * Internal function, handles scroll events
     */
    protected onScroll (evt: JQuery.ScrollEvent): void {
        evt.preventDefault();
    }
    /**
     * Renders the editor
     */
    renderView (size?: PictureSize): void {
        this.createHtmlContent(this.elems, size);
        this.$coords = $(this.elems.coords);
        this.editHandler = new EditHandler(this.$svg, this.modeManager);
        this.$svg.on("mousedown", (evt: JQuery.MouseDownEvent) => {
            this.editHandler.onMouseDown(evt);
        });
        // this.moveHandler = new MoveHandler(this.$el, { $tooltip: this.$tooltip, $builderCoords: this.$builderCoords });
        // this.resizeHandler = new ResizeHandler(this.$el, { $tooltip: this.$tooltip, $builderCoords: this.$builderCoords });
        // this.moveHandler.on(HotspotEditorEvents.DidMoveHotspot, (data: HotspotData) => {
        //     this.selectHotspot(data);
        //     this.trigger(HotspotEditorEvents.DidSelectHotspot, data);
        //     this.trigger(HotspotEditorEvents.DidMoveHotspot, data);
        // });
        // this.moveHandler.on(HotspotEditorEvents.DidSelectHotspot, (data: HotspotData) => {
        //     this.selectHotspot(data);
        //     this.trigger(HotspotEditorEvents.DidSelectHotspot, data);
        // });
        // this.resizeHandler.on(HotspotEditorEvents.DidResizeHotspot, (data: HotspotData) => {
        //     this.selectHotspot(data);
        //     this.trigger(HotspotEditorEvents.DidSelectHotspot, data);
        //     this.trigger(HotspotEditorEvents.DidResizeHotspot, data);
        // });
        // $(window).on("keydown", (evt: JQuery.KeyDownEvent) => {
        //     this.onKeyDown(evt);
        // });
    }
    /**
     * Internal function, creates the html elements of the editor
     */
    protected createHtmlContent (elems?: EmuchartsEditorElements, size?: PictureSize): EmuchartsEditor {
        elems = elems || this.elems;
        const content: string = Handlebars.compile(svgStyleTemplate)({});
        const panel: HTMLElement = elems?.panel || $("body")[0];
        const parent: HTMLElement = elems?.parent || panel;

        // create svg
        const width: number = size?.width || panel.style.width ? parseFloat(panel.style.width) : MIN_WIDTH;
        const height: number = size?.height || panel.style.height ? parseFloat(panel.style.height) : MIN_HEIGHT;
        const svg: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        $(svg).attr("width", `${width}`)
              .attr("height", `${height}`)
              .attr("viewBox", `0 0 ${width} ${height}`)
              .attr("xmlns", "http://www.w3.org/2000/svg");

        // append definitions necessary for drawing arrows
        const defs: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        const dragArrow: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "svg:path");
        $(dragArrow).css({ fill: "black" })
            .attr("d", "M4,0 L1,-3 L10,0 L1,3 L4,0");
        $(marker).css({ fill: "black" })
            .attr("class", "drag-arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("markerWidth", 16)
            .attr("markerHeight", 16)
            .attr("refX", 9)
            .attr("orient", "auto")
            .attr("id", "drag-arrow")
            .append(dragArrow);
        $(defs).append(marker);
        $(svg).append(defs);    

        $(parent).append(content).append(svg);
        this.$el.attr("draggable", "false");
        // this.$el.css("cursor", "crosshair");
        // context menu handler
        this.$el.on("contextmenu", (evt: JQuery.ContextMenuEvent) => {
            // context menu position is relative to body
            const menuCoords: Coords<number> = getMouseCoords(evt, $("body"));
            // elem position is relative to $el
            const elemCoords: Coords<number> = getMouseCoords(evt, this.$el);
            // const elemData: elemData = {
            //     id: this.clipboard?.id,
            //     coords: elemCoords
            // };
            // this.openContextMenu(menuCoords, elemData, {
            //     edit: false, delete: false, cut: false, copy: false
            // });
            evt.preventDefault();
        });
        this.$svg = <JQuery<SVGElement>> $(parent).find("svg");
        return this;
    }
    /**
     * Utility function, updates the svg size according to the given dimensions
     */
    resizeView (coords: Coords): boolean {
        if (coords) {
            const width: number = parseFloat(`${coords.width}`);
            const height: number = parseFloat(`${coords.height}`);
            this.$svg.attr("height", height)
                .attr("width", width)
                .attr("viewBox", `0 0 ${width} ${height}`);
            return true;
        }
        return false;
    }
}