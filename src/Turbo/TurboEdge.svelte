<script lang="ts">
    import {type EdgeProps, getBezierPath, useInternalNode} from "@xyflow/svelte";
    import {getEdgeParams} from "../utils";

    type $$Props = EdgeProps

    export let markerEnd: $$Props['markerEnd']
    export let source: $$Props['source']
    export let target: $$Props['target']
    export let id: $$Props['id']

    $: sourceNode = useInternalNode(source)
    $: targetNode = useInternalNode(target)

    let edgePath: string | undefined

    $: {
        if ($sourceNode && $targetNode) {
            const edgeParams = getEdgeParams($sourceNode, $targetNode);
            const xEqual = edgeParams.sx === edgeParams.tx;
            const yEqual = edgeParams.sy === edgeParams.ty;

            [edgePath] = getBezierPath({
                sourceX: xEqual ? edgeParams.sx + 0.0001 : edgeParams.sx,
                sourceY: yEqual ? edgeParams.sy + 0.0001 : edgeParams.sy,
                sourcePosition: edgeParams.sourcePos,
                targetPosition: edgeParams.targetPos,
                targetX: edgeParams.tx,
                targetY: edgeParams.ty
            });
        } else {
            edgePath = undefined;
        }
    }
</script>

<path {id} class="svelte-flow__edge-path" d={edgePath} marker-end={markerEnd} />