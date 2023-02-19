"use client";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import { CgSpinnerTwo } from "react-icons/cg";
import { Prediction } from "~/types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const imageSizes = [
  "128",
  "256",
  "384",
  "448",
  "512",
  "576",
  "640",
  "704",
  "768",
  "832",
  "896",
  "960",
  "1024",
];

interface GenerateNFTFormProps {
  existingPrediction: Prediction | null;
  onSuccess?: (prediction: Prediction) => void;
}

export default function GenerateNFTForm({
  existingPrediction,
  onSuccess = (v) => {
    console.log(v);
  },
}: GenerateNFTFormProps) {
  const [errors, setErrors] = useState<{ message: string | null }>({
    message: null,
  });
  const isPredicting = existingPrediction
    ? existingPrediction.status !== "succeeded" &&
      existingPrediction.status !== "failed"
    : false;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Throw error
    if (!e.target) return;

    const formdata = new FormData(e.target as HTMLFormElement);
    const fields = Object.fromEntries(formdata) as {
      prompt: string;
      width: string;
      height: string;
    };

    // console.log(fields);
    const response = await fetch("/api/nft/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    let { data: prediction, message } = (await response.json()) as {
      message: string;
      data: Prediction;
    };
    if (response.status !== 201) {
      setErrors({ message });
      return;
    }
    // setPrediction(prediction);
    onSuccess(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/nft/generated/" + prediction.id);
      const res = await response.json();
      prediction = res.data;
      message = res.message;

      if (response.status !== 200) {
        setErrors({ message });
        return;
      }
      onSuccess(prediction);
    }
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div>
            <label htmlFor="prompt" className="mb-1 inline-block text-sm">
              Prompt
            </label>
            <textarea
              name="prompt"
              id="prompt"
              className="min-h-[150px] w-full rounded-lg bg-slate-50/10 px-2 py-2"
              placeholder="Enter a prompt to create original, realistic images and art from a text description"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="width" className="mb-1 inline-block text-sm">
                Width
              </label>
              <select
                name="width"
                id="width"
                defaultValue={imageSizes[4]}
                className="w-full rounded-lg bg-slate-50/10 px-2 py-2"
              >
                {imageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {/* Width of output image. Maximum size is 1024x768 or 768x1024 because of memory limits */}
            </div>
            <div>
              <label htmlFor="height" className="mb-1 inline-block text-sm">
                Height
              </label>
              <select
                name="height"
                id="height"
                defaultValue={imageSizes[4]}
                className="w-full rounded-lg bg-slate-50/10 px-2 py-2"
              >
                {imageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {/* Height of output image. Maximum size is 1024x768 or 768x1024 because of memory limits */}
            </div>
          </div>
        </div>
        <button
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300/5"
          disabled={isPredicting}
        >
          Generate
          {isPredicting ? (
            <CgSpinnerTwo className="animate-spin" />
          ) : (
            <HiArrowRight />
          )}
        </button>
      </form>
      {errors.message ? (
        <div className="mt-10">
          <div role="alert" className="rounded-md bg-red-500 px-4 py-2">
            {errors.message}
          </div>
        </div>
      ) : null}
    </>
  );
}
