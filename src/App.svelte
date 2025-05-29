<script lang="ts">
  import {ConnectionMode, ControlButton, Controls, type Edge, type Node, type NodeEventWithPointer, Position, SvelteFlow} from "@xyflow/svelte";

  import "@xyflow/svelte/dist/style.css";
  import TurboNode from "./components/TurboNode.svelte";
  import TurboEdge from "./components/TurboEdge.svelte";
  import {getDaysInMonth} from "./utils";
  import DailySpendingModal from "./components/DailySpendingModal.svelte";
  import BudgetGoalModal from "./components/BudgetGoalModal.svelte";
  import {getAllBudgetGoalLocal, removeBudgetGoalLocal} from "./local-storage";

  const initialNodes: Node[] = [];
  const dates = getDaysInMonth();
  let budgetGoals = $state(getAllBudgetGoalLocal())

  for (let i = 0; i < dates.length - 1; i++) {
    const date = dates[i];
    initialNodes.push({
      type: "turbo",
      id: `${i}`,
      position: {x: (i * 300) % (300 * 7), y: Math.trunc(i / 7) * 250},
      data: {
        date: date.toDateString(),
        description: "",
      },
    });
  }

  const lastCalendarNode = dates.length - 1;
  initialNodes.push({
    type: "turbo",
    id: `${lastCalendarNode}`,
    position: {
      x: (lastCalendarNode * 300) % (300 * 7),
      y: Math.trunc(lastCalendarNode / 7) * 250,
    },
    data: {
      date: dates[lastCalendarNode].toDateString(),
      description: "",
    },
  });

  let nodes = $state.raw(initialNodes);
  let edges = $derived.by(() => {
    let edgs: Edge[] = [];
    for (let i = 0; i < dates.length - 1; i++) {
      Object.keys(budgetGoals).forEach((name) => {
        edgs.push({
          type: "turbo",
          id: `${name}-${i}-${i + 1}`,
          source: `${i}`,
          target: `${i + 1}`,
          sourceHandle: i % 7 === 6 ? Position.Bottom : Position.Right,
          targetHandle: i % 7 === 6 ? Position.Top : Position.Left,
          animated: true,
          data: {
            goals: budgetGoals,
            goalName: ''
          }
        })
      })
    }
    return edgs
  });

  const nodeTypes = {
    turbo: TurboNode,
  };

  const edgeTypes = {
    turbo: TurboEdge,
  };

  const defaultEdgeOptions = {
    type: "turbo",
    markerEnd: "edge-circle",
  };

  let openDailySpendingModal = $state(false);
  let openBudgetGoalModal = $state(false);
  let date: string = $state("");
  const handleContextMenu: NodeEventWithPointer<MouseEvent | TouchEvent> = ({event, node}) => {
    event.preventDefault();
    openDailySpendingModal = true;
    date = node.data.date as string;
  };
  const handleBudgetGoalClick = () => {
    openBudgetGoalModal = true
  }
  const clearGoals = () => removeBudgetGoalLocal('')

  $inspect(budgetGoals)
  $inspect(edges)
</script>

<div style:height="100vh">
  <SvelteFlow bind:edges bind:nodes connectionMode={ConnectionMode.Loose} {defaultEdgeOptions} {edgeTypes} fitView {nodeTypes} onnodeclick={handleContextMenu}>
    <Controls buttonBgColorHover="green" showLock={false}>
      <ControlButton onclick={handleBudgetGoalClick}>💰</ControlButton>
      <ControlButton onclick={clearGoals}>🗑️</ControlButton>
    </Controls>
    <DailySpendingModal bind:open={openDailySpendingModal} {date}/>
    <BudgetGoalModal bind:goals={budgetGoals} bind:open={openBudgetGoalModal}/>
    <svg>
      <defs>
        <linearGradient id="edge-gradient">
          <stop offset="0%" stop-color="#ae53ba"/>
          <stop offset="100%" stop-color="#2a8af6"/>
        </linearGradient>
        <marker id="edge-circle" markerHeight="10" markerUnits="strokeWidth" markerWidth="10" orient="auto" refX="0" refY="0" viewBox="-5 -5 10 10">
          <circle cx="0" cy="0" r="2" stroke="#2a8af6" stroke-opacity="0.75"/>
        </marker>
      </defs>
    </svg>
  </SvelteFlow>
</div>
