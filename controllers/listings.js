const Listing= require("../models/listing");

const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// const mapboxSdk = require("@mapbox/mapbox-sdk");


const mapToken = process.env.MAP_TOKEN;

const geocodingClient =mbxGeocoding({ accessToken: mapToken });

// const geocodingClient = mbxGeocoding(client);



// module.exports.index = async(req, res)=>{
//         const allListings = await Listing.find({});
//         res.render("listings/index", { allListings });
//     };

// module.exports.index = async (req, res) => {
//     let { search, priceRange } = req.query;

//     let query = {};

//     // Search filter
//     if (search) {
//         query.$or = [
//             { location: { $regex: search, $options: "i" } },
//             { title: { $regex: search, $options: "i" } }
//         ];
//     }

//     // Price filter
//     if (priceRange === "1-50000") {
//         query.price = { $gte: 1, $lte: 50000 };
//     } else if (priceRange === "50000+") {
//         query.price = { $gt: 50000 };
//     }

//     const allListings = await Listing.find(query);

//     res.render("listings/index", { allListings });
// };

module.exports.index = async (req, res) => {
    let { search, priceRange, category } = req.query;

    let query = {};

    // Search filter
    if (search) {
        query.$or = [
            { location: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i" } }
        ];
    }

    // Price filter
    if (priceRange === "1-50000") {
        query.price = { $gte: 1, $lte: 50000 };
    } else if (priceRange === "50000+") {
        query.price = { $gt: 50000 };
    }

    // CATEGORY FILTER (ADD THIS)
    if (category) {
        query.category = category;
    }

    const allListings = await Listing.find(query);

    res.render("listings/index", { 
        allListings,
        currentCategory: category || null
    });
};

module.exports.renderNewForm = (req, res) => {
      res.render("listings/new");}


      module.exports.showListing= async (req, res) => {
          let { id } = req.params;
      
          const listing = await Listing.findById(id).populate({path:"reviews",
              populate:{path:"author"},
          }).populate("owner");
      
          if (!listing) {
              req.flash("error", "Listing you requested for does not exist!");
              return res.redirect("/listings");
          }
          // console.log(listing);
        //   res.render("listings/show", { listing });
        res.render("listings/show", { 
  listing,
  showPage: true   // 👈 ADD THIS
});
      };


      module.exports.createListing= async (req, res, next) => {

     let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
     })
     .send();



      let url = req.file.path;
      let filename= req.file.filename;
        //   const newListing = new Listing(req.body.listing);
       const newListing = new Listing({
    ...req.body.listing,
    category: req.body.listing.category.toLowerCase()
});
          newListing.owner= req.user._id;
           newListing.image= {url, filename};
           newListing.geometry = response.body.features[0].geometry;
        let savedListing =  await newListing.save();
        console.log(savedListing);
          req.flash("success", "New Listing created!");
      
          res.redirect(`/listings/${newListing._id}`);
      };
      
  module.exports.renderEditListing= async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
       if (!listing) {
          req.flash("error", "Listing you requested for does not exist!");
          return res.redirect("/listings");
      }
      let originalImageUrl = listing.image.url;
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
      res.render("listings/edit", { listing, originalImageUrl });
  };

      module.exports.updateListing= async (req, res) => {
          let { id } = req.params;
        
        // let listing =   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
);

        if(typeof req.file !== "undefined"){
           let url = req.file.path;
      let filename= req.file.filename;
      listing.image = {url , filename};
      await listing.save();
        }
          req.flash("success", "Listing updated!");
          res.redirect(`/listings/${id}`);
      };

      module.exports.destroyListing = async (req, res) =>{
          let { id } = req.params;
          let deletedListing = await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("success", "Listing Deleted!");
          res.redirect("/listings");
      };