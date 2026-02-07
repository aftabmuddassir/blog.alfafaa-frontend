import { useMutation } from "@tanstack/react-query";
import { mediaApi } from "@/lib/api";

export function useMediaUpload() {
  return useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      mediaApi.upload(file, altText),
  });
}
