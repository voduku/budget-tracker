<script lang="ts">
  import {type NodeProps} from "@xyflow/svelte";
  import type {BudgetGoalStore} from "../local-storage";
  import {Radio, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";

  export interface DisplayNodeProps extends NodeProps {
    data: {
      goals: BudgetGoalStore;
    };
  }

  let {data}: DisplayNodeProps = $props();
  let selected = $state(Object.values(data.goals).find(goal => goal.isSelected)?.name)

  $effect(() => {
    Object.values(data.goals).forEach(goal => goal.name === selected ? goal.isSelected = true : goal.isSelected = false)
  })

  const handleOnclick = (event) => {
    event.stopPropagation();
  }
</script>

<div class="wrapper node">
  <div class="inner">
    <div class="body">
      <div class="space-y-6">
        <Table border={true} shadow={true} striped={true}>
          <TableHead>
            <TableHeadCell>Budget Goal</TableHeadCell>
            <TableHeadCell>Legend</TableHeadCell>
            <TableHeadCell>Display</TableHeadCell>
          </TableHead>
          <TableBody>
            {#each Object.values(data.goals) as goal (goal.name)}
              <TableBodyRow>
                <TableBodyCell>{goal.name}</TableBodyCell>
                <TableBodyCell>
                  <div style="background: linear-gradient(to right, {goal.colorStart}, {goal.colorEnd}); height: 4px"></div>
                </TableBodyCell>
                <TableBodyCell>
                  <Radio bind:group={selected} bind:value={goal.name} onclick={handleOnclick}></Radio>
                </TableBodyCell>
              </TableBodyRow>
            {/each}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</div>
