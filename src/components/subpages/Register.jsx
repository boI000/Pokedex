import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
      .min(3, { error: "Name must be at least 3 characters long" }),
    email: z.email({ error: "Provide a valid e-mail address" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        error: "Password must contain at least one capital character",
      })
      .regex(/[0-9]/, { error: "Password must contain at least one number" })
      .regex(/[!@#$%^&*]/, {
        error: "Password must contain at least one special character",
      })
      .regex(/^\S+$/, { error: "Password must not contain spaces" }),
    repeatPassword: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    error: "Passwords do not match",
    path: ["repeatPassword"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormWrapper>
      <FormStyle noValidate onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input id="name" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
        <label htmlFor="repeatPassword">Repeat password</label>
        <input
          id="repeatPassword"
          type="password"
          {...register("repeatPassword")}
        />
        {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
        <button type="submit">Register</button>
      </FormStyle>
    </FormWrapper>
  );
};

export default Register;
