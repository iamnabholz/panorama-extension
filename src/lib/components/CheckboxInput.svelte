<script lang="ts">
    interface Props {
        id: string;
        label: string;
        text: string;
        checked: boolean;
        hideLabel?: boolean;
        onChange?: (checked: boolean) => void;
    }
    let {
        id,
        label,
        text,
        checked = $bindable(),
        hideLabel = false,
        onChange,
    }: Props = $props();

    function toggle() {
        checked = !checked;
        onChange?.(checked);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
        }
    }
</script>

<div class="field">
    <span
        class="choice-label"
        class:visually-hidden={hideLabel}
        id="{id}-label"
    >
        {label}
    </span>
    <div
        class="checkbox-row"
        role="checkbox"
        tabindex="0"
        aria-checked={checked}
        aria-labelledby="{id}-label"
        onclick={toggle}
        onkeydown={handleKeydown}
    >
        <span class="box" class:checked>
            {#if checked}
                <svg viewBox="0 0 16 16" width="12" height="12">
                    <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            {/if}
        </span>
        <span class="text">{text}</span>
    </div>
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
    .checkbox-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        cursor: pointer;
        padding: 6px 4px;
        border-radius: 6px;
        transition: 150ms ease-out;
    }
    .checkbox-row:hover {
        background-color: var(--foreground-10);
    }
    .box {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        margin-top: 0.1em;
        border-radius: 4px;
        border: 1px solid var(--foreground-60);
        color: var(--background-color);
        transition: 150ms ease-out;
    }
    .box.checked {
        background-color: var(--foreground-color);
        border-color: var(--foreground-color);
    }
    .text {
        font-size: 1em;
        line-height: 1.4;
    }
</style>
