import { mastraClient } from "../../../lib/mastra";

export const getWeatherStreamByCity = async (city: string, callback: (text: string) => void) => {
  const agent = mastraClient.getAgent("weatherAgent");
  const response = await agent.stream({
    messages: [
      {
        role: "user",
        content: `What's the weather like in ${city}?`,
      },
    ],
  });

// Process data stream with the processDataStream util
response?.processDataStream({
  onTextPart: (text) => {
    callback(text);
  },
  onFilePart: (file) => {
    console.log(file);
  },
  onDataPart: (data) => {
    console.log(data);
  },
  onErrorPart: (error) => {
    console.error(error);
  },
});

}