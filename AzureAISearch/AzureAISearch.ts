//import { Embeddings } from '@langchain/core/embeddings'
import { INode, INodeData, INodeOutputsValue, INodeParams, IndexingResult } from '../../../src/Interface'
import {  AzureAISearchVectorStore,  AzureAISearchQueryType } from "@langchain/community/vectorstores/azure_aisearch"
import { OpenAIEmbeddings } from "@langchain/openai"
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { Embeddings } from '@langchain/core/embeddings'

class AzureAISearch_VectorStores implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    badge: string
    baseClasses: string[]
    //credential: INodeParams
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = 'Azure AI Search Index'
        this.name = 'AzureAISearch'
        this.version = 1.0
        this.type = 'AzureAISearch'
        this.icon = 'Azure.svg'
        this.category = 'Vector Stores'
        this.description = 'Search in pre-built Azure AI Search Index '
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        //console.log('LMNO');
        //this.credential = {
        //    label: 'Azure AI Search Key',
        //    name: 'credential',
        //    type: 'credential',
        //    credentialNames: ['openAIApi']
        //}
        //console.log('ABCD');
        this.inputs = [
            
            {
                label: 'Azure AI Search Endpoint',
                name: 'AzureAISearchEndpoint',
                type: 'string'
            },
            {
                label: 'Azure AI Search Index Name',
                name: 'index_name',
                type: 'string'
            },
            {
                label: 'Azure AI Search Key',
                name: 'azure_ais_key',
                type: 'string'
            },
            //{
            //    label: 'OpenAI API Key for Embedding',
            //    name: 'openai_key',
            //    type: 'string'
            //},
            {
                label: 'Embeddings',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'top_k',
                name: 'topk',
                description: 'Number of top results to fetch. Default to 4',
                placeholder: '4',
                type: 'number',
                additionalParams: true,
                optional: true
            },
        ]
        //console.log('HIJ');
        this.outputs = [
            {
                label: 'Azure AI Search Retriever',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Azure AI Search Vector Store',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(AzureAISearchVectorStore)]
            }
        ]
        //console.log('EFG');
    }

    //@ts-ignore

    async init(nodeData: INodeData, options: ICommonObject): Promise<any> {
        //const embeddings = nodeData.inputs?.embeddings as Embeddings
        //console.log('XYZ');
        const endpoint = nodeData.inputs?.AzureAISearchEndpoint as string
        const azure_ais_key = nodeData.inputs?.azure_ais_key as string
        //const openai_key = nodeData.inputs?.openai_key as string
        //console.log('123');
        const embedding = nodeData.inputs?.embeddings as Embeddings
        //console.log('456');
        const index_name = nodeData.inputs?.index_name as string
        const topk = nodeData.inputs?.topk as string
        const k = topk ? parseFloat(topk) : 4
        const output = nodeData.outputs?.output as string
        //console.log('789');
        //const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        //const openai_key = getCredentialParam('openAIApiKey', credentialData, nodeData)
        //console.log("*************************");
        //console.log(nodeData.credential);
        //console.log("*************************");
        //console.log(nodeData.credential);
        //console.log("***************************");
        //console.log(options);
        //const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        //console.log('0001');
        //const azure_ais_key = getCredentialParam('openAIApi', credentialData, nodeData)
        //console.log('0002');
        //console.log(openai_key);
        //console.log(endpoint);
        //console.log(index_name);
        //console.log(azure_ais_key);
        //console.log(embedding);

        try {
            process.env.AZURE_AISEARCH_ENDPOINT = endpoint //"";
            process.env.AZURE_AISEARCH_KEY = azure_ais_key //"";
            //process.env.OPENAI_API_KEY = openai_key //"";
            const config = {
                //endpoint:"",
                indexName:index_name,
                //key:"",
                search: {
                    type: AzureAISearchQueryType.SimilarityHybrid
                }
            }
            const vectorStore = new AzureAISearchVectorStore(embedding, config);
    
            if (output === 'retriever') {
                const retriever = vectorStore.asRetriever(k)
                return retriever
            } else if (output === 'vectorStore') {
                ;(vectorStore as any).k = k
                return vectorStore
            }
            return vectorStore
        } catch (error) {
            console.error("Error performing similarity search:", error);
        } 
        
    }
}

module.exports = { nodeClass: AzureAISearch_VectorStores }
