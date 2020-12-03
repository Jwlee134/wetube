import routes from "../routes";
import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 }).populate("creator");
    res.render(`home`, { pageTitle: `Home`, videos });
  } catch (error) {
    console.log(error);
    res.render(`home`, { pageTitle: `Home` });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    }).populate("creator");
  } catch (error) {
    console.log(error);
  }
  res.render(`search`, { pageTitle: `Search`, searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render(`upload`, { pageTitle: `Upload` });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  req.flash("success", "Video uploaded!");
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate({
        path: "comments",
        populate: { path: "creator" },
      });
    video.views += 1;
    video.save();
    res.render(`videoDetail`, { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      res.render(`editVideo`, { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findByIdAndUpdate({ _id: id }, { title, description });
    req.flash("success", "Video updated!");
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
      const idx1 = user.videos.findIndex((video) => video.toString() === id);
      user.videos.splice(idx1, 1);
      user.save();
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const nowUser = await User.findById(user.id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
    nowUser.comments.push(newComment.id);
    nowUser.save();
    const commentInfo = await Comment.findById(newComment.id).populate(
      "creator"
    );
    res.json(commentInfo);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    body: { commentId },
    params: { id },
    user,
  } = req;
  try {
    const comment = await Comment.findById(commentId);
    const video = await Video.findById(id);
    if (req.user.id == comment.creator) {
      await Comment.findByIdAndRemove({ _id: commentId });
      const idx1 = video.comments.findIndex(
        (comment) => comment.toString() === commentId
      );
      video.comments.splice(idx1, 1);
      video.save();
      const idx2 = user.comments.findIndex(
        (comment) => comment.toString() === commentId
      );
      user.comments.splice(idx2, 1);
      user.save();
    } else {
      throw Error();
    }
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
