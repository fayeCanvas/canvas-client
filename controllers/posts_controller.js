// import Post from '../models/reminder';
// import mongoose from 'mongoose';

// const postController = {
//   read(req, res, next) {
//     Post.find({}).then(
//       post => {
//         res.send(post)
//       }
//     )
//   },
//   create(req, res, next) {
//     const props = req.body
//     Post.create(props)
//       .then((post) => {
//         res.send(post)
//       })
//       .catch(next)
//   },
//   show(req, res, next) {
//     const postID = req.params.id
//     Post.find({_id: postID})
//       .then((post) => {
//         res.send(post)
//       }).catch(next)
//   },
//   edit(req, res, next) {
//     const postID = req.params.id
//     const props = req.body
//     Post.findByIdAndUpdate({_id: postID}, props)
//       .then((post) => {
//         res.send(post)
//       })
//       .catch(next)
//   },
//   delete(req, res, next) {
//     const postID = req.params.id;
//     Post.findByIdAndRemove({_id: postID})
//       .then((post) => res.status(204).send(post))
//       .catch(next)
//   },
// }

// export default postController;