const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const product = require("../model/product");
const users = require("../model/users");
const category = require("../model/category");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});
const multi_upload = multer({
  storage: storage,
  // fileFilter: (req, file, cb) => {
  //   if (
  //     file.mimetype == "image/png" ||
  //     file.mimetype == "image/jpg" ||
  //     file.mimetype == "image/jpeg"
  //   ) {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //     const err = new Error("Only .png, .jpg and .jpeg format allowed!");
  //     err.name = "ExtensionError";
  //     return cb(err);
  //   }
  // },
});

router.post(
  "/addFromMob/:userId",
  multi_upload.array("img", 10),
  function (req, res) {
    // let imgarry = [];
    console.log("ana wslt");
    console.log(req.files);
    // for (const a of req.body.img) {
    //   console.log(a);
    // }
    // req.body.img = imgarry;
    // req.body.userId = req.params.userId;
    // product.create(req.body, function (err, data) {
    //   if (err) {
    //     console.log(err);
    //     res.end();
    //   } else {
    //     users
    //       .updateOne({ _id: req.params.userId }, { $push: { ads: data._id } })
    //       .then((response) => res.send("success"))
    //       .catch((err) => res.send("failed"));
    //     // console.log(data._id);
    //   }
    // });
  }
);

router.post("/add/:userId", multi_upload.array("img", 10), function (req, res) {
  let imgarry = [];
  for (const a of req.files) {
    imgarry.push(a.path);
  }
  console.log(req.files);
  // console.log(imgarry);
  // req.body.img = imgarry;
  // req.body.userId = req.params.userId;
  // product.create(req.body, function (err, data) {
  //   if (err) {
  //     console.log(err);
  //     res.end();
  //   } else {
  //     users
  //       .updateOne({ _id: req.params.userId }, { $push: { ads: data._id } })
  //       .then((response) => res.send("success"))
  //       .catch((err) => res.send("failed"));
  //     // console.log(data._id);
  //   }
  // });
});

router.get("/getProduct/:productId", function (req, res) {
  let productData;
  product
    .findOne({ _id: req.params.productId })
    .then((data) => {
      productData = data;
      category
        .findOne(
          { _id: data.categoryId },
          {
            _id: 0,
            "firstFilter.title": 1,
            "secondFilter.title": 1,
            "thirdFilter.title": 1,
          }
        )
        .then((data) => {
          res.send({ data: productData, category: data });
        })
        .catch((err) => res.send(err));
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/categories/:categoryId", async (req, res) => {
  try{
      let categories = await category.findOne({"_id":req.params.categoryId});
        // console.log(categories);
      res.send(categories);
  }catch (err) {
      res.send(err);
  }
});

router.get("/categories", async (req, res) => {
  try {
      let categories = await category.find({});
      res.send(categories);
  } catch (err) {
      res.send(err);
  }
});

router.get("/offers/:id", async (req, res) => {
  let prodList = [];
  product
    .findById(req.params.id)
    .then(async (prod) => {
      for (let i = 0; i < prod.offers.length; i++) {
        let p = await product.findOne({ _id: prod.offers[i] });
        prodList.push(p);
      }
      res.send(prodList);
    })
    .catch((err) => console.log("failed"));
});

router.get("/ads/:id", async (req, res) => {
  let prodList = [];
  users
    .findById(req.params.id)
    .then(async (user) => {
      for (let i = 0; i < user.ads.length; i++) {
        let p = await product.findOne({ _id: user.ads[i] });
        prodList.push(p);
      }
      res.send(prodList);
    })
    .catch((err) => console.log("failed"));
});

router.get("/products", function (req, res) {
  product.find({status:"active"}).then((data, err) => {
    if (err) res.send("failed");
    else res.send(data);
  });
});

module.exports = router;
