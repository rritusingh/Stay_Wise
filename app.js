require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Listing = require("./models/listings.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");

const dbURL = process.env.ATLASDB_URL;
main()
.then(() => {
    console.log("database connection successful ")
})
.catch(err => console.log(err));

async function main() {
  //await mongoose.connect('mongodb://127.0.0.1:27017/TravelNStay');
  await mongoose.connect(dbURL);

};

app.listen(8080, () =>{
    console.log("server is listening at port 8080");
});

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing = (req, res, next) =>{
    // let {error} = listingSchema.validate(req.body);
    
    // if(error){
    //     let errMsg = error.details.map((el) => el.message).join(",");
    //     throw new ExpressError(400, errMsg);
    // }else{
        next();
    // }
}

//index
app.get("/listings", wrapAsync (async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/show.ejs", {allListing});
}));

//new
app.get("/listings/new",(req,res)=>{
    console.log("The new listing ");
    res.render("./listings/new.ejs");
});

//create 
app.post("/listings/new", validateListing, wrapAsync (async(req,res)=>{
    
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync (async (req,res)=>{
    const {id} = req.params;
    const listingDetails = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listingDetails});
}));

app.delete("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    const listingDetails = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//update
app.put("/listings/:id", validateListing, wrapAsync (async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing!");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//show
app.get("/listings/:id", wrapAsync (async (req,res)=>{
    const {id} = req.params;
    console.log(id);
    const listingDetails = await Listing.findById(id);
    res.render("./listings/details.ejs", {listingDetails});
}));

//middleware
app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
})
// app.get("/testListings",async (req,res)=>{
//    let sampleListing = new Listing({
//     title:"My New Villa",
//     description : "By the beach",
//     location: "Delhi",
//     price: 28000,
//     country: "India"
//    });

//    await sampleListing.save();
//    console.log("The listing was saved!");
//    res.send("Successful!!");

// });
