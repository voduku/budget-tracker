<script lang="ts">
  import {Handle, type NodeProps, Position} from "@xyflow/svelte";

  export interface TurboNodeProps extends NodeProps {
    data: {
      date: string;
      description: string;
    };
  }

  let {data}: TurboNodeProps = $props();
</script>

<div class="wrapper gradient node">
  <Handle class="handle" id={Position.Left} position={Position.Left} type="source"/>
  <Handle class="handle" id={Position.Right} position={Position.Right} type="source"/>
  <Handle class="handle" id={Position.Top} position={Position.Top} type="source"/>
  <Handle class="handle" id={Position.Bottom} position={Position.Bottom} type="source"/>

  <div class="inner">
    <div class="body">
      <svg
        aria-hidden="true"
        class="w-6 h-6 text-gray-800 dark:text-white"
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </div>
    <div>
      <div class="title">{data.date}</div>
      <div class="description">{data.description}</div>
    </div>
  </div>
</div>
