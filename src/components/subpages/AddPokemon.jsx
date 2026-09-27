import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const createPokemonSchema = z.object({
  name: z.string().trim().min(1, { error: "Nazwa Pokemona jest wymagana" }),
  weight: z
    .number({ error: "Waga jest wymagana" })
    .int({ error: "Waga musi być liczbą całkowitą" })
    .positive({ error: "Waga musi być większa od 0" }),
  height: z
    .number({ error: "Wzrost jest wymagany" })
    .int({ error: "Wzrost musi być liczbą całkowitą" })
    .positive({ error: "Wzrost musi być większy od 0" }),
  base_experience: z
    .number({ error: "Doświadczenie jest wymagane" })
    .int({ error: "Doświadczenie musi być liczbą całkowitą" })
    .nonnegative({ error: "Doświadczenie nie może być ujemne" }),
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
      enqueueSnackbar(`Nowy Pokemon ${data.name} został dodany`, {
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

  const isImageUsed = pokemons.some(
    (pokemon) =>
      pokemon.source === "custom" && pokemon.imageId === selectedImageId,
  );

  return (
    <form className="app-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <h1>Stwórz Pokemona</h1>

      <div className="artwork-picker">
        <img src={imageUrl} alt={`Pokemon numer ${selectedImageId}`} style={{ opacity: isImageUsed ? 0.35 : 1 }} />
        {isImageUsed && <p className="form-error">Ta grafika jest już używana.</p>}
      </div>
      <div className="image-navigation">
        <button
          className="secondary-button"
          type="button"
          disabled={selectedImageId === 151}
          onClick={() => setSelectedImageId((prev) => prev - 1)}
        >
          Poprzedni
        </button>
        {selectedImageId}
        <button
          className="secondary-button"
          type="button"
          disabled={selectedImageId === 1025}
          onClick={() => setSelectedImageId((prev) => prev + 1)}
        >
          Następny
        </button>
      </div>

      <label htmlFor="name">Nazwa</label>
      <input id="name" {...register("name")} />
      {errors.name && <p className="form-error">{errors.name.message}</p>}

      <label htmlFor="weight">Waga</label>
      <input
        id="weight"
        type="number"
        {...register("weight", { valueAsNumber: true })}
      />
      {errors.weight && <p className="form-error">{errors.weight.message}</p>}

      <label htmlFor="height">Wzrost</label>
      <input
        id="height"
        type="number"
        {...register("height", { valueAsNumber: true })}
      />
      {errors.height && <p className="form-error">{errors.height.message}</p>}

      <label htmlFor="base_experience">Doświadczenie</label>
      <input
        id="base_experience"
        type="number"
        {...register("base_experience", { valueAsNumber: true })}
      />
      {errors.base_experience && <p className="form-error">{errors.base_experience.message}</p>}

      <button className="primary-button" type="submit" disabled={isSubmitting || isImageUsed}>
        {isSubmitting ? "Tworzenie..." : "Stwórz"}
      </button>
    </form>
  );
};

export default AddPokemon;
