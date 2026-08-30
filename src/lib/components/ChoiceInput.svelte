<script lang="ts">
    import InputShell from "./InputShell.svelte";

    interface Option {
        label: string;
        value: string;
    }
    interface Props {
        id: string;
        label: string;
        hideLabel?: boolean;
        options: Option[];
        value: string;
        onChange?: (value: string) => void;
    }
    let {
        id,
        label,
        hideLabel = false,
        options,
        value = $bindable(),
        onChange,
    }: Props = $props();

    function select(next: string) {
        value = next;
        onChange?.(next);
    }

    function handleKeydown(event: KeyboardEvent, optionValue: string) {
        const currentIndex = options.findIndex((o) => o.value === value);
        let nextIndex: number | null = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            nextIndex = (currentIndex + 1) % options.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            nextIndex = (currentIndex - 1 + options.length) % options.length;
        }
        if (nextIndex !== null) {
            event.preventDefault();
            select(options[nextIndex].value);
            (event.currentTarget as HTMLElement)
                .closest(".choice-row")
                ?.querySelectorAll("button")
                [nextIndex]?.focus();
        }
    }
</script>

<InputShell {id} {label} {hideLabel}>
    <div
        class="choice-row glass"
        role="radiogroup"
        aria-labelledby="{id}-label"
    >
        {#each options as option (option.value)}
            <button
                type="button"
                role="radio"
                aria-checked={value === option.value}
                tabindex={value === option.value ? 0 : -1}
                class:selected={value === option.value}
                onclick={() => select(option.value)}
                onkeydown={(e) => handleKeydown(e, option.value)}
            >
                {option.label}
            </button>
        {/each}
    </div>
</InputShell>

<style>
    .choice-row {
        display: flex;
        gap: 4px;
        padding: 4px;
        border-radius: var(--field-radius-lg);
        width: 100%;
        box-sizing: border-box;
        transition: var(--field-transition);
    }
    .choice-row button {
        flex: 1;
        cursor: pointer;
        padding: 6px 14px;
        border: 1px solid transparent;
        border-radius: var(--field-radius-md);
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: center;
        transition: var(--field-transition);
    }
    .choice-row button.selected {
        background-color: var(--color-white);
        color: var(--color-black);
    }
    .choice-row button:not(.selected):hover {
        background-color: var(--white-20);
    }
    .choice-row button:is(.selected):hover,
    .choice-row button:focus-visible {
        outline: 2px solid var(--color-white);
        outline-offset: 2px;
    }
</style>
