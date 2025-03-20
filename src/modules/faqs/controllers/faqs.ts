import { NextFunction, Request, Response } from "express"
import { HttpCode } from "../../../common/enums/HttpCode";
import * as FaqsModel from '../models/faqs'
import { validateFaqSchema, validateRangeInFaqs } from "../schemas/Faqs";

export const getAllFaqs = async (_req: Request, res: Response, next: NextFunction): Promise <void>=>{
    try {
        const faqs = await FaqsModel.getAllFaqs()
        res.json({
            faqs: faqs
        })
    } catch (error) {
        next(error)
    }
}

export const getFaqsInRange = async (req: Request, res: Response, next: NextFunction): Promise <void> =>{
    try {
        const resultValidationInputData = validateRangeInFaqs(req.body)
        if(!resultValidationInputData.success){
            res.status(HttpCode.BAD_REQUEST).json({
                message: "Value end must be greater than or equal to start",
                errors: resultValidationInputData.error
            })
            return
        }
        
        const {start, end} = resultValidationInputData.data
        const maxRange = end - start
        if(maxRange>5){
            res.status(HttpCode.BAD_REQUEST).json({
                message: 'The range for listing FAQs should be a minimum of 1 and a maximum of 5.'
            })
            return
        }

        const resultGetFaqsInRange = await FaqsModel.getFaqsInRange(start, end)
        res.status(HttpCode.OK).json({
            faqs: resultGetFaqsInRange
        })
    } catch (error) {
        next(error)
    }
}

export const createFaq = async (req: Request, res: Response, next: NextFunction): Promise <void> =>{
    try {
        const resultValidationInputData = validateFaqSchema(req.body)

        if(!resultValidationInputData.success) {
            res.status(HttpCode.BAD_REQUEST).json({
                message: 'Validation FAQ error.',
                errors: resultValidationInputData.error
            })
            return
        }

        await FaqsModel.createFaq(resultValidationInputData.data)
        res.status(HttpCode.CREATED).json({
            message: 'Faq created sucessfully'
        })
        return
    } catch (error) {
        next(error)
    }
}

export const updateFaq = async (req: Request, res: Response, next: NextFunction): Promise <void> =>{
    try {
        //validate input data
        const resultValidationInputData = validateFaqSchema(req.body)

        if(!resultValidationInputData.success){
            res.status(HttpCode.BAD_REQUEST).json({
                message: 'Error Validation Input Data',
                errors: resultValidationInputData.error.format()
            })
            return
        }

        //get and validate id input
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            res.status(HttpCode.BAD_REQUEST).json({
                message: 'Invalid ID'
            })
            return
        }

        //validate id existing in database
        const idFaqExistsInDatabase = await FaqsModel.findFaqById(id)
        if (!idFaqExistsInDatabase) {
            res.status(HttpCode.BAD_REQUEST).json({
                message: `Faq by id: ${id} not found in database`
            })
            return
        }

        const updatedDataFaq = {
            question: resultValidationInputData.data.question,
            answer: resultValidationInputData.data.answer,
            updatedAt: new Date()
        }

        await FaqsModel.updateFaq(id, updatedDataFaq)
        res.status(HttpCode.OK).json({
            message: 'Faq correctly updated'
        })
        return
    } catch (error) {
        next(error)
    }
}