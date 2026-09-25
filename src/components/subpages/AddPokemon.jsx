import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const createPokemonSchema = z.object({
  name: z.string().trim().min(1, { error: "Pokemon name is required" }),
  weight: z
    .number({ error: "Weight is required" })
    .int({ error: "Weight must be a whole number" })
    .positive({ error: "Weight must be greater than 0" }),
  height: z
    .number({ error: "Height is required" })
    .int({ error: "Height must be a whole number" })
    .positive({ error: "Height must be greater than 0" }),
  base_experience: z
    .number({ error: "Experience is required" })
    .int({ error: "Experience must be a whole number" })
    .nonnegative({ error: "Experience cannot be negative" }),
});

const AddPokemon = () => {
  const { pokemons, createPokemon } = usePokemonContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [selectedImageId, setSelectedImageId] = useState(151);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedImageId}.png`;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createPokemonSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await createPokemon(data, selectedImageId);
      enqueueSnackbar(`New Pokemon: ${data.name} created successfully`, {
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

  const isImageUsed = pokemons.some(
    (pokemon) =>
      pokemon.source === "custom" && pokemon.imageId === selectedImageId,
  );

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h1>Create Pokemon</h1>

      <img
        src={imageUrl}
        alt={`Pokemon artwork no. ${selectedImageId}`}
        style={{ opacity: isImageUsed ? 0.35 : 1 }}
      />
      {isImageUsed && <p>Image already used!</p>}
      <div>
        <button
          type="button"
          disabled={selectedImageId === 151}
          onClick={() => setSelectedImageId((prev) => prev - 1)}
        >
          prev
        </button>
        {selectedImageId}
        <button
          type="button"
          onClick={() => setSelectedImageId((prev) => prev + 1)}
        >
          next
        </button>
      </div>

      <label htmlFor="name">Name</label>
      <input id="name" {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}

      <label htmlFor="weight">Weight</label>
      <input
        id="weight"
        type="number"
        {...register("weight", { valueAsNumber: true })}
      />
      {errors.weight && <p>{errors.weight.message}</p>}

      <label htmlFor="height">Height</label>
      <input
        id="height"
        type="number"
        {...register("height", { valueAsNumber: true })}
      />
      {errors.height && <p>{errors.height.message}</p>}

      <label htmlFor="base_experience">Experience</label>
      <input
        id="base_experience"
        type="number"
        {...register("base_experience", { valueAsNumber: true })}
      />
      {errors.base_experience && <p>{errors.base_experience.message}</p>}

      <button type="submit" disabled={isSubmitting || isImageUsed}>
        Create
      </button>
    </form>
  );
};

export default AddPokemon;
