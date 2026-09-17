import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthContext } from "../../context/AuthProvider";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.email({ error: "Provide a valid e-mail address" }).toLowerCase(),
  password: z.string().min(1, { error: "Provide a password" }),
});

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    const BASE_URL = "http://localhost:3000";

    try {
      const response = await fetch(
        `${BASE_URL}/users?email=${encodeURIComponent(data.email)}`,
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const foundUser = await response.json();
      const user = foundUser[0];

      if (!user || user.password !== data.password) {
        enqueueSnackbar("Invalid email or password", {
          variant: "error",
        });
        return;
      }

      login(user);
      enqueueSnackbar("Login succeful", {
        variant: "success",
      });
      reset();
      navigate("/");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("An error has occurred. Try again!", {
        variant: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {location.state?.message && <p>{location.state?.message}</p>}
      <label htmlFor="email">Email</label>
      <input id="email" type="email" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">Password</label>
      <input id="password" type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        Log in
      </button>
    </form>
  );
};

export default Login;
