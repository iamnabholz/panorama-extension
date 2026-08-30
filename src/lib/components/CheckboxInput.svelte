<script lang="ts">
    interface Props {
        id: string;
        label: string;
        checked: boolean;
        disabled?: boolean;
        onChange?: (checked: boolean) => void;
    }
    let {
        id,
        label,
        checked = $bindable(),
        disabled = false,
        onChange,
    }: Props = $props();

    function handleChange(event: Event) {
        checked = (event.currentTarget as HTMLInputElement).checked;
        onChange?.(checked);
    }
</script>

<label class="checkbox-row" for={id}>
    <span class="text">{label}</span>
    <span class="box-wrapper">
        <input
            type="checkbox"
            {id}
            {checked}
            {disabled}
            onchange={handleChange}
        />
        <span class="box" class:checked aria-hidden="true">
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
    </span>
</label>

<style>
    .checkbox-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        cursor: pointer;
        padding: 8px 0px;
        border-radius: var(--field-radius-md);
        width: 100%;
    }
    .checkbox-row:has(input:disabled) {
        cursor: unset;
        opacity: 0.5;
    }
    .box-wrapper {
        position: relative;
        display: inline-flex;
        flex-shrink: 0;
    }
    input[type="checkbox"] {
        position: absolute;
        inset: 0;
        width: 18px;
        height: 18px;
        margin: 0;
        opacity: 0;
        cursor: pointer;
    }
    .box {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        margin-top: 0.1em;
        border-radius: 6px;
        border: 2px solid var(--white-80);
        background-color: transparent;
        color: var(--color-black);
        transition: var(--field-transition);
    }
    .box.checked {
        background-color: var(--color-white);
        border-color: var(--color-white);
    }

    .checkbox-row:focus-visible .box,
    .checkbox-row:hover .box,
    input[type="checkbox"]:focus-visible,
    input[type="checkbox"]:hover {
        outline: 2px solid var(--color-white);
        outline-offset: 2px;
    }
    .text {
        font-size: 1em;
        line-height: 1.4;
        text-transform: capitalize;
        font-weight: bold;
    }
</style>
