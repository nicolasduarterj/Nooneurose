import EnvVars from "@src/common/constants/env";
import IAIService from "./AIService/IAIService";
import MainAIService from "./AIService/MainAIService";
import MockAIService from "./AIService/MockAIService";
import IMessageStorageService from "./MessageStorageService/IMessageStorageService";
import LocalMessageStorage from "./MessageStorageService/LocalMessageStorage";
import MockStorageService from "./MessageStorageService/MockMessageService";
import IPromptService from "./promptService/IPromptService";
import LocalPromptService from "./promptService/LocalPromptService";
import MockPromptService from "./promptService/MockPromptService";
import DatabaseMessageStorageService from "./MessageStorageService/DatabaseMessageStorageService";


export interface Services {
    AIService: IAIService,
    MessageStorageService: IMessageStorageService,
    PromptService: IPromptService
}

export function getServices(): Services {
    switch(EnvVars.NodeEnv) {
        case "development":
            return { 
                AIService: MainAIService, 
                MessageStorageService: DatabaseMessageStorageService,
                PromptService: LocalPromptService
            }
        case "test":
            return { 
                AIService: MockAIService,
                MessageStorageService: MockStorageService,
                PromptService: MockPromptService
            }
        case "production":
            return {
                AIService: MainAIService,
                MessageStorageService: DatabaseMessageStorageService,
                PromptService: LocalPromptService
            }
    }
}
