<script lang="ts">
  import {type EdgeProps, getBezierPath, useInternalNode, useNodesData} from "@xyflow/svelte";
  import {getEdgeParams} from "../utils";
  import type {BudgetGoal} from "../local-storage";
  import type {TurboNodeProps} from "./TurboNode.svelte";

  export interface TurboEdgeProps extends EdgeProps {
    data: {
      goals: Record<string, BudgetGoal>,
      goalName: string;
    };
  }

  let {source, target, id, data}: TurboEdgeProps = $props();

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

  let color = $derived.by(() => {
    const [sourceData, targetData] = useNodesData([source, target]).current.map((d) => d.data as TurboNodeProps['data']);
    // const goal = goals[goalName];
    const goal = Object.values(data.goals).find(goal => goal.isSelected)
    const currentDate = new Date();

    if (!!goal
      && new Date(sourceData.date) >= new Date(goal.startDate)
      && new Date(targetData.date) <= new Date(goal.completionDate)
      && new Date(targetData.date) < currentDate
    ) {
      return "url(#edge-gradient)"
    } else {
      return "gray"
    }
  });
</script>

<path d={path} fill="none" {id} style:stroke={color} style:stroke-opacity="0.75" style:stroke-width="2"/>
