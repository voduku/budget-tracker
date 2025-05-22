<script lang="ts">
  import {Button, Input, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
  import {type BudgetGoal, type BudgetGoalStore, saveAllBudgetGoalLocal} from "../local-storage";

  interface ModalProps {
    open: boolean;
    goals: BudgetGoalStore;
  }

  // Props for the component
  let {open = $bindable(false), goals = $bindable({})}: ModalProps = $props();

  // Form state for new item
  let newGoal: BudgetGoal = $state({
    name: "",
    description: "",
    amount: 0.00,
    startDate: new Date().toLocaleDateString(),
    completionDate: new Date().toLocaleDateString()
  });

  function roundHalfEven(num) {
    const decimal = num - Math.floor(num);
    if (decimal === 0.5) {
      return Math.floor(num) % 2 === 0 ? Math.floor(num) : Math.ceil(num);
    }
    return Math.round(num);
  }

  function addBudgetGoal() {
    // Validate required fields
    if (!newGoal.name || !newGoal.amount || !newGoal.startDate) {
      return;
    }

    // Add new item to the list
    console.log(new Date(newGoal.startDate).getTime(), roundHalfEven(newGoal.amount / 4000 * 30))
    goals = {
      ...goals,
      [newGoal.name]: {
        name: newGoal.name,
        description: newGoal.description,
        amount: newGoal.amount,
        startDate: newGoal.startDate,
        completionDate: new Date(new Date(newGoal.startDate).getTime() + roundHalfEven(newGoal.amount / 4000 * 30) * 86400000).toLocaleDateString()// fix income 4000/month
      },
    };

    // Reset form
    newGoal = {
      name: "",
      description: "",
      amount: 0.00,
      startDate: new Date().toLocaleDateString(),
      completionDate: new Date().toLocaleDateString()
    };
  }

  // Remove spending item
  function removePlan(goalName: string) {
    goals = Object.entries(goals)
      .filter(([name, _]) => name !== goalName)
      .reduce((obj, [name, goal]) => {
        obj[name] = goal;
        return obj;
      }, {} as BudgetGoalStore);
  }

  // Format currency
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function save() {
    saveAllBudgetGoalLocal(goals);
    open = false;
  }
</script>

<Modal autoclose={false} bind:open class="spending-modal" outsideclose={true} size="xl">
  {#snippet header()}
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Budget Goals
    </h3>
  {/snippet}

  <div class="space-y-6">
    <!-- Table of spending items -->
    <Table border={true} shadow={true} striped={true}>
      <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Goal</TableHeadCell>
        <TableHeadCell>Start Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each Object.values(goals) as goal (goal.name)}
          <TableBodyRow>
            <TableBodyCell>{goal.name}</TableBodyCell>
            <TableBodyCell>{goal.description}</TableBodyCell>
            <TableBodyCell>{formatCurrency(goal.amount)}</TableBodyCell>
            <TableBodyCell>{goal.startDate}</TableBodyCell>
            <TableBodyCell>
              <Button class="bg-primary-50" size="xs" onclick={() => removePlan(goal.name)}>
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Button>
            </TableBodyCell>
          </TableBodyRow>
        {/each}

        <!-- New item form row -->
        <TableBodyRow>
          <TableBodyCell>
            <Input bind:value={newGoal.name} class="w-full" placeholder="Name" required type="text"/>
          </TableBodyCell>
          <TableBodyCell>
            <Input bind:value={newGoal.description} class="w-full" placeholder="Description" type="text"/>
          </TableBodyCell>
          <TableBodyCell>
            <Input bind:value={newGoal.amount} class="w-full" placeholder="0.00" required step="0.01" type="number"/>
          </TableBodyCell>
          <TableBodyCell>
            <Input bind:value={newGoal.startDate} class="w-full" placeholder={newGoal.startDate} required type="text"/>
          </TableBodyCell>
          <TableBodyCell>
            <Button class="bg-primary-900" onclick={addBudgetGoal} size="xs">
              <svg
                aria-hidden="true"
                class="w-6 h-6 text-gray-800 dark:text-white"
                fill="currentColor"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                  fill-rule="evenodd"
                />
              </svg>
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      </TableBody>
    </Table>
  </div>

  {#snippet footer()}
    <div class="text-lg font-bold">
      Total: {formatCurrency(0)}
    </div>
    <div class="flex gap-2 right-0">
      <Button class="bg-primary-50 text-black" onclick={() => (open = false)}>Close</Button>
      <Button class="bg-primary-900 text-black" onclick={save}>Save</Button>
    </div>
  {/snippet}
</Modal>

<style>
  /* Make modal take 60% of viewport width */
  :global(.spending-modal [role="dialog"]) {
    width: 60vw;
    max-width: 60vw;
  }

  /* Ensure content inside the modal scales properly */
  :global(.spending-modal .modal-content) {
    width: 100%;
    max-width: none;
  }
</style>
