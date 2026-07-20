import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/experience/Experience";

export const Route = createFileRoute("/")({
  component: Experience,
});
