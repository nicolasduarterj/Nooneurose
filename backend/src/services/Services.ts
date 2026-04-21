import EnvVars from "@src/common/constants/env";
import IAIService from "./AIService/IAIService";
import MainAIService from "./AIService/MainAIService";
import MockAIService from "./AIService/MockAIService";


export interface Services {
    AIService: IAIService
}

export function getServices(): Services {
    switch(EnvVars.NodeEnv) {
        case "development":
            return { AIService: MainAIService }
        case "test":
            return { AIService: MockAIService }
        case "production":
            return { AIService: MainAIService }
    }
}
