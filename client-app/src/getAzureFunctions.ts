const azureFunctionsDevelopment = {
    AddQuestion: "http://localhost:7071/api/AddQuestion",
    AddUser: "http://localhost:7071/api/AddUser",
    GenerateTestingQuestions: "http://localhost:7071/api/GenerateTestingQuestions",
    GetAllQuestions: "http://localhost:7071/api/GetAllQuestions",
    GetQuestion: "http://localhost:7071/api/GetQuestion",
    GetQuestionsBySubject: "http://localhost:7071/api/GetQuestionsBySubject",
    GetStatistic: "http://localhost:7071/api/GetStatistic",
    GetSubjects: "http://localhost:7071/api/GetSubjects",
    GetUser: "http://localhost:7071/api/GetUser",
    PublishStageEvent: "http://localhost:7071/api/PublishStageEvent",
    PublishStatisticForStage: "http://localhost:7071/api/PublishStatisticForStage",
    RemoveQuestion: "http://localhost:7071/api/RemoveQuestion",
    SetUserIsOnline: "http://localhost:7071/api/SetUserIsOnline"
}

const azureFunctionsProduction = {
    AddQuestion: "https://jebrafunctions.azurewebsites.net/api/AddQuestion?code=qjDhpMaj6zWVgmPL54qIbN1jT/XacApyaaIz8u3Z7huXYk8vt/Lqpw==",
    AddUser: "https://jebrafunctions.azurewebsites.net/api/AddUser?code=ef8tHLZ8gfW1YoOLG10eJncjdr8cYRnl50ANFwXH8LRlKYf9qktUzA==",
    GenerateTestingQuestions: "https://jebrafunctions.azurewebsites.net/api/GenerateTestingQuestions?code=lnw959e/IjlDWfcKzGiSarmNE4CQE4oNSjIyzzgZbKacqghoyQVbYQ==",
    GetAllQuestions: "https://jebrafunctions.azurewebsites.net/api/GetAllQuestions?code=SpE3YBRP8mI3O3gy0/jLVOEaLTbUphO3Ck4qPimW3sOk9gnnsN8hMg==",
    GetQuestion: "https://jebrafunctions.azurewebsites.net/api/GetQuestion?code=KoWO/aWjlpHbXBep0eePd39TA1uwcTXjYQxMIOaHDgrTwTKkBT3S2g==",
    GetQuestionsBySubject: "https://jebrafunctions.azurewebsites.net/api/GetQuestionsBySubject?code=vNXyD4YCpneREaAqsgLXwhieE9G5BtsvpgNlQKbyehenaMmhlubBkg==",
    GetStatistic: "https://jebrafunctions.azurewebsites.net/api/GetStatistic?code=DckF6C0NetjhBbkPcvTNBaBJXxX9AtI7Vk3wX8d1id5BCy4Gra3Zkg==",
    GetSubjects: "https://jebrafunctions.azurewebsites.net/api/GetSubjects?code=3v6zECfqJMxl03FWkumi47hZcebRG1He3xrDcro0nK9RRVnoG19IAg==",
    GetUser: "https://jebrafunctions.azurewebsites.net/api/GetUser?code=KTR86aCSyCac6BXkKb9ldo3hSt/5lYPNurnXMBjgAdG0gak4u0gNFw==",
    PublishStageEvent: "https://jebrafunctions.azurewebsites.net/api/PublishStageEvent?code=d6Bzw70dGfyruuZDXBOasyCEffYrr8yuXWEhifaty2gK0RMa3Vntqg==",
    PublishStatisticForStage: "https://jebrafunctions.azurewebsites.net/api/PublishStatisticForStage?code=2vdm6tw60sMRJ5lkl5W/zbBaUN/hXQaQGuRuMGoZ3yaz52thBH8GRw==",
    RemoveQuestion: "https://jebrafunctions.azurewebsites.net/api/RemoveQuestion?code=guS3rbHgda5otaHCGdbQHC9SAga9mWRHaLxSSSaq70XxHv98aPCc2w==",
    SetUserIsOnline: "https://jebrafunctions.azurewebsites.net/api/SetUserIsOnline?code=/TqclO2QBFSinPDiv4okCZ8GzO2ka7aQZwSWZgiPZqw0U6NLtb8glA=="
};

const getAzureFunctions = () => (process.env.NODE_ENV === "development") ? azureFunctionsDevelopment : azureFunctionsProduction;
// Comment the line above and uncomment the line below if you want to use prod endpoints in a dev environment (DO SO CAUTIOUSLY)
//const getAzureFunctions = () => azureFunctionsProduction;

export default getAzureFunctions;