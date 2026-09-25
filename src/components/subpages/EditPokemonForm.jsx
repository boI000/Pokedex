import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const editSchema = z.object({
  height: z
    .number({ error: "Height is required" })
    .int({ error: "Height must be a whole number" })
    .positive({ error: "Height must be greater than 0" }),
  weight: z
    .number({ error: "Weight is required" })
    .int({ error: "Weight must be a whole number" })
    .positive({ error: "Weight must be greater than 0" }),
  base_experience: z
    .number({ error: "Experience is required" })
    .int({ error: "Experience must be a whole number" })
    .nonnegative({ error: "Experience cannot be negative" }),
});

const EditPokemonForm = ({ pokemon: foundPokemon }) => {
  const { editPokemon } = usePokemonContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      height: foundPokemon.height,
      weight: foundPokemon.weight,
      base_experience: foundPokemon.base_experience,
    },
    resolver: zodResolver(editSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await editPokemon(foundPokemon.id, data);
      enqueueSnackbar(`${foundPokemon.name} attributes changed successfully`, {
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("An error has occurred, try again", {
        variant: "error",
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h1>Edit {foundPokemon.name}</h1>

      <label htmlFor="height">Height</label>
      <input
        id="height"
        type="number"
        {...register("height", { valueAsNumber: true })}
      />
      {errors.height && <p>{errors.height.message}</p>}

      <label htmlFor="weight">Weight</label>
      <input
        id="weight"
        type="number"
        {...register("weight", { valueAsNumber: true })}
      />
      {errors.weight && <p>{errors.weight.message}</p>}

      <label htmlFor="base_experience">Experience</label>
      <input
        id="base_experience"
        type="number"
        {...register("base_experience", { valueAsNumber: true })}
      />
      {errors.base_experience && <p>{errors.base_experience.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        Change attributes
      </button>
    </form>
  );
};

export default EditPokemonForm;
