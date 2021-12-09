const express=require('express')
const bodyParser=require('body-parser')
const mongoose =require('mongoose')
const date=require(__dirname+'/date.js')
const app=express();
const _=require('lodash')

app.use(express.static('public'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))


//connect to mongodb
mongoose.connect('<enter mongodb atlas url>',{useNewUrlParser:true});

//create a new items scheme
const itemsSchema={
    name: String
};

//create a new mongoose model
const Item= mongoose.model(
    'Item',
    itemsSchema
)

//creating a new mongoose document
const item1=new Item({
    name:'Welcome to your To Do list!'
})  

const item2= new Item({
    name: 'Hit the + button to add a new item.'
})

const item3=new Item({
    name: '<--Hit this button to check off an item.'
})

const defaultItems=[item1,item2,item3];

//new schema
const listSchema={
    name: String,
    items: [itemsSchema]
}

const List=mongoose.model('List',listSchema)

app.get('/',function(req, res) {
       
        //to find items
        Item.find({},function(err,foundItems){
            if(foundItems.length==0){
                Item.insertMany(defaultItems,function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('success')
                    }
                });
                res.redirect('/')
            }
            else{
                res.render('list', { listTitle:'Today',newListItems:foundItems })

            }
        });

    });


//get request to custom lists
app.get('/:customListName',function(req,res){
    const customListName=_.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list=new List({
                    name:customListName,
                    items:defaultItems
                })
                list.save();
                res.redirect('/'+customListName)
            }
            else{
                //show an existing list
                res.render('list',{listTitle:foundList.name,newListItems:foundList.items})
            }
        }
    })
   
    

})

//post route to home page
app.post('/',function(req,res){
    const itemName=req.body.item;
    const listName=req.body.list;
    
    const item=new Item({
        name:itemName
    })

    if(listName=='Today'){
        item.save();
        res.redirect('/')
    }
    else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(item)
            foundList.save();
            res.redirect('/'+listName)
        })
    }   
})




//post route to delete items
app.post('/delete',function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;
    
    if(listName=='Today'){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log('sucessfully deleted item')
                res.redirect('/')
        
                    }
            })
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect('/'+listName);
            }
        })
    }
 

})

//this is the get method of the about page 
app.get('/about',function(req,res){
    res.render('about')
})

let port=process.env.PORT;
if(port==null||port==''){
    port=3000
}
app.listen(port,function(){
    console.log('server is running on port 3000')
})

