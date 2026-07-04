import User from "../models/User.js";

export const searchUsers = async (req, res) => {

    const keyword = req.query.search
        ? {
              username: {
                  $regex: req.query.search,
                  $options: "i"
              }
          }
        : {};

    const users = await User.find(keyword)
        .select("-password");

    res.json(users);

};