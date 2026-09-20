<script lang="ts">
    import Widget from "./components/Widget.svelte";
    import { appState } from "./state.svelte";

    interface GreetingRule {
        startHour: number; // inclusive, 24h format
        labels: string[];
    }

    // time-based greetings, include {name} placeholders for the username
    const GREETING_RULES: GreetingRule[] = [
        {
            startHour: 0,
            labels: [
                "Good night{name}",
                "Still up{name}?",
                "Burning the midnight oil",
                "Up late{name}",
                "Working late",
                "Night owl",
                "Late night focus",
            ],
        },
        {
            startHour: 5,
            labels: [
                "Good morning",
                "Rise and shine{name}!",
                "Morning{name}!",
                "Early bird",
                "Ready for the day{name}?",
                "Morning focus",
            ],
        },
        {
            startHour: 9,
            labels: [
                "Good morning",
                "Good morning{name}!",
                "Hello{name}!",
                "Hey there!",
                "Ready to go{name}?",
                "Great to see you",
                "Let's make it a good day",
            ],
        },
        {
            startHour: 12,
            labels: [
                "Good afternoon",
                "How's the day going{name}?",
                "Hey{name}!",
                "Afternoon productivity",
            ],
        },
        {
            startHour: 15,
            labels: [
                "Good afternoon{name}",
                "Afternoon slump?",
                "Keep going{name}",
                "Almost through the day",
                "Stay focused",
            ],
        },
        {
            startHour: 18,
            labels: [
                "How was your day?",
                "Good evening{name}",
                "Winding down?",
                "Evening!",
                "Time to relax soon{name}",
            ],
        },
        {
            startHour: 22,
            labels: [
                "Good night{name}",
                "Sleep well",
                "Time to rest",
                "Wrapping up?",
            ],
        },
    ];

    // General greetings (mix of name and non-name templates)
    const SINGLE_LABELS: string[] = [
        "Hello!",
        "Hi there{name}!",
        "Hey!",
        "How you doing?",
        "Time to work?",
        "You're back{name}",
        "Welcome back",
        "Glad you're here",
        "What's on your mind?",
    ];

    function pickRandom<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }

    function currentRule(hour: number): GreetingRule {
        return (
            GREETING_RULES.findLast((rule) => hour >= rule.startHour) ??
            GREETING_RULES[0]
        );
    }

    function formatGreeting(template: string, name?: string): string {
        const trimmedName = name?.trim();
        // If there is a name, randomly decide whether to use it (~40% chance) IF the template supports it
        const shouldIncludeName =
            trimmedName && template.includes("{name}") && Math.random() < 0.4;

        if (shouldIncludeName) {
            return template.replace("{name}", `, ${trimmedName}`);
        }
        // Otherwise, strip out the placeholder entirely
        return template.replace("{name}", "");
    }

    function getGreeting(hour: number, name?: string): string {
        const useTimeBased = Math.random() <= 0.3;
        const template = useTimeBased
            ? pickRandom(SINGLE_LABELS)
            : pickRandom(currentRule(hour).labels);

        return formatGreeting(template, name);
    }

    let hour = $state(new Date().getHours());
    let greeting = $derived(getGreeting(hour, appState.userName));

    $effect(() => {
        const interval = setInterval(
            () => {
                const now = new Date().getHours();
                if (now !== hour) hour = now;
            },
            10 * 60 * 1000,
        );
        return () => clearInterval(interval);
    });
</script>

<Widget text={greeting} />
