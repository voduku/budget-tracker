<script lang="ts">
    import {type EdgeProps, getBezierPath, useInternalNode} from "@xyflow/svelte";
    import {getEdgeParams} from "../utils";
    import {BaseEdge} from "@xyflow/svelte";

    let {source, target, id}: EdgeProps = $props()

    let sourceNode = useInternalNode(source)
    let targetNode = useInternalNode(target)

    let path: string | undefined = $derived.by(() => {
        if (sourceNode.current && targetNode.current) {
            const edgeParams = getEdgeParams(sourceNode.current, targetNode.current);
            const xEqual = edgeParams.sx === edgeParams.tx;
            const yEqual = edgeParams.sy === edgeParams.ty;

            return getBezierPath({
                sourceX: xEqual ? edgeParams.sx + 0.0001 : edgeParams.sx,
                sourceY: yEqual ? edgeParams.sy + 0.0001 : edgeParams.sy,
                sourcePosition: edgeParams.sourcePos,
                targetPosition: edgeParams.targetPos,
                targetX: edgeParams.tx,
                targetY: edgeParams.ty
            })[0]
        }
        return undefined
    })
</script>

<BaseEdge {id} {path} />