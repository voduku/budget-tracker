<script lang="ts">
    import {Handle, type NodeProps, Position} from "@xyflow/svelte";
    import {CalendarIcon, CloudIcon} from "svelte-feather-icons";

    type $$Props = NodeProps
    export let data: $$Props['data']
</script>

<div class="cloud gradient">
    <div>
        <CloudIcon size="16"/>
    </div>
</div>
<div class="wrapper gradient node">
    <Handle type="source" position={Position.Left} id={Position.Left} class="handle"/>
    <Handle type="source" position={Position.Right} id={Position.Right} class="handle"/>
    <Handle type="source" position={Position.Top} id={Position.Top} class="handle"/>
    <Handle type="source" position={Position.Bottom} id={Position.Bottom} class="handle"/>

    <div class="inner">
        <div class="body">
            <div class="icon"><CalendarIcon/></div>
        </div>
        <div>
            <div class="title">{data.title}</div>
            <div class="subtitle">{data.subtitle}</div>
        </div>
    </div>
</div>