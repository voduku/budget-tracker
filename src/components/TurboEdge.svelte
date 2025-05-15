<script lang="ts">
  import {type EdgeProps, getBezierPath, useInternalNode} from "@xyflow/svelte";
  import {getEdgeParams} from "../utils";
  import type {BudgetGoal} from "../local-storage";

  interface ProgressProps extends EdgeProps {
    goals: Record<string, BudgetGoal>;
    goalName: string;
  }

  let {source, target, id, goals = $bindable({}), goalName = $bindable()}: ProgressProps = $props();

  let sourceNode = useInternalNode(source);
  let targetNode = useInternalNode(target);

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
        targetY: edgeParams.ty,
      })[0];
    }
    return undefined;
  });

  let isMakingProgress = $derived.by(() => {
    const goal = goals[goalName];
    return !!goal && new Date(goal.completionDate) < new Date();
  });
</script>

<path class:path-disabled={!isMakingProgress} class:svelte-flow__edge-path={isMakingProgress} d={path} fill="none" {id}/>
