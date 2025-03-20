import { Router } from 'express'
import * as FaqsController from '../controllers/faqs'

export const faqsRouter = Router()

faqsRouter.get('/', FaqsController.getAllFaqs)
faqsRouter.get('/get-faqs-in-range', FaqsController.getFaqsInRange)
faqsRouter.post('/create-faq', FaqsController.createFaq)
faqsRouter.put('/update-faq/:id', FaqsController.updateFaq)
