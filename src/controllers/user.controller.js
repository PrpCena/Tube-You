import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar is missing");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error uploading error", error);
    throw new ApiError(500, "Failed to uplaod avatar");
  }

  let coverimage;
  try {
    coverimage = await uploadOnCloudinary(coverLocalPath);
    console.log("Uploaded coverimage", coverimage);
  } catch (error) {
    console.log("Error uploading error", error);
    throw new ApiError(500, "Failed to uplaod coverimage");
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverimage: coverimage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const creatdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!creatdUser) {
      throw new ApiError(500, "Something went wrong user not created");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, creatdUser, "User registered successfully"));
  } catch (err) {
    console.log("user creation failed");

    if (avatar?.public_id) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverimage?.public_id) {
      await deleteFromCloudinary(coverimage.public_id);
    }

    throw new ApiError(
      500,
      "Something went wrong user not created, images were deleted"
    );
  }
});

export { registerUser };
