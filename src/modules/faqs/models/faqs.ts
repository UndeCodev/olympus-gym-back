import { PrismaClient } from "@prisma/client";
import { Faqs } from "../common/interfaces/Faqs";
import { AppError } from "../../../exceptions/AppError";
import { HttpCode } from "../../../common/enums/HttpCode";


const prisma = new PrismaClient()

export const getAllFaqs = async (): Promise <Faqs[] | AppError> => {
    const faqs = await prisma.faqs.findMany()
    if(faqs.length === 0 || faqs === null){
        throw new AppError({
            name: 'GetAllFaqsError',
            httpCode: HttpCode.BAD_REQUEST,
            description: `No FAQs in database`
        })
    }
    return faqs
}

export const getFaqsInRange = async (start: number, end: number): Promise <Faqs[] | AppError> => {
    const skip = start-1
    const take = end - start + 1

    const faqs = await prisma.faqs.findMany({
        skip: skip,
        take: take
    })
    
    if(faqs.length === 0 || !faqs){
        throw new AppError({
            name: 'GetFaqsInRangeError',
            httpCode: HttpCode.BAD_REQUEST,
            description: `No FAQs found in range: ${start} - ${end}`
        })
    }
    return faqs
}

export const createFaq = async (input: Faqs): Promise <Faqs> => {
    const {question, answer} = input

    const faqCreated = await prisma.faqs.create({
        data:{
            question,
            answer
        }
    })
    if(!faqCreated){
        throw new AppError({
            name: 'ErrorFaqCreated',
            httpCode: HttpCode.BAD_REQUEST,
            description: 'Error during create faq'
        })
    }
    return faqCreated
}

export const updateFaq = async (id: number, data: { question: string; answer: string; updatedAt: Date}): Promise <Faqs | AppError> => {
    const faqUpdate = await prisma.faqs.update({
        where: {id},
        data
    })
    
    if(!faqUpdate){
        throw new AppError({
            name: 'ErrorFaqUpdate',
            httpCode: HttpCode.BAD_REQUEST,
            description: `Error during faq by id: ${id} updated`
        })
    }
    return faqUpdate
}

export const findFaqById = async (id: number): Promise <Faqs | null> => {
    const resultFindByIdInDatabase = await prisma.faqs.findUnique({
        where: {id}
    })        
    return resultFindByIdInDatabase
}