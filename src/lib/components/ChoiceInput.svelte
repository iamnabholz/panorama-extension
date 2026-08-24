<!-- ChoiceInput.svelte -->
<script lang="ts">
    interface ChoiceOption {
        value: string;
        label: string;
        description?: string;
    }

    interface Props {
        id: string;
        label: string;
        options: ChoiceOption[];
        value: string;
        hideLabel?: boolean;
        onChange?: (value: string) => void;
    }

    let {
        id,
        label,
        options,
        value = $bindable(),
        hideLabel = false,
        onChange,
    }: Props = $props();

    let selectedDescription = $derived(
        options.find((opt) => opt.value === value)?.description ?? "",
    );

    function select(optionValue: string) {
        value = optionValue;
        onChange?.(optionValue);
    }

    function handleKeydown(event: KeyboardEvent, optionValue: string) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select(optionValue);
        }
    }
</script>

<div class="field">
    <span class="choice-label" class:visually-hidden={hideLabel}>
        {label}
    </span>
    <div class="choice-row" role="radiogroup" aria-labelledby="{id}-label">
        {#each options as option (option.value)}
            <button
                type="button"
                role="radio"
                aria-checked={value === option.value}
                class:selected={value === option.value}
                onclick={() => select(option.value)}
                onkeydown={(e) => handleKeydown(e, option.value)}
            >
                {option.label}
            </button>
        {/each}
    </div>
    {#if selectedDescription.trim().length > 0}
        <p id="{id}-description" class="description">
            {selectedDescription.trim()}
        </p>
    {/if}
</div>

<style>
    .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;
        box-sizing: border-box;
    }

    .choice-label {
        font-size: 0.8em;
        font-weight: bold;
        text-transform: capitalize;
    }

    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .choice-row {
        display: flex;
        gap: 4px;
        padding: 4px;
        background-color: var(--foreground-10);
        border-radius: 8px;
        width: 100%;
        box-sizing: border-box;
        transition: 150ms ease-out;
    }

    .choice-row button {
        flex: 1;
        cursor: pointer;
        padding: 6px 14px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0);

        transition: 150ms ease-out;
    }

    .choice-row button.selected {
        background-color: var(--foreground-color);
        color: var(--background-color);
    }

    .choice-row button:not(.selected):hover {
        background-color: var(--foreground-10);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .description {
        cursor: default;
        font-size: 1em;
        font-weight: normal;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        margin-top: 6px;
        color: var(--foreground-60);
    }
</style>
