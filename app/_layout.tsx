
import { Stack } from 'expo-router';
import {ConvexProvider, ConvexReactClient} from "convex/react"


const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
});

export default function RootLayoutNav() {

    return (
        <ConvexProvider client={convex}>
            <Stack></Stack>
        </ConvexProvider>

    );
}
