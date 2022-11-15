const express = require("express");
const multer = require("multer");
const router = express.Router();
const orders = require("../model/order");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const dotenv = require("dotenv").config();
const users = require("../model/users");
const product = require("../model/product");

//order create
//find user
//push order in []orders (waiting)
//check in cart if true remove product from cart
//set product status ordered

///////////////////in admin dashboard///////////
//if order accepted
// set order status on the way,etc
// if order canceled remove it from

router.post("/createBuyingOrder", async (req, res) => {
  console.log(req.body);
  let addressto = {
    blockNumber: Number(req.body.addresstoBlockNumber),
    st: req.body.addresstoSt,
    area: req.body.addresstoArea,
    city: req.body.addresstoCity,
  };
  let addressfrom = await users.findOne(
    { _id: req.body.sellerId },
    { address: 1, _id: 0 }
  );

  var body = {
    buyerId: req.body.buyerId,
    sellerId: req.body.sellerId,
    productId: req.body.productId,
    productPrice: Number(req.body.productPrice),
    profit: Number(req.body.profit),
    shipping: Number(req.body.shipping),
    addressfrom: addressfrom,
    addressto: addressto,
    paymentmethod: req.body.paymentmethod
  };
  console.log(addressfrom.address);
  orders.create(body, async (err, data) => {
    if (err) {
      console.log(err);
      res.send("failed");
    } else {
      let buyer = await users.findOne({ _id: body.buyerId });
      buyer.orders.push(data._id);
          const index = buyer.cart.indexOf(body.productId);
          if (index > -1) buyer.cart.splice(index, 1);
          buyer.save();
      
      product
        .updateOne({ _id: body.productId }, { $set: { status: "ordered" } })
        .then((_) => {
          console.log("success");
          res.send("success");
        })
        .catch((_) => {
          console.log("failed to update product status");
          res.send("failed");
        });
    }
  });
  // await orders.create(req.body, (error, data) => {
  //   if (error) {
  //     console.log(error);
  //     res.send("Failed");
  //   } else {
  //     users.findOne({ _id: req.params.id }, {}).then((dta, err) => {
  //       dta.orders.push(data._id);
  //       dta.cart.splice(0, dta.cart.length);
  //       dta.save();
  //     });
  //     Promise.all(
  //       data.sellerId.map((cust, index) => {
  //         users.findOne({ _id: cust }, {}).then((dta, err) => {
  //           for (let i = 0; i < data.cart.length; i++) {
  //             if (dta.ads.includes(data.cart[i])) {
  //               dta.ads.remove(data.cart[i]);
  //               dta.save();
  //             }
  //           }
  //         });
  //       })
  //     );
  //     Promise.all(
  //       data.cart.map((item, index) => {
  //         product.deleteOne({ _id: item }).then((dt, er) => {
  //           console.log(dt);
  //         });
  //       })
  //     );
  //     res.send("Success");
  //   }
  // });
});

// router.post("/createorder/:id", async (req, res) => {
//   await orders.create(req.body, (error, data) => {
//     if (error) {
//       console.log(error);
//       res.send("Failed");
//     } else {
//       users.findOne({ _id: req.params.id }, {}).then((dta, err) => {
//         dta.orders.push(data._id);
//         dta.cart.splice(0, dta.cart.length);
//         dta.save();
//       });
//       Promise.all(
//         data.sellerId.map((cust, index) => {
//           users.findOne({ _id: cust }, {}).then((dta, err) => {
//             for (let i = 0; i < data.cart.length; i++) {
//               if (dta.ads.includes(data.cart[i])) {
//                 dta.ads.remove(data.cart[i]);
//                 dta.save();
//               }
//             }
//           });
//         })
//       );
//       Promise.all(
//         data.cart.map((item, index) => {
//           product.deleteOne({ _id: item }).then((dt, er) => {
//             console.log(dt);
//           });
//         })
//       );
//       res.send("Success");
//     }
//   });
// });

// router.post("/exchangecreateorder/:fid/:sid", async (req, res) => {
//   await exchangeorders.create(req.body, (error, data) => {
//     if (error) {
//       console.log(error);
//       res.send("Failed");
//     } else {
//       users.findOne({ _id: req.params.fid }, {}).then((dta, err) => {
//         dta.orders.push(data._id);
//         dta.ads.remove(data.firstProductId);
//         dta.save();
//       });
//       users.findOne({ _id: req.params.sid }, {}).then((dta, err) => {
//         dta.orders.push(data._id);
//         dta.ads.remove(data.secondProductId);
//         dta.save();
//       });
//       // product.findOne({"_id":data.firstProductId},{}).then((dta,err)=>{
//       //     dta.offers.splice(0,dta.offers.length)
//       //     dta.save()
//       // })
//       product.deleteOne({ _id: data.firstProductId }).then((dt, er) => {
//         console.log(dt);
//       });
//       product.deleteOne({ _id: data.secondProductId }).then((dt, er) => {
//         console.log(dt);
//       });
//       res.send("Success");
//     }
//   });
// });

module.exports = router;
