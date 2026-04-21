import { cloudfrontDataURL } from "@/config/constants";
import { fetchFn } from "@/utils";
import { Lang, Testimonial } from "need4deed-sdk";

const headSilhouette = "head-silhouette.webp";

export default async function fetchTestimonials(language: Lang): Promise<Testimonial[]> {
  return [
    {
      name: "Mohsen",
      pic: "mohsen.webp",
      translated_text:
        "Volunteering as a translator with Need4Need has been an incredibly rewarding experience. It has allowed me to bridge language barriers and help individuals feel more connected and understood. The work is not only meaningful but also inspiring, as I've had the chance to meet amazing people and be part of a community that genuinely cares about making a difference. It's fulfilling to know that my small contributions can have a big impact on someone's life.",
      activities: ["Translation at Accommodation Centers", "Accompanying to appointments"],
    },
    {
      name: "Mika",
      pic: "mia.webp",
      translated_text:
        "I recently started volunteering at an accommodation center through Need4Deed, where I offer German tutoring for younger kids. Learning a new language is hard, and school is not easy on everyone, so getting some one-on-one time and having some fun with teaching is great for them (and for me!). It's been great from the start: Coordination went smoothly, and all volunteers at the accommodation center are greeted with such warmth by the whole team.",
      activities: ["Language café"],
    },
    {
      name: "Julia",
      pic: "",
      translated_text:
        "For the past two months, Ziad has been supporting us as a volunteer. He offers math tutoring for older students and is currently working one-on-one with two of them. He’s also helping one of our residents prepare for a degree in Computer Science. Ziad comes in every Monday, and from our perspective, everything is going wonderfully – the feedback from the residents is also consistently positive. Alaa came by for an introductory visit and has now started running a playful English club for children in grades 4 to 6, as well as one-on-one English tutoring for older students. It's a huge benefit that the kids communicate with Alaa exclusively in English – it makes a big difference. Both Ziad and Alaa are incredibly warm and attentive with the children and teens. They’ve been a real asset to our community and have greatly enriched the atmosphere in the house. Thank you so much for the wonderful connection!",
      activities: [],
    },
  ];
  return fetchFn<Testimonial[]>({
    url: `${cloudfrontDataURL}/${language}/testimonials.json`,
    options: { next: { revalidate: 86400 } },
    fnDTO: (data) =>
      data.map((testimonial) => ({
        ...testimonial,
        pic: testimonial.pic || headSilhouette,
      })),
  });
}
