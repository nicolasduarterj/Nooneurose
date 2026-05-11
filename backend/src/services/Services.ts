import EnvVars from "@src/common/constants/env";
import IAIService from "./AIService/IAIService";
import MainAIService from "./AIService/MainAIService";
import MockAIService from "./AIService/MockAIService";
import IMessageStorageService from "./MessageStorageService/IMessageStorageService";
import MockStorageService from "./MessageStorageService/MockMessageService";
import IPromptService from "./PromptService/IPromptService";
import LocalPromptService from "./PromptService/LocalPromptService";
import MockPromptService from "./PromptService/MockPromptService";
import DatabaseMessageStorageService from "./MessageStorageService/DatabaseMessageStorageService";
import MainPromptService from "./PromptService/MainPromptService";
import LocalMessageStorage from "./MessageStorageService/LocalMessageStorage";
import IUserService from "./UserService/UserService";
import MainUserService from "./UserService/MainUserService";
import MockUserService from "./UserService/MockUserService";
import LocalUserService from "./UserService/LocalUserService";


export interface Services {
    AIService: IAIService,
    MessageStorageService: IMessageStorageService,
    PromptService: IPromptService
    UserService: IUserService
}

export function getServices(): Services {
    switch(EnvVars.NodeEnv) {
        case "development":
            return { 
                AIService: MockAIService, 
                MessageStorageService: LocalMessageStorage,
                PromptService: LocalPromptService,
                UserService: LocalUserService
            }
        case "test":
            return { 
                AIService: MockAIService,
                MessageStorageService: MockStorageService,
                PromptService: MockPromptService,
                UserService: MockUserService
            }
        case "production":
            return {
                AIService: MainAIService,
                MessageStorageService: DatabaseMessageStorageService,
                PromptService: MainPromptService,
                UserService: MainUserService
            }
    }
}
