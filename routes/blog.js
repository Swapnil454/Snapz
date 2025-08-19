const {Router} = require("express")
const multer = require("multer")
const path = require("path")
const Blog = require('../models/blog');
const Comment = require('../models/comment')
const { requireAuth } = require("../middlewares/authenticcation")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads'));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename);
  },
});

const upload = multer({ storage: storage })


const router = Router();
router.get("/add-new",requireAuth, (req, res) => {
    return res.render("addBlog",{
        user: req.user,
    })
})

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id}).populate("createdBy");

    return res.render('blog', {
        user: req.user,
        blog,
        comments,
    })
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/", upload.single('coverImage'), async (req, res) => {
   const { title, body} = req.body
   const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`
   })

    return res.redirect(`/blog/${blog._id}`)
});

router.post("/:id/delete", async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).send("Blog not found");
    }

    if (blog.createdBy.toString() !== req.user._id) {
        return res.status(403).send("Unauthorized: You cannot delete this post");
    }

    const fs = require("fs");
    const imagePath = path.resolve(__dirname, "../public", blog.coverImageURL);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }

    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect("/");
});

module.exports = router;