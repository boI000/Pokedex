import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { error: "Imię musi mieć co najmniej 3 znaki" }),
    email: z.email({ error: "Podaj poprawny adres e-mail" }).toLowerCase(),
    password: z
      .string()
      .min(8, { error: "Hasło musi mieć co najmniej 8 znaków" })
      .regex(/[A-Z]/, {
        error: "Hasło musi zawierać co najmniej jedną wielką literę",
      })
      .regex(/[0-9]/, { error: "Hasło musi zawierać co najmniej jedną cyfrę" })
      .regex(/[!@#$%^&*]/, {
        error: "Hasło musi zawierać co najmniej jeden znak specjalny",
      })
      .regex(/^\S+$/, { error: "Hasło nie może zawierać spacji" }),
    repeatPassword: z
      .string()
      .min(8, { error: "Hasło musi mieć co najmniej 8 znaków" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    error: "Hasła nie są takie same",
    path: ["repeatPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    const BASE_URL = "http://localhost:3000/";

    try {
      const checkResponse = await fetch(
        `${BASE_URL}users?email=${encodeURIComponent(data.email)}`,
      );
      if (!checkResponse.ok) {
        throw new Error(`Response: ${checkResponse.status}`);
      }
      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        enqueueSnackbar("Użytkownik z tym adresem e-mail już istnieje", {
          variant: "warning",
        });
        return;
      }

      const { name, email, password } = data;
      const userPayload = { name, email, password, favourites: [] };

      const createResponse = await fetch(`${BASE_URL}users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });
      if (!createResponse.ok) {
        throw new Error(`Response : ${createResponse.status}`);
      }
      enqueueSnackbar("Konto zostało utworzone", {
        variant: "success",
      });
      reset();
      navigate("/login");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Wystąpił błąd. Spróbuj ponownie.", {
        variant: "error",
      });
    }
  };

  return (
    <FormWrapper>
      <FormStyle className="app-form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <h1>Rejestracja</h1>
        <label htmlFor="name">Imię</label>
        <input id="name" {...register("name")} />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
        <label htmlFor="password">Hasło</label>
        <input id="password" type="password" {...register("password")} />
        {errors.password && <p className="form-error">{errors.password.message}</p>}
        <label htmlFor="repeatPassword">Powtórz hasło</label>
        <input
          id="repeatPassword"
          type="password"
          {...register("repeatPassword")}
        />
        {errors.repeatPassword && <p className="form-error">{errors.repeatPassword.message}</p>}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>
        <Link className="form-link" to={"/login"}>Masz już konto? Zaloguj się</Link>
      </FormStyle>
    </FormWrapper>
  );
};

export default Register;
