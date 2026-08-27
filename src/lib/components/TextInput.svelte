<!-- TextInputWithButton.svelte -->
<script lang="ts">
    interface Props {
        id: string;
        label: string;
        value: string;
        placeholder?: string;
        buttonLabel?: string;
        hideLabel?: boolean;
        disableButton?: boolean;
        description?: string;
        onSubmit: (value: string) => void;
    }

    let {
        id,
        label,
        value = $bindable(""),
        placeholder = "",
        buttonLabel = "Submit",
        hideLabel = false,
        description = "",
        onSubmit,
        disableButton = false,
    }: Props = $props();

    function handleSubmit() {
        const trimmed = value.trim();
        if (trimmed.length === 0) return;
        onSubmit(trimmed);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }
</script>

<div class="field">
    <label for={id} class:visually-hidden={hideLabel}>
        {label}
    </label>
    <div class="input-row">
        <input
            {id}
            type="text"
            bind:value
            {placeholder}
            onkeydown={handleKeydown}
            autocomplete="off"
            aria-describedby={description.trim().length > 0
                ? `${id}-description`
                : undefined}
        />
        <button
            disabled={disableButton || value.trim().length == 0}
            type="button"
            onclick={handleSubmit}
        >
            {buttonLabel}
        </button>
    </div>
    {#if description.trim().length > 0}
        <p id="{id}-description" class="description">{description.trim()}</p>
    {/if}
</div>

<style>
    .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    label {
        font-size: 0.8em;
        font-weight: bold;
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

    .input-row {
        display: flex;
        gap: 8px;
    }

    input {
        flex: 1;
        padding: 0;
        border-bottom: 1px solid var(--foreground-20);
        background: transparent;
        color: var(--foreground-color);
        font: inherit;
        transition: 150ms linear;
        width: 100%;
    }

    input:focus,
    input:focus-visible {
        border-bottom: 1px solid var(--foreground-color);
    }

    button {
        cursor: pointer;
        padding: 8px 16px;
        border: none;
        color: inherit;
        font: inherit;
        background-color: var(--foreground-color);
        color: var(--background-color);
        border-radius: 6px;
        transition: 150ms linear;
    }

    button:hover {
        background-color: var(--foreground-color);
    }

    button:disabled {
        background-color: var(--foreground-60);
        cursor: not-allowed;
    }

    .description {
        cursor: default;
        font-size: 1em;
        font-weight: normal;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        margin-top: 8px;

        color: var(--foreground-60);
    }
</style>
