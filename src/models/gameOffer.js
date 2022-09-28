const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Offers = new Schema({
    offer_id : String, 
    offer_title : String, 
    offer_description : String, 
    offer_image : String, 
    offer_sort_order : Number, 
    content : Array, 
    schedule : Object, 
    target : String, 
    pricing : Array
})

const OfferInfo = mongoose.model('Offers',Offers);

module.exports = OfferInfo;