import { Schema, model, InferSchemaType } from "mongoose";

const movieSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    releaseYear: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100,
      validate: { validator: Number.isInteger, message: "releaseYear must be a whole number" },
    },
    runtime: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
      validate: { validator: Number.isInteger, message: "runtime must be a whole number" },
    },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    watched: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Unique title, ignoring upper and lower case ("Iron Man" equals "iron man")
movieSchema.index({ title: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

export type MovieDoc = InferSchemaType<typeof movieSchema>;

export const Movie = model("Movie", movieSchema);