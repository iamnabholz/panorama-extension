<script lang="ts">
    interface Props {
        currentTime: Date;
    }
    let { currentTime }: Props = $props();

    let hourAngle = $derived(
        (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5,
    );
    let minuteAngle = $derived(currentTime.getMinutes() * 6);
    let secondsAngle = $derived(currentTime.getSeconds() * 6);
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="7"
        ry="7"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="1.5"
    />
    <!-- 12, 3, 6, 9 tick marks -->
    <line
        x1="12"
        y1="2"
        x2="12"
        y2="3.2"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
    />
    <line
        x1="22"
        y1="12"
        x2="20.8"
        y2="12"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
    />
    <line
        x1="12"
        y1="22"
        x2="12"
        y2="20.8"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
    />
    <line
        x1="2"
        y1="12"
        x2="3.2"
        y2="12"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
    />

    <line
        x1="12"
        y1="12"
        x2="12"
        y2="6"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        transform="rotate({hourAngle} 12 12)"
    />
    <line
        x1="12"
        y1="12"
        x2="12"
        y2="4"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        transform="rotate({minuteAngle} 12 12)"
    />
    <line
        x1="12"
        y1="14"
        x2="12"
        y2="3"
        stroke="var(--accent-color)"
        stroke-width="0.8"
        stroke-linecap="square"
        transform="rotate({secondsAngle} 12 12)"
    />
    <circle cx="12" cy="12" r="1" fill="var(--accent-color)" />
</svg>
