<script lang="ts">
    interface GreetingRule {
        labels: string[];
        startHour: number; // inclusive, 24h format
    }

    const SINGLE_LABELS: string[] = [
        "Hello",
        "Hi there!",
        "Hey!",
        "How you doing?",
        "Time to work?",
        "You're back",
    ];

    // Ordered by startHour ascending. Last rule wraps around to midnight.
    const GREETING_RULES: GreetingRule[] = [
        {
            labels: [
                "Good night",
                "Still up?",
                "Burning the midnight oil",
                "Up late",
            ],
            startHour: 0,
        },
        {
            labels: ["Good morning", "Rise and shine", "Morning!"],
            startHour: 5,
        },
        {
            labels: ["Good afternoon", "How's the day going?"],
            startHour: 12,
        },
        {
            labels: ["Good evening", "Winding down?"],
            startHour: 18,
        },
        {
            labels: ["Good night", "Sleep well", "Time to rest"],
            startHour: 22,
        },
    ];

    function pickRandom<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }

    function getGreeting(date: Date): string {
        const hour = date.getHours();
        let current = GREETING_RULES[0];
        for (const rule of GREETING_RULES) {
            if (hour >= rule.startHour) {
                current = rule;
            }
        }

        if (Math.random() > 0.3) {
            return pickRandom(current.labels);
        }
        return SINGLE_LABELS[Math.floor(Math.random() * SINGLE_LABELS.length)];
    }

    interface Props {
        currentTime: Date;
    }

    let { currentTime }: Props = $props();

    let greeting = $derived(getGreeting(currentTime));
</script>

<span>
    {greeting}
</span>
