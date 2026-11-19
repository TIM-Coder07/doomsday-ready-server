import { Schema, model, InferSchemaType } from "mongoose";

function isValidBundleSizes(sizes: number[]): boolean {
  const allValid = sizes.every((size) => Number.isInteger(size) && size >= 1 && size <= 500);
  const noDuplicates = new Set(sizes).size === sizes.length;
  return sizes.length >= 1 && sizes.length <= 10 && allValid && noDuplicates;
}

const cinemaSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    bundleSizes: {
      type: [Number],
      required: true,
      validate: {
        validator: isValidBundleSizes,
        message: "bundleSizes must have 1 to 10 different whole numbers, each from 1 to 500",
      },
    },
  },
  { timestamps: true }
);

// Unique name, ignoring upper and lower case
cinemaSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

export type CinemaDoc = InferSchemaType<typeof cinemaSchema>;

export const Cinema = model("Cinema", cinemaSchema);