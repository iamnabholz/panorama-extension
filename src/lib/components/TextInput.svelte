<script lang="ts">
    import InputShell from "./InputShell.svelte";
    interface Props {
        id: string;
        label: string;
        hideLabel?: boolean;
        value: string;
        placeholder?: string;
        buttonLabel: string;
        disableButton?: boolean;
        onSubmit?: (value: string) => void;
    }
    let {
        id,
        label,
        hideLabel = false,
        value = $bindable(),
        placeholder,
        buttonLabel,
        disableButton = false,
        onSubmit,
    }: Props = $props();

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (disableButton || value.trim().length === 0) return;
        onSubmit?.(value);
    }
</script>

<InputShell {id} {label} {hideLabel}>
    <form class="input-row" onsubmit={handleSubmit}>
        <input
            {id}
            type="text"
            bind:value
            {placeholder}
            autocomplete="off"
            aria-labelledby="{id}-label"
            class="glass"
        />
        <button
            disabled={disableButton || value.trim().length === 0}
            type="submit"
        >
            {buttonLabel}
        </button>
    </form>
</InputShell>

<style>
    .input-row {
        display: flex;
        gap: 8px;
    }
    input {
        flex: 1;
        padding: 8px 6px;
        border-radius: var(--field-radius-md);
        color: var(--color-white);
        font: inherit;
        transition: var(--field-transition);
        width: 100%;
    }
    button:hover:not(:disabled),
    button:focus-visible:not(:disabled),
    input:hover:not(:focus) {
        outline: 2px solid var(--color-white);
        outline-offset: 2px;
    }
    input:focus-visible {
        border-color: var(--color-white);
    }
    button {
        cursor: pointer;
        padding: 8px 16px;
        border: none;
        color: inherit;
        font: inherit;
        background-color: var(--color-white);
        color: var(--color-black);
        border-radius: var(--field-radius-md);
        transition: var(--field-transition);
    }
    button:disabled {
        background-color: var(--white-60);
        cursor: not-allowed;
    }
</style>
