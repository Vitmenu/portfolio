import fs 	 from "node:fs/promises";
import path  from "node:path";

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

			const portfolioText = await fs.readFile(path.resolve('src', 'gpt', 'resources', 'portfolio.txt'), 'utf-8');
			const text = portfolioText;
			
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