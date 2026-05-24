import { Database } from "@/lib/database.types";

export type Club = Database["public"]["Tables"]["clubs"]["Row"];
export type ClubFormData = Omit<Club, "id" | "created_at"> & { id?: number };
