<script lang="ts">
    interface GreetingRule {
        startHour: number; // inclusive, 24h format
        labels: string[];
    }

    // Ordered by startHour ascending; last rule wraps around to midnight.
    const GREETING_RULES: GreetingRule[] = [
        {
            startHour: 0,
            labels: [
                "Good night",
                "Still up?",
                "Burning the midnight oil",
                "Up late",
                "Working late",
                "Night owl",
            ],
        },
        {
            startHour: 5,
            labels: [
                "Good morning",
                "Rise and shine",
                "Morning!",
                "Early bird",
            ],
        },
        {
            startHour: 9,
            labels: ["Good morning", "Hello", "Hey there!", "Ready to go?"],
        },
        {
            startHour: 12,
            labels: ["Good afternoon", "How's the day going?", "Hey!"],
        },
        {
            startHour: 15,
            labels: ["Good afternoon", "Afternoon slump?", "Keep going"],
        },
        {
            startHour: 18,
            labels: [
                "How was your day",
                "Good evening",
                "Winding down?",
                "Evening!",
            ],
        },
        {
            startHour: 22,
            labels: ["Good night", "Sleep well", "Time to rest"],
        },
    ];

    const SINGLE_LABELS: string[] = [
        "Hello",
        "Hi there!",
        "Hey!",
        "How you doing?",
        "Time to work?",
        "You're back",
        "Welcome back",
    ];

    function pickRandom<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }

    function currentRule(hour: number): GreetingRule {
        // GREETING_RULES is ascending, so the last match <= hour wins
        return (
            GREETING_RULES.findLast((rule) => hour >= rule.startHour) ??
            GREETING_RULES[0]
        );
    }

    function getGreeting(hour: number): string {
        const useTimeBased = Math.random() <= 0.3;
        return useTimeBased
            ? pickRandom(SINGLE_LABELS)
            : pickRandom(currentRule(hour).labels);
    }

    let hour = $state(new Date().getHours());
    let greeting = $derived(getGreeting(hour));

    $effect(() => {
        const interval = setInterval(() => {
            const now = new Date().getHours();
            if (now !== hour) hour = now;
        }, 60 * 1000); // check once a minute is enough for an hourly-granularity greeting
        return () => clearInterval(interval);
    });
</script>

<span>
    {greeting}
</span>
