const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const PlayerInfo = require("../models/player.js");
const OfferInfo = require("../models/gameOffer.js");
const {body,validationResult} = require("express-validator");


router.post("/register",body('player_id').notEmpty(),
body('password').isLength({min:8,max:15}), async (req,res)=>{

    const registeredForm = {
        player_id : req.body.player_Id,
        age : req.body.age,
        country : req.body.country, 
        installed_days : req.body.installed_days, 
        coins : req.body.coins, 
        gems : req.body.gems, 
        game_level : req.body.game_level, 
        purchaser : req.body.purchaser,
    }
    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status : "failed",
            message : error.array()
        })
    }else{
        const userInfo = await PlayerInfo.findOne({player_id : {$eq : req.body.player_id}});
        if(userInfo){
            res.status(400).json({
                status : "failed",
                message : "Is user id have been taken try new one"
            })
        }else{
            bcrypt.hash(req.body.password,10,async (err,hash)=>{
                if(err){
                    res.status(400).json({
                        status : "failed",
                        message : err
                    })
                }else{
                    registeredForm.password = hash;
                    const newPlayer = await PlayerInfo.create(registeredForm);
                    res.status(200).json({
                        status: "success",
                        message : "Successfully registered"
                    })
                }
            })
        }
    }
})

router.post("/login",body('player_id').notEmpty(),
body('password').isLength({min:8,max:15}), async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status : 'failed',
            message : error.array()
        })
    }else{
        const userInfo = await PlayerInfo.findOne({player_id : {$eq : req.body.player_id}});
        bcrypt.compare(req.body.password, userInfo.password ,(err,result)=>{
            if(err){
                res.status(400).json({
                    status : "failed",
                    message : err
                })
            }else if(result){
                res.status(200).json({
                    status : "success",
                    message : "successfully logged in"
                })
            }else{
                res.status(400).json({
                    status : "failed",
                    message : "user name and password incorrect"
                })
            }
        })
    }
}) 

router.get('/offer',async(req,res)=>{
    let {page,records=10,attribute,query}=req.query;
    if(attribute==''||attribute==undefined||query==''||query==undefined){
        res.status(400).json({
            status : "failed",
            message : "invalid input"
        })
    }else{
        const cursor = await OfferInfo.find();
        let value = [];
        let start = page==1?0:records*(page-1);
        let end = records*page;
        cursor.forEach((el)=>{
            let set = new Set(el[attribute].split(' '));
            if(set.has(query)){
                value.push(el);
            }
        })
        let final = value.splice(start,end);
        let has_more = end<value.length?true:false;
        res.status(200).json({
            page : page,
            has_more : has_more,
            offer : final
        })
    }

})

router.post('/offer',body('offer_id').notEmpty(),
            body("offer_title").notEmpty(),
            body('offer_description').notEmpty(),
            body("offer_image").notEmpty(),async (req,res)=>{
            const error = validationResult(req);
            if(!error.isEmpty()){
                res.status(400).json({
                    status:"failed",
                    message: error.array()
                })
            }else{
                const exist = await OfferInfo.findOne({offer_id:{$eq : req.body.offer_id}});
                if(exist){
                    res.status(400).json({
                        status:"failed",
                        message : "this info already exists in the database"
                    })
                }else{
                    const newOffer = await OfferInfo.create({
                            offer_id : req.body.offer_id, 
                            offer_title : req.body.offer_title, 
                            offer_description : req.body.offer_description, 
                            offer_image : req.body.offer_image, 
                            offer_sort_order : req.body.offer_sort_order, 
                            content : req.body.content, 
                            schedule : req.body.schedule, 
                            target : req.body.target, 
                            pricing : req.body.pricing
                    })
                    res.status(200).json({
                        status : "success",
                        message : "new offer successfully created"
                    })
                }
            }
})

router.put('/offer/:offer_id',async (req,res)=>{
    const update = await OfferInfo.findOne({offer_id : {$eq : req.params.offer_id}});
    if(update){
        if(Object.keys(req.body)){
            let newData = {...update,...req.body}
            await OfferInfo.findOneAndUpdate({offer_id : {$eq : req.params.offer_id}},newData,(err,docs)=>{
                if(err){
                    res.status(400).json({
                        status : "failed",
                        message : err
                    })
                }else{
                    res.status(200).json({
                        status : "success",
                        data : docs
                    })
                }
            })
        }else{
            res.status(400).json({
                status : "failed",
                message  : 'no data to update'
            })
        }
    }else{
        res.status(400).json({
            status : "failed",
            message :"invalid offer id"
        })
    }

})

router.delete('/offer/:offer_id', async (req,res)=>{
    let data = await OfferInfo.findOneAndDelete({offer_id : {$eq : req.params.offer_id}})
    res.status(200).json({
        status : "success",
        message : "successfully deleted"
    })
})

module.exports = router;