//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


// Schema created here

const itemsSchema = new mongoose.Schema({
  name:String,
})

// Model created here

const Item = mongoose.model("Item",itemsSchema);


//creating a default items (document)

const item1 = new Item({
  name:"Welcome to your To-do List!!"
});


const item2 = new Item({
  name:"Hit the + button to off a new item."
})



const item3 = new Item({
  name:"<-- Hit this to delete an item."
})


const defaultItems = [item1,item2,item3];

//inserting into the mongodb using insertmany query
// Item.insertMany(ṭ)
// Item.insertMany(defaultItems);

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", async function(req, res) {

  // var foundItem = Item.find({});

 var item = await Item.find({});

 if(item.length === 0){
 Item.insertMany(defaultItems)

res.redirect("/");
 }else{
  res.render("list", {listTitle: "Today", newListItems: item});
 }
 
});


// creating a schema 

const listSchema ={
  name: String,
  items: [itemsSchema]

}


//creating a model

const List = mongoose.model("List",listSchema);


// creating a dynamic route 
app.get("/:customlist",function(req,res){
  const customname = req.params.customlist;

  const list = new List({
    name:customname,
    items:defaultItems
  })

  list.save();


});






app.post("/", function(req, res){

  const Itemname = req.body.newItem;

  //model is created here 
  const itemaa = new Item({
    name: Itemname,
  })

  itemaa.save();   // these will save the data to the database in the localhost mongodb.
  res.redirect("/");


});


app.post("/delete",async function(req,res){
  const checkedID =req.body.checkbox;

// console.log(checkedID);

try {
  // Use findByIdAndRemove to delete the document by its ID
  await Item.findByIdAndRemove(checkedID);
  console.log(checkedID + " is deleted");
  res.redirect("/");
} catch (err) {
  console.error(err);
  res.status(500).send("Error deleting item.");
}
  });


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
