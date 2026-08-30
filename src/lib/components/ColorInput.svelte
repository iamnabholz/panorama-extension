<script lang="ts">
    import InputShell from "./InputShell.svelte";

    interface Props {
        id: string;
        label: string;
        value: string;
        onChange?: (value: string) => void;
    }
    let { id, label, value = $bindable(), onChange }: Props = $props();

    let textDraft = $state(value);

    function handleColorPickerInput(event: Event) {
        value = (event.currentTarget as HTMLInputElement).value;
        textDraft = value;
        onChange?.(value);
    }

    function handleTextInput(event: Event) {
        textDraft = (event.currentTarget as HTMLInputElement).value;
    }

    function commitTextValue() {
        if (/^#[0-9a-fA-F]{6}$/.test(textDraft)) {
            value = textDraft;
            onChange?.(value);
        } else {
            textDraft = value; // revert invalid input
        }
    }

    function handleTextKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            (event.currentTarget as HTMLInputElement).blur();
        }
    }
</script>

<InputShell {id} {label}>
    <div class="color-row">
        <input
            type="color"
            id="{id}-picker"
            bind:value
            oninput={handleColorPickerInput}
            aria-labelledby="{id}-label"
        />
        <input
            type="text"
            class="color-text"
            {id}
            value={textDraft}
            size={Math.max(4, textDraft.length)}
            oninput={handleTextInput}
            onblur={commitTextValue}
            onkeydown={handleTextKeydown}
            spellcheck="false"
            autocomplete="off"
            aria-labelledby="{id}-label"
        />
    </div>
</InputShell>

<style>
    .color-row {
        position: relative;
        width: 100%;
        height: 96px;
    }
    input[type="color"] {
        all: unset;
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 100%;
        padding: 0;
        cursor: pointer;
        background: none;
        border: none;
        border-radius: var(--field-radius-lg);
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0px;
    }
    input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: var(--field-radius-md);
    }
    input[type="color"]::-moz-color-swatch {
        border: none;
        border-radius: var(--field-radius-md);
    }
    .color-text {
        position: absolute;
        inset: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;
        padding: 12px 0px;
        background-color: black;
        color: white;
        font-size: 1.6em;
        text-align: center;
        border: 1px solid transparent;
        border-radius: var(--field-radius-sm);
        transition: var(--field-transition);
    }
    .color-text:active,
    .color-text:focus-visible {
        border-color: currentColor;
    }
</style>
