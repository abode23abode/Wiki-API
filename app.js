const express=require('express');
const bodyParser=require('body-parser');
const ejs = require('ejs');
const mongoose=require('mongoose');

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});


const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);


///////////////////// request all articles


app.route("/articles")
.get(function(req,res){

    Article.find({},function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    

    });

})
.post(function(req,res){

    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(){
        if(!err){
            res.send("successfully added a new article")
        }else{
            res.send(err)
        }
    });
})
.delete(function(req,res){

    Article.deleteMany({},function(err){
        if(!err){
            res.send("seccessfully deleted all articles")
        }else{
            res.send(err)
        }
    });
});


///////////////////// request one articles


app.route("/articles/:articleTitle")

.get(function(req,res){

   Article.findOne({title:req.params.articleTitle},function(err,foundArticle){

     if(foundArticle){
        res.send(foundArticle)
     }else{
        res.send("article not found :(")
     }

   });


})
.put(function(req,res){

    
    Article.updateOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},function(err){
        if(!err){
            res.send("successfully updated");
        }
    });
    
})

.patch(function(req,res){

    Article.updateOne({title:req.params.articleTitle},{$set:req.body},function(err){
        if(!err){
            res.send("successfully updated article");
        }
    });

})

.delete(function(req,res){

    Article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err){
            res.send("successfully deleted article");
        }
    });

});




app.listen(3000,function(){
    console.log("Server is running on port 3000 !")
})