/* -------------- -------------- -------------- -------------- -------------- -------------- --------------

    - Entry Point 

https://github.com/leonvanzyl/langchain-js/blob/lesson-3/output-parser.js
https://www.youtube.com/playlist?list=PL4HikwTaYE0EG379sViZZ6QsFMjJ5Lfwj

    
    - Official Docs ### Reference This Mainly ###
    
https://js.langchain.com/docs/get_started/quickstart
    Read from - Make sure you have the @langchain/openai package installed and the appropriate environment variables set (these are the same as needed for the model above).
https://js.langchain.com/docs/integrations/vectorstores/hnswlib
https://js.langchain.com/docs/integrations/vectorstores/memory



-------------- -------------- -------------- -------------- -------------- -------------- -------------- */
// import { HumanMessage, AIMessage } 						from "@langchain/core/messages";
// import { createHistoryAwareRetriever }					from "langchain/chains/history_aware_retriever";
// import { StringOutputParser }               				from "@langchain/core/output_parsers";

import fs 	 from "node:fs/promises";
import path  from "node:path";

// import OpenAI from "openai";
// import fetch  from "node-fetch";

// const openai = new OpenAI();

// async function changeName(text) {
// 	const completion = await openai.chat.completions.create({
// 		messages: [
// 			{
// 				role: "system",
// 				content: "You are a helpful assistant designed to output JSON with only one property 'name' ",
// 			},
// 			{
// 				role: "user",
// 				content: `which name does the speak want to be the user name from the following texts? ${text}`,
// 			},
// 		],
// 		model: "gpt-3.5-turbo-0125",
// 		response_format: {
// 			type: "json_object",
// 		},
// 	});
// 	console.log(completion);
// 	console.log('\n');
// 	console.log(completion.choices);
// 	console.log('\n');
// 	console.log(completion.choices[0]);
// 	console.log('\n');ß
// 	console.log(completion.choices[0].message);
// 	console.log('\n');
// 	console.log(completion.choices[0].message.content);
// 	console.log('\n');
// 	console.log(JSON.parse(completion.choices[0].message.content));
// }

// // changeName("Change my user name to 'JsonMedia'");

// async function getTheDate(message) {
// 	const completion = await openai.chat.completions.create({
// 		messages: [
// 			{
// 				role: "system",
// 				content: "You are a helpful assistant designed to output JSON with only one property 'timestamp' ",
// 			},
// 			{
// 				role: "assistant",
// 				content: `Hello, I'm here to help get the timestamp for the date in your message.`,
// 			},
// 			{
// 				role: "user",
// 				content: "How can today be described as timestamp?",
// 			},
// 			{
// 				role: "assistant",
// 				content: `Today's timestamp in the number of milliseconds elapsed since the epoch, which is defined as the midnight at the beginning of January 1, 1970, UTC is ${Date.now()}`,
// 			},
// 			{
// 				role: "user",
// 				content: message,
// 			},
// 		],
// 		model: "gpt-4-turbo",
// 		response_format: {
// 			type: "json_object",
// 		},
// 	});
// 	const result = JSON.parse(completion.choices[0].message.content);
// 	console.log(message);
// 	console.log(result);
// 	console.log(new Date(result.timestamp));
// };

// import { HNSWLib }          						from "@langchain/community/vectorstores/hnswlib";
import { ChatOpenAI, OpenAIEmbeddings }     		from "@langchain/openai";
import { MessagesPlaceholder, ChatPromptTemplate }  from "@langchain/core/prompts";
import { HumanMessage, AIMessage } 					from "@langchain/core/messages";
import { RecursiveCharacterTextSplitter }			from "langchain/text_splitter";
import { MemoryVectorStore } 						from "langchain/vectorstores/memory";
import { createRetrievalChain } 					from "langchain/chains/retrieval";
import { createStuffDocumentsChain } 				from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } 				from "langchain/chains/history_aware_retriever";

export class GPTAssistant {
	#embeddings 			= new OpenAIEmbeddings();
	#textSplitter 			= new RecursiveCharacterTextSplitter({ chunkSize: 4000 });
	#messagePlaceholder 	= new MessagesPlaceholder("chat_history");
	#chatModel 			= new ChatOpenAI({
		modelName: "gpt-3.5-turbo",
		temperature: 0.7,
	});
	#historyAwarePrompt = ChatPromptTemplate.fromMessages([
		this.#messagePlaceholder,
		["user", "{input}"],
		[
			"user",
			"Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
		],
	]);
	#historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
		[
			"system", 
			"you're going to sound like an assistant of this one uni student 'Juyeon Kim' (in Japanese, it's spelt キム　ジュヨン。In korean, it's 김 주연), who learns javascript/nodejs from web resources by itself and is currently in situation of applying a job."
		],
		[
			"system",
			"So, if you accept a question relevant about Juyeon Kim (in Japanese, it's spelt キム　ジュヨン。In korean, it's 김 주연), you have to tell the questioner that he/she better off asks the same question to Juyeon Kim directly only if you're not sure about the question of Juyeon Kim."
		],
		[
			"system",
			"But if you can find any relevant information for the question, just simply answer the question confidently."
		],
		[
			"system",
			"If, the question is not about Juyeon Kim (in Japanese, it's spelt キム　ジュヨン。In korean, it's 김 주연), you can just answer the question, but tell them that you would appreciate them if they question about Juyeon Kim sometimes too, since you're his assistant and exists for him."
		],
		[
			"system",
			"Also, tell them that you accept and answer the questions only when Juyeon is not connected. so, since you're accepting the question, they must know that Juyeon is not online now."
		],
		[
			"system",
			"Answer the user's questions based on the below context:\n\n{context}",
		],
		this.#messagePlaceholder,
		["user", "{input}"],
	]);
	createHumanMessage(message) {
		return new HumanMessage(message);
	};
	createAIMessage(message) {
		return new AIMessage(message);
	};
	async getAnswer(option={company, chat_history, question}) {
		try {
			if (option.company === undefined || option.chat_history === undefined || option.question === undefined) throw new Error('Invalid option for gpt');

			let companyText;
			const resumePath = path.resolve('src', 'gpt', 'resources', 'company', `${option.company}.txt`);

			try {
				companyText = await fs.readFile(resumePath, 'utf-8');
			} catch(err) {
				companyText = '';
			};

			const portfolioText = await fs.readFile(path.resolve('src', 'gpt', 'resources', 'portfolio.txt'), 'utf-8');
			const text = companyText + portfolioText;
			
			const splitDocs = await this.#textSplitter.createDocuments([text]);
			
			const vectorstore = await MemoryVectorStore.fromDocuments(
				splitDocs,
				this.#embeddings,
			);
			
			const retriever = vectorstore.asRetriever();
			
			const historyAwareRetrieverChain = await createHistoryAwareRetriever({
				llm: this.#chatModel,
				retriever,
				rephrasePrompt: this.#historyAwarePrompt,
			});
			  
			const historyAwareCombineDocsChain = await createStuffDocumentsChain({
				llm: this.#chatModel,
				prompt: this.#historyAwareRetrievalPrompt,
			});
			  
			const conversationalRetrievalChain = await createRetrievalChain({
				retriever: historyAwareRetrieverChain,
				combineDocsChain: historyAwareCombineDocsChain,
			});
			
			const result = await conversationalRetrievalChain.invoke({
				chat_history: option.chat_history,
				input: option.question,
			});
			return result.answer;
			
		} catch(err) {
			return err;
		};
	};
};