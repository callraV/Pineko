import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Please input your email"),
  password: Yup.string()
    .min(4, "Password must be 4 characters or longer")
    .required("Please input your password"),
});

export const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be 3 characters or longer")
    .required("Please input your username"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Please input your email"),
  password: Yup.string()
    .min(4, "Password must be 4 characters or longer")
    .required("Please input your password"),
});

export const EditProfileSchema = Yup.object().shape({
  username: Yup.string().min(3, "Username must be 3 characters or longer"),
  password: Yup.string().min(4, "Password must be 4 characters or longer"),
});

export const DeleteProfileSchema = Yup.object().shape({
  password: Yup.string()
    .min(4, "Password must be 4 characters or longer")
    .required("Please input your password"),
});
