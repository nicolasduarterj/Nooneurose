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
import ICharacterService from "./CharacterService/ICharacterService";
import MainCharacterService from "./CharacterService/MainCharacterService";
import IChatService from "./ChatService/IChatService";
import LocalChatService from "./ChatService/LocalChatService";
import MockChatService from "./ChatService/MockChatService";
import MainChatService from "./ChatService/MainChatService";
import LocalCharacterService from "./CharacterService/LocalCharacterService";
import MockCharacterService from "./CharacterService/MockCharacterStore";
import IReportService from "./ReportService/IReportService";
import LocalReportService from "./ReportService/LocalReportService";
import MockReportService from "./ReportService/MockReportService";
import MainReportService from "./ReportService/MainReportService";


export interface Services {
    AIService: IAIService,
    MessageStorageService: IMessageStorageService,
    PromptService: IPromptService
    UserService: IUserService
    CharacterService: ICharacterService
    ChatService: IChatService
    ReportService: IReportService
}

export function getServices(): Services {
    switch(EnvVars.NodeEnv) {
        case "development":
            return { 
                AIService: MockAIService, 
                MessageStorageService: LocalMessageStorage,
                PromptService: LocalPromptService,
                UserService: LocalUserService,
                CharacterService: LocalCharacterService,
                ChatService: LocalChatService,
                ReportService: LocalReportService
            }
        case "test":
            return {
                AIService: MockAIService,
                MessageStorageService: MockStorageService,
                PromptService: MockPromptService,
                UserService: MockUserService,
                CharacterService: MockCharacterService,
                ChatService: MockChatService,
                ReportService: MockReportService
            }
        case "production":
            return {
                AIService: MainAIService,
                MessageStorageService: DatabaseMessageStorageService,
                PromptService: MainPromptService,
                UserService: MainUserService,
                CharacterService: MainCharacterService,
                ChatService: MainChatService,
                ReportService: MainReportService
            }
    }
}
