import { TableCell, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

type Props = {
  colSpan: number;
  label?: string;
};

export function AdminListLoading({
  colSpan,
  label = "Cargando…",
}: Props) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-12 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      </TableCell>
    </TableRow>
  );
}
