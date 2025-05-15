<script lang="ts">
    import {
        Button,
        Input,
        Modal,
        Select,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from 'flowbite-svelte';

    // Props for the component
    let {date, open = $bindable(false)} = $props();

    // State for spending items
    let spendingItems = $state([
        {
            id: 1,
            timestamp: '09:30',
            name: 'Breakfast',
            category: 'Food',
            amount: 12.50,
            description: 'Coffee and bagel'
        },
        {
            id: 2,
            timestamp: '13:00',
            category: 'Transportation',
            name: 'Uber',
            amount: 25.75,
            description: 'Ride to meeting'
        }
    ]);

    // Form state for new item
    let newItem = $state({
        timestamp: '',
        name: '',
        category: '',
        amount: '',
        description: ''
    });

    // Available categories (can be expanded)
    const categories = [
        'Food',
        'Transportation',
        'Entertainment',
        'Shopping',
        'Utilities',
        'Housing',
        'Healthcare',
        'Education',
        'Personal',
        'Other'
    ];

    // Calculate total spending
    let total = $derived(spendingItems.reduce((sum, item) => sum + Number(item.amount), 0));

    // Add new spending item
    function addSpendingItem() {
        // Validate required fields
        if (!newItem.name || !newItem.amount || !newItem.category) {
            return;
        }

        // Generate unique ID
        const id = Math.max(0, ...spendingItems.map(item => item.id)) + 1;

        // Add timestamp if not provided
        const timestamp = newItem.timestamp || new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // Add new item to the list
        spendingItems = [...spendingItems, {
            id,
            timestamp,
            name: newItem.name,
            category: newItem.category,
            amount: Number(newItem.amount),
            description: newItem.description
        }];

        // Reset form
        newItem = {
            timestamp: '',
            name: '',
            category: '',
            amount: '',
            description: ''
        };
    }

    // Remove spending item
    function removeSpendingItem(id: number) {
        spendingItems = spendingItems.filter(item => item.id !== id);
    }

    // Format currency
    function formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

</script>

<Modal
        bind:open
        size="xl"
        autoclose={false}
        outsideclose={false}
        class="spending-modal"
>
    <div slot="header" class="flex items-center">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">
            Daily Spending: {date}
        </h3>
    </div>

    <div class="space-y-6">
        <!-- Table of spending items -->
        <Table striped={true}>
            <TableHead>
                <TableHeadCell>Time</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each spendingItems as item (item.id)}
                    <TableBodyRow>
                        <TableBodyCell>{item.timestamp}</TableBodyCell>
                        <TableBodyCell>{item.name}</TableBodyCell>
                        <TableBodyCell>{item.category}</TableBodyCell>
                        <TableBodyCell>{formatCurrency(item.amount)}</TableBodyCell>
                        <TableBodyCell>{item.description}</TableBodyCell>
                        <TableBodyCell>
                            <Button class="bg-primary-50" size="xs" on:click={() => removeSpendingItem(item.id)}>
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                     viewBox="0 0 24 24">
                                    <path fill-rule="evenodd"
                                          d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                          clip-rule="evenodd"/>
                                </svg>
                            </Button>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}

                <!-- New item form row -->
                <TableBodyRow>
                    <TableBodyCell>
                        <Input
                                type="time"
                                class="w-full"
                                bind:value={newItem.timestamp}
                                placeholder="Time"
                        />
                    </TableBodyCell>
                    <TableBodyCell>
                        <Input
                                type="text"
                                class="w-full"
                                bind:value={newItem.name}
                                placeholder="Item name"
                                required
                        />
                    </TableBodyCell>
                    <TableBodyCell>
                        <Select
                                class="w-full"
                                bind:value={newItem.category}
                                required
                        >
                            <option value="" disabled selected>Select category</option>
                            {#each categories as category}
                                <option value={category}>{category}</option>
                            {/each}
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell>
                        <Input
                                type="number"
                                step="0.01"
                                class="w-full"
                                bind:value={newItem.amount}
                                placeholder="0.00"
                                required
                        />
                    </TableBodyCell>
                    <TableBodyCell>
                        <Input
                                type="text"
                                class="w-full"
                                bind:value={newItem.description}
                                placeholder="Description"
                        />
                    </TableBodyCell>
                    <TableBodyCell>
                        <Button class="bg-primary-900" size="xs" on:click={addSpendingItem}>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                 viewBox="0 0 24 24">
                                <path fill-rule="evenodd"
                                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </Button>
                    </TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
    </div>

    <div slot="footer" class="flex justify-between items-center">
        <div class="text-lg font-bold">
            Total: {formatCurrency(total)}
        </div>
        <div class="flex gap-2 right-0">
            <Button class="bg-primary-50 text-black" on:click={() => open = false}>Close</Button>
            <Button class="bg-primary-900 text-black">Save</Button>
        </div>
    </div>
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