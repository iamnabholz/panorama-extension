<!-- ColorInput.svelte -->
<script lang="ts">
    interface Props {
        id: string;
        label: string;
        value: string;
        onChange?: (value: string) => void;
    }
    let { id, label, value = $bindable("#000000"), onChange }: Props = $props();

    // separate draft state for the text field, so invalid mid-typing input
    // doesn't immediately corrupt the color swatch's value
    let textDraft = $state(value);

    $effect(() => {
        textDraft = value; // keep text field in sync if value changes externally (e.g. picker)
    });

    const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

    function handleColorPickerInput(event: Event) {
        const target = event.currentTarget as HTMLInputElement;
        value = target.value;
        onChange?.(target.value);
    }

    function handleTextInput(event: Event) {
        const target = event.currentTarget as HTMLInputElement;
        textDraft = target.value;
    }

    function commitTextValue() {
        if (HEX_PATTERN.test(textDraft)) {
            value = textDraft;
            onChange?.(textDraft);
        } else {
            textDraft = value; // revert to last valid value
        }
    }

    function handleTextKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            commitTextValue();
        }
    }
</script>

<div class="field">
    <label for={id}>
        {label}
    </label>
    <div class="color-row">
        <input
            type="color"
            {id}
            bind:value
            oninput={handleColorPickerInput}
            aria-describedby="Pick a background color"
        />
        <input
            type="text"
            class="color-text"
            value={textDraft}
            size={Math.max(4, textDraft.length)}
            oninput={handleTextInput}
            onblur={commitTextValue}
            onkeydown={handleTextKeydown}
            spellcheck="false"
            autocomplete="off"
            aria-label={`${label} hex value`}
        />
    </div>
</div>

<style>
    .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        box-sizing: border-box;
    }

    label {
        font-size: 0.8em;
        font-weight: bold;
    }

    .color-row {
        position: relative;
        width: 100%;
        height: 10em;
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
        border-radius: 8px;
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0px;
    }

    input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: 6px;
    }

    input[type="color"]::-moz-color-swatch {
        border: none;
        border-radius: 6px;
    }

    .color-text {
        position: absolute;
        inset: 0;
        margin: auto;
        width: fit-content; /* now just wraps the size-driven intrinsic width */
        height: fit-content;
        padding: 12px 0px;

        background-color: black;
        color: white;
        font-size: 2em;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 4px;

        transition: 150ms ease;
    }

    .color-text:active,
    .color-text:focus-visible {
        border-color: currentColor;
    }
</style>
