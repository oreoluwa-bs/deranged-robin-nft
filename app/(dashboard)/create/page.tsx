import { HiArrowRight } from "react-icons/hi2";

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

export default function Create() {
  function s() {}
  return (
    <main className="min-h-[calc(100vh-170px)]">
      <section className="main-container">
        <div className="mx-auto max-w-screen-lg py-28">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 bg-black px-4 py-5 backdrop-blur-md">
                <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white">
                  Mint
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white">
                  Share
                </button>
              </div>
            </div>
            <div className="max-w-sdm">
              <form>
                <div className="grid gap-2">
                  <div>
                    <label
                      htmlFor="prompt"
                      className="mb-1 inline-block text-sm"
                    >
                      Prompt
                    </label>
                    <textarea
                      name="prompt"
                      id="prompt"
                      className="min-h-[150px] w-full rounded-lg bg-slate-50/10 px-2 py-2"
                      placeholder="Enter a prompt to create original, realistic images and art from a text description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="width"
                        className="mb-1 inline-block text-sm"
                      >
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
                      <label
                        htmlFor="height"
                        className="mb-1 inline-block text-sm"
                      >
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
                <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white">
                  Generate
                  <HiArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
// 539.98px
