const Post = require('../models/post.model')
const Media = require('../models/media.model')

module.exports = {
  index: (req, res) => {
    return Post.find({}).then((posts) => {
      return res.json({
        success: true,
        action: 'index',
        posts,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'index',
        err,
      })
    })
  },
  indexByType: (req, res) => {
    const { type } = req.body
    return Post.find({ type }).then((posts) => {
      return res.json({
        success: true,
        action: 'index',
        posts,
      })
    })
  },
  getSingle: (req, res) => {
    const postId = req.params.id
    return Post.findById(postId).populate('media')
    .then((post) => {
      if (!post) {
        return Promise.reject({
          status: 404,
          message: 'Post not found',
        })
      }
      return res.json({
        success: true,
        action: 'get',
        post,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message ? err.message : err,
      })
    })
  },
  create: (req, res) => {
    const { title, body, type } = req.body
    if (!title || !title.length) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'No title provided',
      })
    }
    if (!body || !body.length) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'No body provided',
      })
    }
    return Post.create({
      title,
      body,
      type,
    })
    .then((post) => {
      return res.json({
        success: true,
        action: 'create',
        post,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'create',
        err,
      })
    })
  },
  edit: (req, res) => {
    const { id } = req.params
    const { title, body, type } = req.body
    return Post.findById(id)
    .then((post) => {
      if (!post) {
        return Promise.reject({
          status: 404,
          message: 'Post not found, maybe already deleted!',
        })
      }
      if (title) post.title = title
      if (body) post.body = body
      if (type) post.type = type

      return post.save()
    })
    .then((updatedPost) => {
      return res.json({
        success: true,
        action: 'edit',
        post: updatedPost,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'edit',
        message: err.message ? err.message : err,
        err,
      })
    })
  },
  delete: (req, res) => {
    const { id } = req.params
    return Post.findById(id)
    .then((post) => {
      if (!post) {
        return Promise.reject({
          status: 404,
          message: 'Post not found, maybe already deleted!',
        })
      }
      return post.remove()
    })
    .then((removedPost) => {
      return res.json({
        success: true,
        action: 'delete',
        post: removedPost,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'delete',
        message: err.message ? err.message : err,
        err,
      })
    })
  },
  uploadFeatured: (req, res) => {
    const { file } = req
    const { id } = req.params
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      })
    }
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'No Post Id provided',
      })
    }
    const type = 'postFeatured'
    const filename = req.body.filename || req.file.filename
    return Media.create({
      filename,
      type,
    }).then((media) => {
      return Post.findByIdAndUpdate(id, { media: media._id }, { new: true }).populate('media')
    })
    .then((post) => {
      return res.json({
        success: true,
        action: 'post upload media',
        post,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'post upload media',
        message: 'Error uploading post media, try again.',
        error: err,
      })
    })
  },

  postMediaRemove: (req, res) => {
    const { id } = req.params
    let fetchedPost
    Post.findById(id)
    .then((post) => {
      if (!post) {
        return Promise.reject({
          message: 'Post not found, maybe already deleted',
          status: 404,
        })
      }
      fetchedPost = post
      return Media.findById(post.media)
    })
    .then((media) => {
      if (!media) {
        return Promise.reject({ message: 'The post has no media', status: 404 })
      }
      return media.remove()
    })
    .then(() => {
      return Post.findOneAndUpdate({ _id: fetchedPost._id }, { $unset: { media: 1 } }, { new: true }).exec()
    })
    .then((post) => {
      return res.json({
        success: true,
        action: 'remove post media',
        message: 'Post media removed',
        post,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'remove post media',
        message: err.message ? err.message : 'Error removing post host photo, try again.',
        error: err,
      })
    })
  },
}
