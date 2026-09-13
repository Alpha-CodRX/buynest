"use client";

import {
  Gift,
  Package,
  UserRound,
  IndianRupee,
} from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Free Delivery",
    description:
      "Lorem Ipsum is simply dummy text of the Testing online.",
  },
  {
    icon: IndianRupee,
    title: "Way To Buy",
    description:
      "Lorem Ipsum is simply dummy text of the Testing online.",
  },
  {
    icon: UserRound,
    title: "Personal Session",
    description:
      "Lorem Ipsum is simply dummy text of the Testing online.",
  },
  {
    icon: Gift,
    title: "Gift Voucher",
    description:
      "Lorem Ipsum is simply dummy text of the Testing online.",
  },
];

export default function Services() {
  return (
    <section className="bg-[#f9f9f9] py-16 sm:py-20 lg:py-5 mt-5">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ============================= */}
        {/* HEADER */}
        {/* ============================= */}

        <div className="mb-6 text-center sm:mb-16">

      <div><h2 className="text-3xl font-bold">  Our Services</h2><p className="mt-1 text-gray-500">Handpicked products for you</p></div>

         

        

        </div>


        {/* ============================= */}
        {/* SERVICES */}
        {/* ============================= */}

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="flex flex-col items-center text-center"
              >

                {/* ICON */}

                <div className="mb-5 flex h-16 w-16 items-center justify-center">
                  <Icon
                    size={56}
                    strokeWidth={1.5}
                    className="text-[#666666]"
                  />
                </div>


                {/* TITLE */}

                <h3 className="text-xl font-medium text-[#111111]">
                  {service.title}
                </h3>


                {/* DESCRIPTION */}

                <p className="mt-2 max-w-xs text-base leading-7 text-[#858585]">
                  {service.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}