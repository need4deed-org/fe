import { cloudfrontDataURL } from "@/config/constants";
import { fetchFn } from "@/utils";
import { Lang, Testimonial } from "need4deed-sdk";

const headSilhouette = "head-silhouette.webp";

export default async function fetchTestimonials(language: Lang): Promise<Testimonial[]> {
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
