import { useQuery } from "@tanstack/react-query";
import { Lang, Testimonial } from "need4deed-sdk";
import { cloudfrontDataURL } from "../../config/constants";
import { fetchFn } from "./utils";

const staleTime = 1000 * 60 * 60 * 24; // 1d
const headSilhouette = "head-silhouette.webp";

export default function useTestimonials(language: Lang): [Testimonial[], boolean, boolean] {
  const {
    data: testimonials,
    isLoading,
    isError,
  } = useQuery<Testimonial[], Error, Testimonial[], string[]>({
    queryKey: ["testimonials", language],
    queryFn: () =>
      fetchFn<Testimonial[]>({
        url: `${cloudfrontDataURL}/${language}/testimonials.json`,
        fnDTO: (data) =>
          data.map((testimonial) => ({
            ...testimonial,
            pic: testimonial.pic || headSilhouette,
          })),
      }),
    staleTime,
  });

  if (isError) {
    console.error("Error fetching testimonials");
  }

  return [testimonials || [], isLoading, isError];
}
