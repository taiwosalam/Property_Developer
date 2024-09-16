import Image from "next/image";
import Sample from "@/public/empty/SampleProperty.jpeg";
import { CameraIcon } from "@/public/icons/icons";
import TruncatedText from "@/components/TruncatedText/truncated-text";
const PropertyDetails = () => {
  return (
    <div
      className="py-6 px-4 rounded-lg bg-white"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h4 className="text-primary-navy text-lg lg:text-xl font-bold">
        Property Details
      </h4>
      <hr className="my-2.5" />
      <div className="mb-4 md:mb-2.5 flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
        <div className="overflow-x-auto max-w-full flex-grow">
          <div className="min-w-[400px] text-sm md:text-base grid grid-cols-[1fr,26%,1fr] gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[50%,1fr]">
            <div>
              <p className="text-[#747474]">Property Title</p>
              <p className="text-black font-medium">Golden Estate</p>
            </div>
            <div>
              <p className="text-[#747474]">State</p>
              <p className="text-black font-medium">Oyo State</p>
            </div>
            <div>
              <p className="text-[#747474]">Local Government</p>
              <p className="text-black font-medium">Akinyele</p>
            </div>
            <div>
              <p className="text-[#747474]">Full Address</p>
              <p className="text-black font-medium">
                56, Abiola way area Moniya ibadan
              </p>
            </div>
            <div>
              <p className="text-[#747474]">Branch</p>
              <p className="text-black font-medium">Abiola Moniya</p>
            </div>
            <div>
              <p className="text-[#747474]">Account Officer</p>
              <p className="text-black font-medium">Ajadi David</p>
            </div>
            <div>
              <p className="text-[#747474]">Manager</p>
              <p className="text-black font-medium">David James</p>
            </div>
            <div>
              <p className="text-[#747474]">Categories</p>
              <p className="text-black font-medium">Residential</p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-[225px] h-[135px] rounded-2xl relative overflow-hidden cursor-pointer">
          <div className="absolute z-[1] left-[70%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon />
            <p className="text-black font-medium text-[10px]">+23</p>
          </div>
          <Image
            src={Sample}
            alt={""}
            fill
            objectFit="cover"
            objectPosition="center"
            className="object-cover"
          />
        </div>
      </div>
      <div className="lg:flex gap-4">
        <p className="text-[#747474] w-[13.5%]">Description</p>
        <TruncatedText
          className="text-text-quaternary flex-1"
          lines={2}
          text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis,
          earum qui, modi aspernatur autem iste voluptate tenetur maiores
          inventore eum veniam perspiciatis quasi. Explicabo officiis quisquam
          quam, obcaecati neque deserunt. Nemo totam laudantium tempore ipsa
          commodi, reprehenderit atque cumque repudiandae ducimus delectus
          incidunt aperiam, itaque excepturi aut. Officia odio maxime voluptas
          expedita minus soluta natus est explicabo. Nam, praesentium animi?
          Libero accusantium, perspiciatis tempore architecto laboriosam iure
          vero soluta modi pariatur distinctio velit dolores deserunt omnis? Rem
          vitae rerum harum ullam dolorum! Alias architecto, consequuntur
          officiis magni blanditiis corrupti aspernatur! Minus, officia quas a
          ipsum nobis illo quibusdam sequi dicta id laudantium ea dolorum
          nesciunt atque consequuntur fugit necessitatibus placeat itaque
          tenetur maxime eum sit quisquam quod. Quae, illo earum. Asperiores
          quidem sequi quas. Id quibusdam voluptas officiis excepturi officia
          cum voluptates eaque quas? Enim nostrum consectetur voluptates aliquid
          nulla aliquam tempore expedita iste eos? Obcaecati, ex! Velit"
        />
      </div>
    </div>
  );
};

export default PropertyDetails;
