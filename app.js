const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

async function main() {

    // Change using a private file including the enviroment variables
    url = "mongodb://127.0.0.1:27017/blogDB"
    await mongoose.connect(url)
    console.log("Connected to the database")

    // Schema
    const postSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        }
    })

    // Model
    const Post = mongoose.model("Post", postSchema)

    // Get requests
    app.get("/", async (req, res) => {
        // get posts from the database
        const posts = await Post.find({}).exec()
        // Extrapolate the id => JSON.stringify(posts[0]._id)
        res.render("home", {content: homeStartingContent, posts: posts})
    })

    app.get("/about", (req, res) => {
        res.render("about", {content: aboutContent})
    })

    app.get("/contact", (req, res) => {
        res.render("contact", {content: contactContent})
    })

    app.get("/compose", (req, res) => {
        res.render("compose")
    })

    app.get("/posts/:postId", async (req, res) => {
        const postId = req.params.postId
        const posts = await Post.find({})
        posts.forEach((post) => {
            if (postId === JSON.stringify(post._id)) {
                res.render("post", {postTitle: post.title, postBlog: post.content})
            }
        })
    })

    // Post requests
    app.post("/compose", (req, res) => {
        const post = new Post({
            title: req.body.postTitle,
            content: req.body.postBody
        })

        post.save()
        res.redirect("/")
    })



    // Server listen
    app.listen(3000, function() {
    console.log("Server started on port 3000");
    });
}

main()
.catch((err) => console.log("Error occured: " + err))