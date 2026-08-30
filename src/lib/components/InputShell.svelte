<script lang="ts">
    interface Props {
        id: string;
        label: string;
        hideLabel?: boolean;
        hint?: string;
        children: import("svelte").Snippet;
    }
    let { id, label, hideLabel = false, hint, children }: Props = $props();
</script>

<div class="field">
    <span class="field-label" class:visually-hidden={hideLabel} id="{id}-label">
        {label}
    </span>
    {@render children()}
    {#if hint}
        <p id="{id}-hint" class="field-hint hint">{hint}</p>
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
    .field-label {
        font-weight: bold;
        text-transform: capitalize;
    }
    .field-hint {
        cursor: default;
        font-weight: normal;
        margin: 0;
        margin-top: 6px;
        word-wrap: break-word;
        overflow-wrap: break-word;
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
</style>
