import express from "express";

const router = express.Router();

// create a payment intent
router.post('/payment', (req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
})
export default router;
