const express = require("express");
const app = express();
const cors = require('cors')
require("./db/connect");
const Transaction = require("./models/sample");

app.use(express.json());
app.use(cors());


app.get("/", async (req, res) => {
  const data = await Transaction.find();
  res.send(data);
});

// app.get("/all_trans/:skip", async (req, res) => {
//   const { title, desc, price } = req.query;
//   const query = {};
//   const { skip } = req.params;
//   console.log(skip);

//   if (title) {
//     query.title = { $regex: title, $options: "i" };
//   }
//   if (desc) {
//     query.description = { $regex: desc, $options: "i" };
//   }
//   if (price) {
//     query.price = price;
//   }

//   console.log(query);
//   const data = await Transaction.find(query).limit(10)

//   res.json({
//     success:true,
//     // count :
//     data: data,
//   });
// });

// app.get("/ass", async (req, res) => {
//   let { price } = req.query;
//   console.log(typeof price);
//   let data = await Transaction.find({ price: price });
//   res.send(data);
// });

// app.get("/all_trans", async (req, res) => {
//     const { search, page , perPage  } = req.query;
//     const query = {};

//     // Search criteria
//     if (search) {
//         query.$or = [
//           { title: { $regex: search, $options: "i" } },
//           { description: { $regex: search, $options: "i" } }
//         ];

//         // Check if the search input is a valid number
//         if (!isNaN(parseFloat(search))) {
//           query.$or.push({ price: parseFloat(search) });
//         }
//       }

//     // Pagination parameters
//     const skipValue = (page - 1) * perPage;

//     const data = await Transaction.find(query).skip(parseInt(skipValue)).limit(perPage)
//     const totaldoc = await Transaction.find(query).skip(parseInt(skipValue)).limit(perPage).countDocuments();

//     res.json({
//       success: true,
//       total: totaldoc,
//       data: data,
//     });
//   });

app.get("/transactions", async (req, res) => {
  const { search, month, page = 1, perPage = 10 } = req.query;
  const query = {};

  // Search criteria
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];

    // Check if the search input is a valid number for price
    if (!isNaN(parseFloat(search))) {
      query.$or.push({ price: parseFloat(search) });
    }
  }

  // Pagination parameters
  const skipValue = (page - 1) * perPage;

  try {
    console.log(query);

    // Count total matching documents
    const totalCount = await Transaction.countDocuments(query);

    // Fetch matching documents with pagination
    const data = await Transaction.find(query)
      .skip(parseInt(skipValue))
      .limit(parseInt(perPage));

    res.json({
      success: true,
      total: totalCount,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/ass", async (req, res) => {
  const { search, year, month, page = 1, perPage = 10 } = req.query;
  const query = {};

  // Search criteria
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];

    // Check if the search input is a valid number for price
    if (!isNaN(parseFloat(search))) {
      query.$or.push({ price: parseFloat(search) });
    }
  }

  // Month filtering
  if (month) {
    query.$expr = {
      $and: [
        {
          $eq: [
            { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
            parseInt(month),
          ],
        },
      ],
    };
  }

  // Pagination parameters
  const skipValue = (page - 1) * perPage;

  try {
    console.log(query);

    // Count total matching documents
    const totalCount = await Transaction.countDocuments(query);

    // Fetch matching documents with pagination
    const data = await Transaction.find(query)
      .skip(parseInt(skipValue))
      .limit(parseInt(perPage));

    res.json({
      success: true,
      total: totalCount,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/month", async (req, res) => {
  const { year, month } = req.query;

  try {
    const data = await Transaction.find({
      $expr: {
        $and: [
          {
            $eq: [
              { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
              parseInt(month),
            ],
          },
        ],
      },
    });

    res.json({
      success: true,
      total: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create an API for statistics
// app.get("/for_statistics/:month", async (req, res) => {
//   let { month } = req.params;

//   const data = await Transaction.find({
//     $expr: {
//       $and: [
//         {
//           $eq: [
//             { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
//             parseInt(month),
//           ],
//         },
//       ],
//     },
//   });

//   res.json({
//     totalSale,
//     totalNotsale,
//   });
// });

app.get("/for_statistics/:month", async (req, res) => {
  let { month } = req.params;

  const data = await Transaction.aggregate([
    {
      $project: {
        month: { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
        price: 1,
        sold: 1,
      },
    },
    {
      $match: {
        month: parseInt(month),
      },
    },
    {
      $group: {
        _id: null,
        totalSale: { $sum: { $cond: ["$sold", "$price", 0] } },

        countNotsale: { $sum: { $cond: [{ $not: "$sold" }, 1, 0] } },
        countSale: { $sum: { $cond: ["$sold", 1, 0] } },
      },
    },
  ]);

  if (data.length > 0) {
    res.json({
      totalSale: data[0].totalSale,
      countNotsale: data[0].countNotsale,
      countSale: data[0].countSale,
    });
  } else {
    res.json({
      totalSale: 0,
      countNotsale: 0,
      countSale: 0,
    });
  }
});

// Create an API for bar chart
app.get("/for_bar_chart/:month", async(req, res) => {
    let { month } = req.params;
    
    const data = await Transaction.aggregate([
        {
            $project: {
                month: { $month: { $dateFromString: { dateString: "$dateOfSale" } } },
                price: 1,
                sold: 1
            }
        },
        {
            $match: {
                month: parseInt(month)
            }
        },
        {
            $group: {
              _id:null,
                countPriceRange0To100: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 0] }, { $lte: ["$price", 100] } ] }, 1, 0 ] } },
                countPriceRange101To200: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 101] }, { $lte: ["$price", 200] } ] }, 1, 0 ] } },
                countPriceRange201To300: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 201] }, { $lte: ["$price", 300] } ] }, 1, 0 ] } },
                countPriceRange301To400: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 301] }, { $lte: ["$price", 400] } ] }, 1, 0 ] } },
                countPriceRange401To500: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 401] }, { $lte: ["$price", 500] } ] }, 1, 0 ] } },
                countPriceRange501To600: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 501] }, { $lte: ["$price", 600] } ] }, 1, 0 ] } },
                countPriceRange601To700: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 601] }, { $lte: ["$price", 700] } ] }, 1, 0 ] } },
                countPriceRange701To800: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 701] }, { $lte: ["$price", 800] } ] }, 1, 0 ] } },
                countPriceRange801To900: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 801] }, { $lte: ["$price", 900] } ] }, 1, 0 ] } },
                countPriceRange901To1000: { $sum: { $cond: [ { $and: [ { $gte: ["$price", 901] }, { $lte: ["$price", 1000] } ] }, 1, 0 ] } },



            }
        }
    ]);

        res.json({
            // countPriceRange0To100: data[0].countPriceRange0To100,
            // countPriceRange101To200: data[0].countPriceRange101To200,
            // countPriceRange201To300: data[0].countPriceRange201To300,
            countPriceRange: data


        });
    
});


app.listen(5000, console.log("server started at 5000"));
