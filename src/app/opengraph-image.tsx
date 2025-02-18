import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-gradient-to-r from-pink-500 to-purple-600">
        <div tw="flex flex-col items-center p-8 rounded-3xl shadow-2xl bg-white/90">
          <h1 tw="text-6xl font-bold text-black mb-4 text-center">
            {PROJECT_TITLE}
          </h1>
          <h3 tw="text-3xl text-gray-800 text-center">{PROJECT_DESCRIPTION}</h3>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
