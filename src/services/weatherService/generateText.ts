

import { mastraClient } from "@/lib/mastra";

export const generateWeatherWithCity = async (city: string) => {
    const agent = mastraClient.getAgent("weatherAgent");
    const response = await agent.generate({
        messages: [{ role: "user", content: `What's the weather like in ${city}?` }]
    });
    return response.text;    
}
