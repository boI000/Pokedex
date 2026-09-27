import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.email({ error: "Podaj poprawny adres e-mail" }).toLowerCase(),
  password: z.string().min(1, { error: "Podaj hasło" }),
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
        enqueueSnackbar("Niepoprawny e-mail lub hasło", {
          variant: "error",
        });
        return;
      }

      login(user);
      enqueueSnackbar("Zalogowano pomyślnie", {
        variant: "success",
      });
      reset();
      navigate("/");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Wystąpił błąd. Spróbuj ponownie.", {
        variant: "error",
      });
    }
  };

  return (
    <form className="app-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <h1>Logowanie</h1>
      {location.state?.message && <p>{location.state?.message}</p>}
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" {...register("email")} />
      {errors.email && <p className="form-error">{errors.email.message}</p>}
      <label htmlFor="password">Hasło</label>
      <input id="password" type="password" {...register("password")} />
      {errors.password && <p className="form-error">{errors.password.message}</p>}

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logowanie..." : "Zaloguj się"}
      </button>
    </form>
  );
};

export default Login;
