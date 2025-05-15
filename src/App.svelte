<script lang="ts">
    import {
        ConnectionMode,
        Controls,
        type Edge,
        type Node,
        type NodeEventWithPointer,
        Position,
        SvelteFlow,
    } from '@xyflow/svelte';

    import '@xyflow/svelte/dist/style.css';
    import TurboNode from "./Turbo/TurboNode.svelte";
    import TurboEdge from "./Turbo/TurboEdge.svelte";
    import {getDaysInMonth} from "./utils";
    import TurboDailySpending from "./Turbo/TurboDailySpending.svelte";

    const initialNodes: Node[] = []
    const initialEdges: Edge[] = []
    const dates = getDaysInMonth()
    for (let i = 0; i < dates.length - 1; i++) {
        const date = dates[i]
        initialNodes.push({
            type: 'turbo',
            id: `${i}`,
            position: {x: (i * 300) % (300 * 7), y: Math.trunc(i / 7) * 250},
            data: {
                date: date.toDateString(),
                description: 100
            }
        })
        initialEdges.push({
            type: 'turbo',
            id: `${i}-${i + 1}`,
            source: `${i}`,
            target: `${i + 1}`,
            sourceHandle: i % 7 === 6 ? Position.Bottom : Position.Right,
            targetHandle: i % 7 === 6 ? Position.Top : Position.Left,
            animated: true,
        })
    }
    const lastCalendarNode = dates.length - 1
    initialNodes.push({
        type: 'turbo',
        id: `${lastCalendarNode}`,
        position: {x: (lastCalendarNode * 300) % (300 * 7), y: Math.trunc(lastCalendarNode / 7) * 250},
        data: {
            title: dates[lastCalendarNode].toDateString(),
            subtitle: 100
        }
    })

    let nodes = $state.raw(initialNodes)
    let edges = $state.raw(initialEdges)

    const nodeTypes = {
        turbo: TurboNode
    };

    const edgeTypes = {
        turbo: TurboEdge
    };

    const defaultEdgeOptions = {
        type: 'turbo',
        markerEnd: 'edge-circle'
    }

    let open = $state(false)
    let nodeId: string = $state("")
    let date: string = $state("")
    const handleContextMenu: NodeEventWithPointer<MouseEvent | TouchEvent> = ({event, node}) => {
        open = true
        nodeId = node.id
        date = node.data.date
        console.log(open)
    }
</script>

<div style:height="100vh">
    <SvelteFlow bind:nodes {nodeTypes} bind:edges {edgeTypes} {defaultEdgeOptions} fitView
                onnodeclick={handleContextMenu}
                connectionMode={ConnectionMode.Loose}>
        <Controls showLock={false}/>
        <TurboDailySpending bind:open nodeId={nodeId} date={date}/>
        <svg>
            <defs>
                <linearGradient id="edge-gradient">
                    <stop offset="0%" stop-color="#ae53ba"/>
                    <stop offset="100%" stop-color="#2a8af6"/>
                </linearGradient>
                <marker
                        id="edge-circle"
                        viewBox="-5 -5 10 10"
                        refX="0"
                        refY="0"
                        markerUnits="strokeWidth"
                        markerWidth="10"
                        markerHeight="10"
                        orient="auto"
                >
                    <circle stroke="#2a8af6" stroke-opacity="0.75" r="2" cx="0" cy="0"/>
                </marker>
            </defs>
        </svg>
    </SvelteFlow>
</div>
