const { name } = require('ejs')
const express = require('express')
const {MongoClient} =require('mongodb')
const {ObjectId}=require("mongodb")
const multer  = require('multer')
const path =require("path")
const fs=require("fs")

const app=express()


app.use(express.json())
app.use(express.static(__dirname+"/colorlib-regform-3"))
app.use(express.urlencoded({extended:false}))


let arr=[];
let db;
let index;
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null,"./photos"); },
    filename:(req,file,cb)=>{
        const fname=`${Math.round(Math.random() * 1E4)}_${file.originalname}`;
         return cb(null,fname);}
});
let upload =multer({storage:storage})




function event_list(db){
db.collection('Events')
.find({index:{$gt:0}},{name:1})
.forEach((eve)=>{
        let e={
            name:eve.name,
            _id:eve._id
        }
        arr.push(e);
})
}



fs.readFile("./colorlib-regform-3/views/index_new.html","utf-8",(err,res)=>{
    if(err)
      {  console.log(err);}

    index=res;
})



// app.set('view engine','ejs')

// Connection to MogoDB cluster/database
// MongoClient.connect("mongodb+srv://devenprasad10103:IvQbtxCgqZm8yurr@cluster0.wkktl15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//
MongoClient.connect("mongodb://localhost:27017/Portfolio").then(
    (client)=>{
        console.log("Connected to Database.");
        db=client.db();
        event_list(db);
    }).catch((error)=>{
        console.log(error);
    })


 

//Switching on the server
 app.listen(5000,()=>{
        console.log("Listening on port 3000");
    })


   


//Routing for books

app.get('/',(req,res)=>{
    let books=[];

    db.collection('Events')
    .find()
    .sort({event:1})
    .forEach((doc)=>{books.push(doc)})
    .then(()=>{
      
        res.status(200).json(books)
    })
    .catch((err)=>{
        res.status(500).json({error:"Blue tick no reply."})
    })
    // res.json({mesg:"Welcome to MongoDB books,"})
})



app.get('/upload',(req,res)=>{
    event_list(db);
                let thtml=arr.map((option)=>{ 
                return (`<option value="${option.name}">${option.name}</option> \n`)});
            op= (thtml.join(" "));
            new_index=index.replace("%options%",op);
            fs.writeFileSync("./colorlib-regform-3/views/indexx.html",new_index);
            res.status(200).sendFile(__dirname+'/colorlib-regform-3/views/indexx.html');

                    })



//posting documents

app.post('/upload7053',upload.array("file"),(req,res)=>{ 
   let pictures=[];
  
   req.files.forEach((f,i)=>{

    let data={
        orientation:req.body.orientation,
        event:req.body.event,
        name:req.body.name,
        filename:f.filename
     };
    arr.forEach((eve)=>{
        if(eve.name==req.body.event){
            data.event_id=eve._id;
        }
    })
   pictures.push(data);
   }) ;

    db.collection('Photos')
    .insertMany(pictures)
    .then((result)=>{
        console.log(result);
    })
   

   console.log(pictures);

    res.redirect('/upload');
})

app.post('/upload7054',(req,res)=>{
    const data=req.body;
    data.type="Short";

    db.collection('Events')
    .updateOne({index:0},{$inc:{current_index:1}})
    .then(()=>{
    db.collection('Events')
    .findOne({index:0})
    .then((doc)=>{
        data.index=doc.current_index; 
    }).then(()=>{


        db.collection('Events')
        .insertOne({...data})
        .then((result)=>{
            console.log("Entry Succesful");
            console.log(result);
            res.redirect('/upload');
        }).catch((err)=>{console.log(err);})
    })
})
})





//delteing documents

app.delete('/reset',(req,res)=>{
    db.collection('events')
    .deleteMany()
    .then((reslt)=>{
        res.json(reslt);
    })
})




//Updating documents



function fetch_events(){
    fetch('http://localhost:3000/event-list')
    .then((e)=>{
       return e.json();
    }).then((e)=>{
        
        let thtml=e.map((option)=>{ 
            return `<option value="${option}">${option}</option>`;
        });
       console.log(thtml);
    })

    }
