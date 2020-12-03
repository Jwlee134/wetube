import routes from "../routes";
import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
import passport from "passport";

export const getJoin = (req, res) => {
  res.render(`join`, { pageTitle: `Join` });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords don't match.");
    res.status(400);
    res.render(`join`, { pageTitle: `Join` });
  } else {
    try {
      const newUser = await User({
        name,
        email,
        avatarUrl:
          "https://wetubejw.s3.ap-northeast-2.amazonaws.com/avatar/bd15c0e92653e5976a50ed43bd15343f",
      });
      await User.register(newUser, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render(`login`, { pageTitle: `Login` });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome!",
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.avatarUrl = avatar_url;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate("kakao");

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: {
      id,
      kakao_account: {
        email,
        profile: { nickname, profile_image_url },
      },
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      (user.name = nickname), (user.kakaoId = id), user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      name: nickname,
      email: email,
      kakaoId: id,
      avatarUrl: profile_image_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postkakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash("info", "Logged out, See you later!");
  req.logout();
  res.redirect(routes.home);
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render(`userDetail`, { pageTitle: `User Detail`, user });
  } catch (error) {
    req.flash("error", "User not found.");
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render(`editProfile`, { pageTitle: `Edit Profile` });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? `${file.location}` : req.user.avatarUrl,
    });
    req.flash("success", "Profile updated!");
    res.redirect(routes.userDetail(req.user.id));
  } catch (error) {
    req.flash("error", "Can't update profile.");
    console.log(error);
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render(`changePassword`, { pageTitle: `Change Password` });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Passwords don't match.");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    req.flash("success", "Password updated!");
    res.redirect(routes.userDetail(req.user.id));
  } catch (error) {
    req.flash("error", "Can't change password.");
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};

export const deleteAccount = async (req, res) => {
  const { user } = req;
  try {
    const nowUser = await User.findById(user.id)
      .populate("videos")
      .populate("comments");
    nowUser.videos.forEach(
      async (video) => await Video.findByIdAndRemove(video.id)
    );
    nowUser.comments.forEach(
      async (comment) => await Comment.findByIdAndRemove(comment.id)
    );
    await User.findByIdAndRemove(user.id);
    res.redirect(routes.home);
  } catch (error) {
    console.log(error);
    res.redirect(routes.editProfile);
  }
};
