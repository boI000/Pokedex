import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const editSchema = z.object({
  height: z
    .number({ error: "Wzrost jest wymagany" })
    .int({ error: "Wzrost musi być liczbą całkowitą" })
    .positive({ error: "Wzrost musi być większy od 0" }),
  weight: z
    .number({ error: "Waga jest wymagana" })
    .int({ error: "Waga musi być liczbą całkowitą" })
    .positive({ error: "Waga musi być większa od 0" }),
  base_experience: z
    .number({ error: "Doświadczenie jest wymagane" })
    .int({ error: "Doświadczenie musi być liczbą całkowitą" })
    .nonnegative({ error: "Doświadczenie nie może być ujemne" }),
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
      enqueueSnackbar(`Zmieniono atrybuty ${foundPokemon.name}`, {
        variant: "success",
      });
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
      <h1>Edytuj: {foundPokemon.name}</h1>

      <label htmlFor="height">Wzrost</label>
      <input
        id="height"
        type="number"
        {...register("height", { valueAsNumber: true })}
      />
      {errors.height && <p className="form-error">{errors.height.message}</p>}

      <label htmlFor="weight">Waga</label>
      <input
        id="weight"
        type="number"
        {...register("weight", { valueAsNumber: true })}
      />
      {errors.weight && <p className="form-error">{errors.weight.message}</p>}

      <label htmlFor="base_experience">Doświadczenie</label>
      <input
        id="base_experience"
        type="number"
        {...register("base_experience", { valueAsNumber: true })}
      />
      {errors.base_experience && <p className="form-error">{errors.base_experience.message}</p>}

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Zapisywanie..." : "Zmień atrybuty"}
      </button>
    </form>
  );
};

export default EditPokemonForm;
